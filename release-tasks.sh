NPM_CONFIG_PRODUCTION=false npm install
mkdir -p backend/staticfiles
if [ -d "backend/client/build" ]; then rm -Rf backend/client/build; fi
npm run heroku-build
npm run heroku-post-build
npm run load-data-dev
