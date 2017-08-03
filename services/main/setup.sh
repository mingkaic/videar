set -e

# install ffmpeg
apt-get install -y ffmpeg

# install npm dependencies
npm install

# todo: remove dev dependencies in deployment
npm install --only=dev
