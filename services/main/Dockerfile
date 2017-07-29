FROM ubuntu:latest

# Create app directory
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

# move everything
COPY . /usr/src/app/

# setup everything
RUN bash setup.sh

EXPOSE 8080
EXPOSE 80
CMD [ "npm", "start" ]
