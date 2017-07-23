apt-get update && apt-get -y dist-upgrade
apt-get install build-essential

# install nodejs
apt-get install -y python-software-properties
curl -sL https://deb.nodesource.com/setup_8.x | sudo -E bash -
apt-get install -y nodejs

# install npm dependencies
npm i
npm i -g @angular/cli@1.0.0

# install ffmpeg
apt-get install -y ffmpeg