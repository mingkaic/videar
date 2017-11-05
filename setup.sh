#!/usr/bin/env bash
set -e

apt-get update && apt-get install -y redis-server;
npm install
