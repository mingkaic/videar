#!/usr/bin/env bash
set -e

git clone https://github.com/mingkaic/shared_mongodb_api.git server/data/database
apt-get update;
apt-get install -y redis-server;

# install npm dependencies
npm install
