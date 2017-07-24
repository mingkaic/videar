# install essentials
apt-get update \
    && apt-get -qq update \
    && apt-get clean \
    && apt-get -y dist-upgrade \
    && apt-get install -y curl \
    && apt-get install -y build-essential

# install node and npm
apt-get install -y python-software-properties
curl -sL https://deb.nodesource.com/setup_8.x | bash -
apt-get install -y nodejs
mv /usr/bin/nodejs /usr/bin/node

# install ffmpegççç 
apt-get install -y ffmpeg
