# Advanced

## Configuration downgrade

If you do not want the page to display in retina mode, set `hidpi` to false.

For more options, see [Electron BrowserWindow options](http://electron.atom.io/docs/api/browser-window/#new-browserwindowoptions).

## Run with Travis

Your `.travis.yml` need the configuration below to run UITest on Travis:

```yaml
addons:
  apt:
    packages:
      - xvfb
install:
  - export DISPLAY=':99.0'
  - Xvfb :99 -screen 0 1366x768x24 > /dev/null 2>&1 &
```

## Run with Docker

You can use Macaca Electron [Docker Image](//github.com/macacajs/macaca-electron-docker).
