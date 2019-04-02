/* eslint-disable max-nested-callbacks */
/* eslint-disable indent */
/* eslint-disable no-console */

const CACHE_NAME = `TASK_MANAGER`;

function cacheFiles(cache) {
  return cache.addAll([
    `./`,
    `./index.html`,
    `./bundle.js`,
    `./css/normalize.css`,
    `./css/main.css`,
    `./css/flatpickr.min.css`,
    `./img/star.svg`,
    `./img/star--check.svg`,
  ]);
}

self.addEventListener(`install`, (evt) => {
  console.log(`sw, install`, {evt});
  evt.waitUntil(
    caches.open(CACHE_NAME)
      .then(cacheFiles)
      .catch((err) => {
        console.error(err);
        throw err;
      })
    );
});

self.addEventListener(`activate`, (evt) => {
  console.log(`sw`, `activate`, {evt});
});

self.addEventListener(`fetch`, (evt) => {
  evt.respondWith(
    caches.match(evt.request)
      .then((response) => {
        return response ? response : fetch(evt.request);
      })
      .catch((err) => {
        console.error(err);
        throw err;
      })
  );
});
