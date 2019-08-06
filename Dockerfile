FROM node:8

LABEL description="Tilehut server"
LABEL maintainer="florian.porada+webdev@gmail"

# Define working directory
WORKDIR /usr/src/app

# Copy package.json for installation
COPY ./package.json /usr/src/app

# Install Node modules
RUN npm install --unsafe-perm

# Copy needed files
COPY ./node_modules /usr/src/app/node_modules
COPY ./data /usr/src/app/data
COPY ./static /usr/src/app/static
COPY ./config.js /usr/src/app
COPY ./server.js /usr/src/app
COPY ./TileService.js /usr/src/app

# Create volume to mount tile data
VOLUME [ "/usr/src/app/data" ]

# Expose port
EXPOSE 8000

# Run service
CMD [ "node", "server.js" ]
