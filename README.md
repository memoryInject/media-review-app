
# Media-Review App
[![CircleCI](https://circleci.com/gh/memoryInject/media-review-app/tree/main.svg?style=svg)](https://circleci.com/gh/memoryInject/media-review-app/tree/main)

Media-Review PWA (Progressive Web App) is a platform for review media by team collaboration in
cloud, integrates reviewers, creators, content and tools needs to be
more engaged and effective review process.


### Testing and CI/CD frameworks used:

 - Front-end: [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/) with [Mock Service Worker](https://mswjs.io/)
 - Back-end: [Django REST framework test](https://www.django-rest-framework.org/api-guide/testing/)
 - End-to-end: [Cypress](https://www.cypress.io/)
 - CI/CD: [CircleCI](https://circleci.com/) with [Heroku](https://www.heroku.com/)


## Demo

![Alt Text](https://res.cloudinary.com/memoryinject/image/upload/v1638810681/media_review_app/images/ezgif-3-9bdc23ea6977_xxjjwl.gif)


#### YouTube:
[![Alt text](https://user-images.githubusercontent.com/72661846/162590289-805cd4dd-b440-424f-a15f-3a0195d92aa1.png)](https://www.youtube.com/watch?v=-kcfAHRd4jM)

https://media-review.herokuapp.com  👍  
More info: [memoryinject.io](https://memoryinject.io/) 

## Environment Variables

To run this project, you will need to add the following environment variables to your [.envrc](https://direnv.net/) file

Secrect key from django settings.py   
`DJANGO_SECRECT_KEY='django-insecure-#key'`   

Django mode anything other than development will set DEBUG to False in settings.py   
`DJANGO_ENV='development'`   

Redis cache - for test use 'dummy' insted of 'redis'   
`DJANGO_MEMCACHE='redis'`   
`REDIS_URL='redis://127.0.0.1:6379/1'`

Email config - here setup email client to send email,  
mailtrap and console output are used for test,  
use 'console' insted of 'smtp' for console output for email   
`EMAIL_BACKEND='smtp'`   
`EMAIL_HOST='smtp.mailtrap.io'`   
`EMAIL_HOST_USER='mailtrap-user'`   
`EMAIL_HOST_PASSWORD='mailtrap-password'`   
`EMAIL_PORT='2525'`   

Databse Management config - use 'sqlite' insted of 'postgres' if you want to use default sqlite3.  
`DB_MANAGEMENT='postgres'`   

Local postgres development database    
`DB_HOST='localhost'`   
`DB_PORT='5432'`    
`DB_NAME='media_review_app_dev'`    
`DB_USER='postgres'`    
`DB_PASSWORD='1234'`    

[Cloudinary](https://cloudinary.com/) details (Media hosting is done by cloudinary)   
`CD_NAME=''`    
`CD_API_KEY=''`   
`CD_API_SECRET=''`   
`CD_API_ENV_VAR=''`   

[Cypress](https://www.cypress.io/dashboard) dashbord access   
`CYPRESS_KEY=''`

For test only change database name but it's already done in npm script with cross-env, no need to set it on your .envrc   
`DB_NAME='media_review_app_test'`    

[Deepgram](https://deepgram.com/) Speech-to-Text AI   
`SECRECT_KEY_DEEPGRAM=''`


## Installation

It is a mono repo for both front-end and back-end.
Front-end is build with react, back-end is build with Python and Django.   

Clone this project to local drive:  
```bash 
  git clone https://github.com/memoryInject/media-review-app.git
  
  cd media-review-app
```
##### **None: You just need to clone this repo if you decided to run this project on docker, if you want to run this on local continue the steps below.

Install with npm for root and front-end:
```bash
  npm install && npm install --prefix frontend
```

Create a Python environment and install with pip for back-end:
```bash
  pip install -r requirements.txt
```

Migrate django in the back-end:
```bash
  cd backend
  python manage.py migrate
```
Seed databse in django (Optional):
```bash
  npm run load-data-dev
```

## Running Tests

#### Testing in Docker
**Note: Make sure to install docker and docker-compose on your computer first
Build the docker image with docker-compose at the root:
This will execute docker-compose.test.yml, if you are using windows open the appropriate `.sh` file in a text editor and copy those command and run it in the shell. 
```bash
  ./compose/test/bin/build.sh
```

Docker-compose up all the build containers:
```bash
  ./compose/test/bin/up.sh
```

Open another terminal window and run frontend test:
```bash
  ./compose/test/bin/test-frontend.sh
```

Open another terminal window and run backend test:
```bash
  ./compose/test/bin/test-backend.sh
```

Open another terminal window and run end-to-end test with cypress:
```bash
  ./compose/test/bin/cypress-run.sh
```

#### Testing in Local (without docker)

Run the test with npm at the root:
```bash
  npm test
```
This will run both front-end react test and back-end server test.

For End-to-End Cypress test, first run both front-end and back-end dev server on test mode then open cypress.
```bash
  npm run dev-test
```

Open Cypress on another bash:
```bash
  npm run cypress-open
```

For Cypress CLI test ( make sure CYPRESS_KEY environent is set ):
```bash
  npm run cypress-test
```


## Development
#### Docker
Create `.env.development.local` file at root and add all the environment variable mentioned above plus add `API_HOST='http://backend:8000'`

Build and up with docker-compose:
```bash
  docker-compose up --build
```

Open another terminal window and seed the data base (Optional)
```bash
  ./compose/local/bin/seed-data.sh
```

Create superuser for django:    
**Note: Make sure to provide username, email and password when creating superuser, use this email and password for login into frontend 
```bash
  docker-compose exec -it backend python manage.py createsuperuser
```

The frontend running at port `3000` and backend running at port `8000`. 
Now you can live edit the files and see the results. 
There is also an nginx proxy running at port `3050`, you can use it instead of frontend port 3000. 
Celery flower dashbord running at port `5558`.

#### Local (without docker)
Before doing anyting make sure to migrate and seed the database,  
also make sure to run postgres and create media_review_app_dev database and   
check all the environement variables.

Migrate database:
```bash
  cd backend
  python manage.py migrate
```

Seed database ( optional ):
```bash
  cd backend
  python manage.py loaddata user userprofile project review asset media feedback
```

Create superuser for django:    
**Note: Make sure to provide username, email and password when creating superuser, use this email and password for login into frontend 
```bash
  cd backend
  python manage.py createsuperuser
```


Build front-end and setup static files on back-end:
```bash
  npm run build
```

Make sure redis server is running on port 6379.
Run celery worker on a new terminal:
```bash
  cd backend
  celery -A config worker -l INFO
```
Run celery flower on a new terminal:
```bash
  cd backend
  celery -A config flower --port=5555
```

Run development servers (react and django) at root:
```bash
  npm run dev
```
By default react dev server running on port `3000` and django server running on port `8000`. 
Celery flower running at port `5555`.
## API Reference

[insomnia-api-spec.json](https://github.com/memoryInject/media-review-app/blob/main/insomnia-api-spec.json): for API testing with [Insomnia](https://insomnia.rest/)

All the API Reference are at: https://media-review.herokuapp.com/api/v1/


## Deployment

This project build with CI/CD in mind, it's recommend to use a CI/CD platform to deployment.  
This project use [CircleCI](https://circleci.com/) with [Heroku](https://www.heroku.com/) for deployment.   

## Tech Stack

**Client:** React, Redux, Bootstrap

**Server:** Django, Django REST framework, Django Channels, Python, Redis, Celery 

**Database:** Postgres, Sqlite3 
## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

Please make sure to update tests as appropriate.



## License

[MIT](https://choosealicense.com/licenses/mit/)


## Support

For support, email msmahesh@live.com.   
More info: [memoryinject.io](https://memoryinject.io/) 
