# Usage

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
    <script src="./mocha.js"></script>
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
    _macaca_uitest.run();
    </script>
  </body>
</html>
```

## Start with Node.js

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

![](http://ww3.sinaimg.cn/large/6d308bd9gw1f6wsic5dmxj20rl0qqtbi.jpg)

![](http://ww1.sinaimg.cn/large/6d308bd9gw1f6wsibnfldg20nk0gr7kg.gif)

## Use with Gulp

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

## Use Screenshots

```javascript
_macaca_uitest.screenshot(name[String], cb[Function]);
```

## Coverage

UITest will generate the coverage file if `window.__coverage__` is existed.
