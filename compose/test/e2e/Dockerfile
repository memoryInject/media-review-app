FROM cypress/included:9.6.1

WORKDIR /app
COPY ./package.json ./ 
COPY ./cypress ./cypress
COPY ./cypress.json ./
RUN npm install

COPY ./compose/test/e2e/entrypoint.sh /entrypoint.sh
RUN sed -i 's/\r$//g' /entrypoint.sh
RUN chmod +x /entrypoint.sh

# Replace baseUrl and apiUrl for running in docker
RUN sed -i '/baseUrl/c\ "baseUrl": "http://nginx:80",' cypress.json
RUN sed -i '/apiUrl/c\ "apiUrl": "http://backend:8000",' cypress.json

# Replace flush-data and load-data script on package.json for docker environment cypress test
RUN sed -i '/load-data-dev/c\ ' package.json
RUN sed -i '/load-data/c\ "load-data": "curl -X GET http://flask:4000/django/load-data",' package.json

RUN sed -i '/flush-data-dev/c\ ' package.json
RUN sed -i '/flush-data/c\ "flush-data": "curl -X GET http://flask:4000/django/flush-data",' package.json

ENTRYPOINT ["/entrypoint.sh"]
CMD ["cypress"]
