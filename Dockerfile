FROM node:18-alpine
ADD matternotify.js /bin/
ENTRYPOINT ["/bin/matternotify.js"]