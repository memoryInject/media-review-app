npm install --prefix frontend && npm run build --prefix frontend
if [ -d "backend/client/build" ]; then rm -Rf backend/client/build; fi
mv -f frontend/build ./backend/client/
cd backend/client/build
cp asset-manifest.json manifest.json service-worker.js service-worker.js.map robots.txt favicon.ico *.png *.xml *.svg ./static
cd ../../
python manage.py collectstatic
