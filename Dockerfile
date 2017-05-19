FROM alpine:3.5

RUN apk add --no-cache nginx

COPY nginx.conf /etc/nginx/nginx.conf
COPY index.html data.json css fonts js /usr/share/nginx/html

CMD nginx -g 'pid /run/nginx.pid; daemon off;'
