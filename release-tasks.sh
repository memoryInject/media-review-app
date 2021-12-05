python backend/manage.py migrate
python backend/manage.py collectstatic
npm run heroku-release
npm run load-data-dev
