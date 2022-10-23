docker pull redis

docker stop data-defenders-redisdb
docker rm data-defenders-redisdb

docker run --name data-defenders-redisdb -p 6379:6379 -v "${PWD}":/main -d redis

# Interactive
# docker exec -it data-defenders-redisdb bash