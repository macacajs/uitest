# 如何使用

安装之后可以通过在 html runner 中添加 `uitest-mocha-shim.js` 来进行 UITest 配置。

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
    <script src="./node_modules/uitest/mocha.js"></script>
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

## 通过 Node.js 运行

可以通过 Node.js 来启动 UITest：

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

效果如下：

![](http://ww3.sinaimg.cn/large/6d308bd9gw1f6wsic5dmxj20rl0qqtbi.jpg)

![](http://ww1.sinaimg.cn/large/6d308bd9gw1f6wsibnfldg20nk0gr7kg.gif)

## 使用 Gulp

在 Gulp 中使用 UITest:

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

同样的，UITest 运行触发比较灵活，你可以与其他脚本和 pipeline 集成。

```

## 使用截图

```javascript
_macaca_uitest.screenshot(name[String], cb[Function]);
```

## 覆盖率

当浏览器上下文中有 `window.__coverage__` 将自动生成覆盖率报告。
