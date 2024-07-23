set -e
echo "Updating WAHA..."
echo "Logging in to Docker..."
docker login -u devlikeapro # -p {KEY} - you can hard code key here https://portal.devlike.pro/

echo "Pulling the latest image..."
docker pull devlikeapro/waha-plus

echo "Logging out of Docker..."
docker logout

# Just pull if you're using WAHA Core
# docker pull devlikeapro/waha

echo "Stopping the current container..."
docker stop waha || true
echo "Removing the current container..."
docker rm waha || true

echo "Running WAHA..."
sh ./waha-run.sh
