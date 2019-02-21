
FROM node
LABEL maintainer="Daniel Röwenstrunk for Muwi Detmold"

WORKDIR /app
COPY . .
RUN npm install \
    && mv www phone \
    && mkdir www \
    && mv phone www/

EXPOSE 8085

# start nginx and keep the process from backgrounding and the container from quitting
CMD npm run serve