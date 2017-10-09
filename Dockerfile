FROM mkaichen/node-ubuntu

ENV VIDEAR_DIR /usr/src/videar

# Create app directory
RUN mkdir -p $VIDEAR_DIR
WORKDIR $VIDEAR_DIR

# move everything
COPY . $VIDEAR_DIR

# setup everything
RUN bash setup.sh

CMD [ "npm", "start" ]
