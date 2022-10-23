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
	globalCounterKey   = "GLOBAL_COUNTER_"
	reportedURLVoteKey = "URL_VOTES_"
)

type URLReport struct {
	URL     string `json:"url"`
	Reports int64  `json:"reports"`
}

var redisClient *redis.Client
var mtx sync.Mutex
var glblCtr int64

func CORSMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
			c.Writer.Header().Set("Access-Control-Allow-Origin", "*")
			c.Writer.Header().Set("Access-Control-Allow-Credentials", "true")
			c.Writer.Header().Set("Access-Control-Allow-Headers", "Content-Type, Content-Length, Accept-Encoding, X-CSRF-Token, Authorization, accept, origin, Cache-Control, X-Requested-With")
			c.Writer.Header().Set("Access-Control-Allow-Methods", "POST, OPTIONS, GET, PUT")

			if c.Request.Method == "OPTIONS" {
					c.AbortWithStatus(204)
					return
			}

			c.Next()
	}
}

func main() {
	err := establishRedisConnection()
	glblCtr = 0

	if err != nil {
		fmt.Println("Backend start failed.\nFailed to connect to Redis.")
		fmt.Println(err.Error())
		return
	}

	router := gin.New()  
	router.Use(CORSMiddleware())
	
	router.GET("/redistalk/ping", getRedisStatus)
	router.POST("/redistalk/set", setRedisKeyValue)
	router.GET("/redistalk/get/:key", getRedisKey)

	router.GET("/conversion/gtu/:gib", getGiberishToURL)
	router.GET("/conversion/utg/:url", getURLToGiberish)

	router.GET("/report/count/:url", getURLReportCounts)
	router.POST("/report/increment/url/:url", incURLReportCount)
	router.GET("/report/allurls", getAllURLReports)
	router.POST("/report/increment/gib/:gib", incGibReportCount(router)) //if sent in giberish instead of url to increment report count
	router.Run(":8080")
}

func getGiberishToURL(c *gin.Context) {
	//Gets Encoded URL and decodes it back to the original URL
	gibString := string(c.Param("gib"))

	ctrKey, err := decode(gibString)
	if err != nil {
		c.JSON(http.StatusInternalServerError, err.Error())
		return
	}

	lookupKey := globalCounterKey + strconv.FormatInt(ctrKey, 10)
	urlString, err := redisClient.Get(lookupKey).Result()

	if err != nil && err != redis.Nil {
		c.JSON(http.StatusInternalServerError, fmt.Sprintf("error: %s", err))
		return
	} else if err == redis.Nil {
		c.JSON(http.StatusBadRequest, "Non existent Gib")
		return
	} else {
		c.JSON(http.StatusOK, urlString)
	}
}

func getURLToGiberish(c *gin.Context) {
	//Converts URL to the encoded URL by using the global counter.
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
}

func getURLReportCounts(c *gin.Context) {
	//Gets the number of reports for a URL.
	urlString := string(c.Param("url"))
	lookupKey := reportedURLVoteKey + urlString
	val, err := redisClient.Get(lookupKey).Result()

	if err != nil && err != redis.Nil {
		c.JSON(http.StatusInternalServerError, fmt.Sprintf("error: %s", err))
		return
	} else if err == redis.Nil {
		c.JSON(http.StatusOK, 0)
	} else {
		c.JSON(http.StatusOK, val)
	}

}

func incURLReportCount(c *gin.Context) {
	//Increases the Report count for a URL by 1.
	urlString := string(c.Param("url"))
	lookupKey := reportedURLVoteKey + urlString
	val, err := redisClient.Get(lookupKey).Result()

	if err != nil && err != redis.Nil {
		c.JSON(http.StatusInternalServerError, fmt.Sprintf("Failed to retrieve existing votes from DB. Error:%s", err))
		return
	} else if err == redis.Nil {
		// set to 1
		err = redisClient.Set(lookupKey, 1, 0).Err()
		if err != nil {
			c.JSON(http.StatusInternalServerError, fmt.Sprintf("Failed to add vote to DB. Error: %s", err))
			return
		}
		c.Status(http.StatusOK)
	} else {
		// increment by 1
		currentVotes, err := strconv.ParseInt(val, 10, 64)
		if err != nil {
			c.JSON(http.StatusInternalServerError, fmt.Sprintf("Failed to parse existing votes from DB. Error: %s", err))
			return
		}
		err = redisClient.Set(lookupKey, currentVotes+1, 0).Err()
		if err != nil {
			c.JSON(http.StatusInternalServerError, fmt.Sprintf("Failed to add vote to DB. Error: %s", err))
			return
		}
		c.Status(http.StatusOK)
	}
}
func incGibReportCount(root *gin.Engine) gin.HandlerFunc { 
	//Increases the report count for a URL by 1, except the function is given the encoded version of the URL.
	return func (c *gin.Context) {
		gibString := string(c.Param("gib"))
		ctrKey, err := decode(gibString)
		if err != nil {
			c.JSON(http.StatusInternalServerError, err.Error())
			return
		}

		lookupKey := globalCounterKey + strconv.FormatInt(ctrKey, 10)
		urlString, err2 := redisClient.Get(lookupKey).Result()

		if err2 != nil && err2 != redis.Nil {
			c.JSON(http.StatusInternalServerError, fmt.Sprintf("error: %s", err))
			return
		} else if err2 == redis.Nil {
			c.JSON(http.StatusBadRequest, "Non existent Gib")
			return
		} else {
			c.Request.URL.Path = "/report/increment/url/" + urlString
			root.HandleContext(c)
			c.Abort()
		}
	}
}

func getAllURLReports(c *gin.Context) {
	//Gets the number of reports for all the URLs.
	lookupKey := globalCounterKey + "*"
	allURLs, err := redisClient.Keys(lookupKey).Result()
	if err != nil && err != redis.Nil {
		c.JSON(http.StatusInternalServerError, fmt.Sprintf("Failed to retrieve existing URLs from DB. Error:%s", err))
		return
	} else if err == redis.Nil {
		c.JSON(http.StatusBadRequest, "Empty DB")
		return
	} else {
		var links []URLReport
		for _, ctrVal := range allURLs {
			link, _ := redisClient.Get(string(ctrVal)).Result()
			voteCount, err := redisClient.Get(reportedURLVoteKey + link).Result()
			if err != nil && err != redis.Nil {
				c.JSON(http.StatusInternalServerError, fmt.Sprintf("Failed to retrieve existing vote from DB. Error:%s", err))
				return
			} else if err == redis.Nil {
				links = append(links, URLReport{
					URL:     link,
					Reports: 0,
				})
			} else {
				currentVoteCount, err := strconv.ParseInt(voteCount, 10, 64)
				if err != nil {
					c.JSON(http.StatusInternalServerError, fmt.Sprintf("Failed to parse existing votes from DB. Error: %s", err))
					return
				}
				links = append(links, URLReport{
					URL:     link,
					Reports: currentVoteCount,
				})
			}
		}
		c.JSON(http.StatusOK, links)
	}
}

func establishRedisConnection() error {
	//Establishes connection with Redis through Go-redis.
	redisClient = redis.NewClient(&redis.Options{
		Addr:     "host.docker.internal:6379",
		Password: "",
		DB:       0,
	})
	_, err := redisClient.Ping().Result()

	return err
}

func getRedisStatus(c *gin.Context) {
	//Gets the status of the Redis. Should send pong if successful.
	pong, err := redisClient.Ping().Result()

	if err != nil {
		c.JSON(http.StatusInternalServerError, fmt.Sprintf("error: %s", err))
		return
	}
	c.JSON(http.StatusOK, pong)
	// fmt.Println(pong, err)
}

func setRedisKeyValue(c *gin.Context) {
	//Sets the Redis key-value pair.
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
	//Gets the value in Redis based on the given key.
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
