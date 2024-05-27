docker build . -t ytmusic-backend
docker rm -f ytmusic-backend
docker run --name=ytmusic-backend --restart=always --network=my-network -d ytmusic-backend
