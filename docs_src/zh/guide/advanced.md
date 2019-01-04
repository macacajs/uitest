# 进阶

## 设置降级

如果你不想在 Retina 模式中展示页面，可以设置 `hidpi` 为 false。

更多配置可以参考 [Electron BrowserWindow 配置](http://electron.atom.io/docs/api/browser-window/#new-browserwindowoptions)。

## 持续集成

如果你使用 Travis CI 运行测试，你需要在 `.travis.yml` 文件中添加如下配置:

```yaml
addons:
  apt:
    packages:
      - xvfb
install:
  - export DISPLAY=':99.0'
  - Xvfb :99 -screen 0 1366x768x24 > /dev/null 2>&1 &
```

## Docker 运行

你也可以使用 Macaca Electron [Docker 镜像](//github.com/macacajs/macaca-electron-docker) 来运行。
