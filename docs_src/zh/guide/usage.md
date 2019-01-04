# 使用

可以通过在 HTML 中添加 `uitest-mocha-shim.js` 来进行 uitest 配置。

下面是一个 `test.html` 示例：

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
    // 如果 `window.__coverage__` 存在的话，将生成覆盖率文件。
    _macaca_uitest.run();
    </script>
  </body>
</html>
```

## Node.js

可以通过 Node API 来启动 uitest：

```javascript
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

## Gulp

在 Gulp 中使用 uitest:

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

## 截图

```javascript
_macaca_uitest.screenshot(name[String], cb[Function]);
```

