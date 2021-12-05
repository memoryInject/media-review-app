NPM_CONFIG_PRODUCTION=false npm install
mkdir -p backend/staticfiles
npm run heroku-build
npm run heroku-post-build
npm run load-data-dev
