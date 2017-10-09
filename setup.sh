#!/usr/bin/env bash
set -e

git clone https://github.com/mingkaic/shared_mongodb_api.git server/database
apt-get update
apt-get install -y libfontconfig

# install npm dependencies
npm install

# todo: remove dev dependencies in deployment
npm install --only=dev
