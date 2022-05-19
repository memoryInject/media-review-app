FROM node:alpine

WORKDIR '/app'

COPY ./frontend/package.json ./
RUN npm install
RUN mkdir -p node_modules/.cache && chmod -R 777 node_modules/.cache

COPY ./compose/local/frontend/start.sh /start.sh 
RUN sed -i 's/\r$//g' /start.sh
RUN chmod +x /start.sh
