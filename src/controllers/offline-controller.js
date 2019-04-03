/**
 * Переключение между online и offline режимами работы
 * @param {Object} param0
 */
function initOfflineController({tripPointsData}) {
  window.addEventListener(`offline`, () => {
    document.title = `${document.title} [OFFLINE]`;
  });

  window.addEventListener(`online`, () => {
    document.title = document.title.split(` [OFFLINE]`)[0];
    tripPointsData.sync();
  });
}

export {initOfflineController};
