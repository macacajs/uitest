# uitest

---

[![NPM version][npm-image]][npm-url]
[![build status][travis-image]][travis-url]
[![Test coverage][coveralls-image]][coveralls-url]
[![node version][node-image]][node-url]
[![npm download][download-image]][download-url]

[npm-image]: https://img.shields.io/npm/v/uitest.svg?style=flat-square
[npm-url]: https://npmjs.org/package/uitest
[travis-image]: https://img.shields.io/travis/macacajs/uitest.svg?style=flat-square
[travis-url]: https://travis-ci.org/macacajs/uitest
[coveralls-image]: https://img.shields.io/coveralls/macacajs/uitest.svg?style=flat-square
[coveralls-url]: https://coveralls.io/r/macacajs/uitest?branch=master
[node-image]: https://img.shields.io/badge/node.js-%3E=_4.2-green.svg?style=flat-square
[node-url]: http://nodejs.org/download/
[download-image]: https://img.shields.io/npm/dm/uitest.svg?style=flat-square
[download-url]: https://npmjs.org/package/uitest

> Run mocha in a browser environment.

## Installation

```bash
$ npm i uitest --save-dev
```

## Sample

[uitest-sample](//github.com/macaca-sample/uitest-sample)

## Usage

You should configure your entry HTML by including `uitest-mocha-shim.js`.

Here is an example `test.html`

```html
<!DOCTYPE html>
<html>
  <head>
    <title>macaca mocha test</title>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="./node_modules/mocha/mocha.css" />
  </head>
  <body>
    <div id="mocha"></div>
    <script src="./node_modules/mocha/mocha.js"></script>
    <script src='./node_modules/uitest/uitest-mocha-shim.js'></script>
    <script src="./node_modules/should/should.js"></script>
    <script>
    _macaca_uitest.setup({
      ui: 'bdd',
      timeout: 5000,
      slow: 2000
    });
    </script>
    <script>
    describe('sample', function() {

      beforeEach('init', function() {
      });

      it('#case_1', function() {
      });

    });
    </script>
    <script>
    // will generate the coverage file if `window.__coverage__` is existed.
    _macaca_uitest.run();
    </script>
  </body>
</html>
```

### Node.js

Your can start uitest using Node API:

```javascript
const uitest = require('uitest');

uitest({
  url: 'file:///Users/name/path/index.html',
  width: 600,
  height: 480,
  hidpi: false,
  useContentSize: true,
  show: false,
}).then(() => {
  console.log('uitest success')
}).catch(() => {
  console.log('uitest error')
});
```

### Gulp

Or with Gulp:

```bash
$ npm i gulp-uitest --save-dev
```

```javascript
const uitest = require('gulp-uitest');
//test
gulp.task('test', function() {
  return gulp
    .src('test/html/index.html')
    .pipe(uitest({
      width: 600,
      height: 480,
      hidpi: false,
      useContentSize: true,
      show: false,
    }));
});

```

### Screenshots

```javascript
_macaca_uitest.screenshot(name[String], cb[Function]);
```

### Advanced

If you do not want the page to display in retina mode, set `hidpi` to false.

For more options, see [Electron BrowserWindow options](http://electron.atom.io/docs/api/browser-window/#new-browserwindowoptions)

## License

The MIT License (MIT)
