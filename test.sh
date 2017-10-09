#!/usr/bin/env bash
set -e

apt-get update
apt-get install -y libfontconfig

npm install --only=dev

npm install mocha -g
npm install phantomjs-prebuilt -g
npm install phantomjs-prebuilt

set +e
npm test
