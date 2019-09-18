
FROM nginx:alpine
LABEL maintainer="Daniel Röwenstrunk for Muwi Detmold"

RUN mkdir -p /usr/share/nginx/html
WORKDIR /usr/share/nginx/html
COPY . .

# make all files belong to the nginx user
RUN chown nginx:nginx /usr/share/nginx/html

EXPOSE 80

# start nginx and keep the process from backgrounding and the container from quitting
CMD ["nginx", "-g", "daemon off;"]