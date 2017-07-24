FROM ubuntu:latest

# Create app directory
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

# move everything
COPY . /usr/src/app/

# setup everything
RUN bash setup.sh

# install npm dependencies
RUN npm i

# install ng (todo: eject to webpack in the future)
RUN npm install -g --unsafe-perm @angular/cli

EXPOSE 8080
CMD [ "npm", "start" ]