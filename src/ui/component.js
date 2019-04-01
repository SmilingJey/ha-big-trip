/**
 * Базовый класс компонента
 */
export default class Component {
  constructor() {
    if (new.target === Component) {
      throw new Error(`Can't instantiate BaseComponent, only concrete one.`);
    }

    this._element = null;
    this._state = {};
    this._ui = {};
  }

  get element() {
    return this._element;
  }

  /**
   * Возвращает пустой шаблон контейнера фильтров
   */
  get template() {
    throw new Error(`You have to define template.`);
  }

  /**
   * Создание отображения компонента
   * @return {Node}
   */
  render() {
    this._element = this.template;
    this._getUiElements();
    this.update();
    this.bind();
    return this._element;
  }

  /**
   * Удаление компонента
   */
  unrender() {
    if (this._element === null) {
      return;
    }
    this.unbind();
    this._element.remove();
    this._element = null;
    this._ui = {};
    this._state = {};
  }

  /**
   * Обновление списка фильтров
   */
  update() {}

  /**
   * Привязка обработчиков событий
   */
  bind() {}

  /**
   * Удалнение обработчиков событий
   */
  unbind() {}

  /**
   * Сохранение ссылок на элементы интерфейса
   */
  _getUiElements() {}
}
