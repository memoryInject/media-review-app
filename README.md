
# Media Review App
[![CircleCI](https://circleci.com/gh/memoryInject/media-review-app/tree/main.svg?style=svg)](https://circleci.com/gh/memoryInject/media-review-app/tree/main)

Media review PWA(Progressive Web App) is a platform for review media by team collaboration in
cloud, integrates reviewers, creators, content and tools needs to be
more engaged and effective review process.


### Testing and CI/CD frameworks used:

 - Frontend: [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/) with [Mock Service Worker](https://mswjs.io/)
 - Backend: [Django rest framework test](https://www.django-rest-framework.org/api-guide/testing/)
 - End-to-End: [Cypress](https://www.cypress.io/)
 - CI/CD: [CircleCI](https://circleci.com/) with [Heroku](https://www.heroku.com/)


## Demo

![Alt Text](https://res.cloudinary.com/memoryinject/image/upload/v1638810681/media_review_app/images/ezgif-3-9bdc23ea6977_xxjjwl.gif)

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


## Installation

It is a mono repo for both frontend and backend.
Frontend is build with react, backend is build with python and Django-Rest-Framework.   

Clone this project to local drive:  
```bash 
  git clone https://github.com/memoryInject/media-review-app.git
  
  cd media-review-app
```

Install with npm for root and frontend:
```bash
  npm install && npm install --prefix frontend
```

Create a python environment and install with pip for backend:
```bash
  pip install -r requirements.txt
```

Migrate django in the backend:
```bash
  cd backend
  python manage.py migrate
```
Seed databse in django (Optional):
```bash
  npm run load-data-dev
```

## Running Tests

Run the test with npm at the root:
```bash
  npm test
```
This will run both frontend react test and backend server test.

For End-to-End Cypress test, first run both frontend and backend dev server on test mode then open cypress.
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
  python manage.py loaddata user profile asset media project review feedback
```

Run development servers (react and django) at root:
```bash
  npm run dev
```
By default react dev server running on port 3000 and django server running on port 8000.
## API Reference

[insomnia-api-spec.json](https://github.com/memoryInject/media-review-app/blob/main/insomnia-api-spec.json): for API testing with [Insomnia](https://insomnia.rest/)

All the API Reference are at: https://media-review.heroku.com/api/v1/


## Deployment

This project build with CI/CD in mind, it's recommend to use a CI/CD platform to deployment.  
This project use [CircleCI](https://circleci.com/) with [Heroku](https://www.heroku.com/) for deployment.   

## Tech Stack

**Client:** React, Redux, Bootstrap

**Server:** Djago-Rest-Framework, Python, Redis 

**Database:** Postgres, Sqlite3 
## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

Please make sure to update tests as appropriate.



## License

[MIT](https://choosealicense.com/licenses/mit/)


## Support

For support, email msmahesh@live.com.   
More info: [memoryinject.io](https://memoryinject.io/) 
