Xvfb -ac -screen scrn 1280x2000x24 :9.0 &

export DISPLAY=:9.0

sleep 3

ls -l node_modules/.bin
npm run test
