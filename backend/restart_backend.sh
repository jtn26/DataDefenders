docker pull golang

docker rm data-defenders-backend

docker run -d -p 8080:8080 -v $(pwd):/go/src -w "/go/src/" --name data-defenders-backend golang go run .

# Interactive
# docker exec -it data-defenders-backend bash