
FROM node
LABEL maintainer="Daniel Röwenstrunk for Muwi Detmold"

RUN mkdir -p /app
WORKDIR /app
COPY . .
RUN npm install

EXPOSE 8085

# start nginx and keep the process from backgrounding and the container from quitting
CMD ["npm run serve", "-g", "daemon off;"]