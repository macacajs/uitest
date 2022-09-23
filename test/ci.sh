Xvfb -ac -screen scrn 1280x2000x24 :9.0 &

export DISPLAY=:9.0

sleep 3

# chmod +x node_modules/nyc/bin/nyc.js node_modules/nyc/bin/wrap.js
npm run test