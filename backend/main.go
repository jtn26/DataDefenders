package main

import (
	"fmt"
	"net/http"
	"strconv"
	"sync"

	"github.com/gin-gonic/gin"
	"github.com/go-redis/redis"
)

const (
	globalCounterKey = "GLOBAL_COUNTER_"
)

// album represents data about a record album.
type album struct {
	ID     string  `json:"id"`
	Title  string  `json:"title"`
	Artist string  `json:"artist"`
	Price  float64 `json:"price"`
}

// albums slice to seed record album data.
var albums = []album{
	{ID: "1", Title: "Blue Train", Artist: "John Coltrane", Price: 56.99},
	{ID: "2", Title: "Jeru", Artist: "Gerry Mulligan", Price: 17.99},
	{ID: "3", Title: "Sarah Vaughan and Clifford Brown", Artist: "Sarah Vaughan", Price: 39.99},
}

var redisClient *redis.Client
var mtx sync.Mutex
var glblCtr int64

func main() {

	err := establishRedisConnection()
	glblCtr = 0

	if err != nil {
		fmt.Println("Backend start failed.\nFailed to connect to Redis.")
		fmt.Println(err.Error())
		return
	}

	router := gin.Default()
	router.GET("/albums", getAlbums)
	router.GET("/albums/:id", getAlbumByID)
	router.GET("/redistalk/ping", getRedisStatus)
	router.POST("/albums", postAlbums)
	router.POST("/redistalk/set", setRedisKeyValue)
	router.GET("/redistalk/get/:key", getRedisKey)

	router.GET("/conversion/gtu/:gib", getGiberishToURL)
	router.GET("/conversion/utg/:url", getURLToGiberish)

	router.Run(":8080")
}

func getGiberishToURL(c *gin.Context) {
	gibString := string(c.Param("gib"))

	val, err := redisClient.Get(urlString).Result()
	urlString, err := decode(gibString)

	if err != nil {
		c.JSON(http.StatusInternalServerError, err.Error())
		return
	}
	c.JSON(http.StatusOK, urlString)
}

func getURLToGiberish(c *gin.Context) {
	urlString := string(c.Param("url"))
	val, err := redisClient.Get(urlString).Result()

	if err != nil && err != redis.Nil {
		c.JSON(http.StatusInternalServerError, fmt.Sprintf("error: %s", err))
		return
	} else if err == redis.Nil {
		// Get updated counter
		mtx.Lock()
		defer mtx.Unlock()
		glblCtr = glblCtr + 1

		// Use counter to get encoding
		gibString := encode(glblCtr)

		// Save encoding for future
		err := redisClient.Set(urlString, gibString, 0).Err()

		if err != nil {
			c.JSON(http.StatusInternalServerError, fmt.Sprintf("Failed to save u2g map to DB. Error: %s", err))
			return
		}

		// Save Global Counter mapping for decoding
		counterKey := globalCounterKey + strconv.FormatInt(glblCtr, 10)
		err = redisClient.Set(counterKey, urlString, 0).Err()

		if err != nil {
			c.JSON(http.StatusInternalServerError, fmt.Sprintf("Failed to add c2u map to DB. Error: %s", err))
			return
		}

		c.JSON(http.StatusOK, gibString)

	} else {
		c.JSON(http.StatusOK, val)
	}

	// gibString := encode(urlString)

	// c.JSON(http.StatusOK, gibString)
}

func establishRedisConnection() error {

	redisClient = redis.NewClient(&redis.Options{
		Addr:     "host.docker.internal:6379",
		Password: "",
		DB:       0,
	})
	_, err := redisClient.Ping().Result()

	return err
}

// getAlbums responds with the list of all albums as JSON.
func getAlbums(c *gin.Context) {
	c.IndentedJSON(http.StatusOK, albums)
}

// postAlbums adds an album from JSON received in the request body.
func postAlbums(c *gin.Context) {
	var newAlbum album

	// Call BindJSON to bind the received JSON to
	// newAlbum.
	if err := c.BindJSON(&newAlbum); err != nil {
		return
	}

	// Add the new album to the slice.
	albums = append(albums, newAlbum)
	c.IndentedJSON(http.StatusCreated, newAlbum)
}

// getAlbumByID locates the album whose ID value matches the id
// parameter sent by the client, then returns that album as a response.
func getAlbumByID(c *gin.Context) {
	id := c.Param("id")

	// Loop through the list of albums, looking for
	// an album whose ID value matches the parameter.
	for _, a := range albums {
		if a.ID == id {
			c.IndentedJSON(http.StatusOK, a)
			return
		}
	}
	c.IndentedJSON(http.StatusNotFound, gin.H{"message": "album not found"})
}

func getRedisStatus(c *gin.Context) {
	pong, err := redisClient.Ping().Result()

	if err != nil {
		c.JSON(http.StatusInternalServerError, fmt.Sprintf("error: %s", err))
		return
	}
	c.JSON(http.StatusOK, pong)
	// fmt.Println(pong, err)
}

func setRedisKeyValue(c *gin.Context) {
	key := string(c.PostForm("key"))
	value := string(c.PostForm("value"))
	err := redisClient.Set(key, value, 0).Err()

	if err != nil {
		c.JSON(http.StatusInternalServerError, fmt.Sprintf("error: %s", err))
		return
	}
	c.Status(http.StatusOK)
}

func getRedisKey(c *gin.Context) {
	key := string(c.Param("key"))
	val, err := redisClient.Get(key).Result()

	if err != nil && err != redis.Nil {
		c.JSON(http.StatusInternalServerError, fmt.Sprintf("error: %s", err))
		return
	} else if err == redis.Nil {
		c.JSON(http.StatusBadRequest, "Key Does Not Exists!")
	}

	c.JSON(http.StatusOK, val)
}
