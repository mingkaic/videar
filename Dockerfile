FROM mkaichen/node-ubuntu

ENV VIDEAR_DIR /usr/src/videar

# Create app directory
RUN mkdir -p $VIDEAR_DIR
WORKDIR $VIDEAR_DIR

# move everything
COPY . $VIDEAR_DIR

# setup everything
RUN bash setup.sh

# todo: move to some test environment
RUN npm install mocha -g
RUN npm install phantomjs-prebuilt -g
RUN npm install phantomjs-prebuilt

CMD [ "npm", "start" ]
