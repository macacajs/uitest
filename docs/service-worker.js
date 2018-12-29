/**
 * Welcome to your Workbox-powered service worker!
 *
 * You'll need to register this file in your web app and you should
 * disable HTTP caching for this file too.
 * See https://goo.gl/nhQhGp
 *
 * The rest of the code is auto-generated. Please don't update this file
 * directly; instead, make changes to your Workbox build configuration
 * and re-run your build process.
 * See https://goo.gl/2aRDsh
 */

importScripts("https://storage.googleapis.com/workbox-cdn/releases/3.6.3/workbox-sw.js");

/**
 * The workboxSW.precacheAndRoute() method efficiently caches and responds to
 * requests for URLs in the manifest.
 * See https://goo.gl/S9QRab
 */
self.__precacheManifest = [
  {
    "url": "404.html",
    "revision": "d12a9000a91e16f3f8e7f9a5efbc4650"
  },
  {
    "url": "assets/css/0.styles.c709efb1.css",
    "revision": "a3c4d4f368b2ccb13fd14e9198a3e4f5"
  },
  {
    "url": "assets/img/search.83621669.svg",
    "revision": "83621669651b9a3d4bf64d1a670ad856"
  },
  {
    "url": "assets/js/2.126dbf9d.js",
    "revision": "55e90988c268d61e89cf93b145e07b3b"
  },
  {
    "url": "assets/js/3.6b1211db.js",
    "revision": "f2966c47459c842c657823f51b7c3155"
  },
  {
    "url": "assets/js/4.d763996e.js",
    "revision": "ed632877da2a4eff46f679a83ac2a244"
  },
  {
    "url": "assets/js/5.c3e42228.js",
    "revision": "77bdbc5093ec1b1308285b7662614083"
  },
  {
    "url": "assets/js/app.a2fd2588.js",
    "revision": "9f73309a6bd1f676beb1e59bc63bc617"
  },
  {
    "url": "index.html",
    "revision": "d62ad0636c9378b5937f0d65caf0458f"
  },
  {
    "url": "zh/index.html",
    "revision": "21392dadafb30ca9b649603971e31f81"
  }
].concat(self.__precacheManifest || []);
workbox.precaching.suppressWarnings();
workbox.precaching.precacheAndRoute(self.__precacheManifest, {});
addEventListener('message', event => {
  const replyPort = event.ports[0]
  const message = event.data
  if (replyPort && message && message.type === 'skip-waiting') {
    event.waitUntil(
      self.skipWaiting().then(
        () => replyPort.postMessage({ error: null }),
        error => replyPort.postMessage({ error })
      )
    )
  }
})
