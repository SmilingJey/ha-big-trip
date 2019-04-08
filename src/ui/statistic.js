import Component from "./component.js";
import Chart from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import TripPointType from '../data/trip-point-type.js';
import calcTripPointCost from '../utils/calc-trippoint-cost.js';

const BAR_HEIGHT = 55;

const moneyChartConfig = {
  plugins: [ChartDataLabels],
  type: `horizontalBar`,
  data: {
    labels: [`✈️ FLY`, `🏨 STAY`, `🚗 DRIVE`, `🏛️ LOOK`, `🏨 EAT`, `🚕 RIDE`],
    datasets: [{
      data: [100, 300, 200, 160, 150, 100],
      backgroundColor: `#ffffff`,
      hoverBackgroundColor: `#ffffff`,
      anchor: `start`
    }]
  },
  options: {
    maintainAspectRatio: false,
    plugins: {
      datalabels: {
        font: {
          size: 13
        },
        color: `#000000`,
        anchor: `end`,
        align: `start`,
        formatter: (val) => `€ ${val}`
      }
    },
    title: {
      display: true,
      text: `MONEY`,
      fontColor: `#000000`,
      fontSize: 23,
      position: `left`
    },
    scales: {
      yAxes: [{
        ticks: {
          fontColor: `#000000`,
          padding: 5,
          fontSize: 13,
        },
        gridLines: {
          display: false,
          drawBorder: false
        },
        barThickness: 44,
      }],
      xAxes: [{
        ticks: {
          display: false,
          beginAtZero: true,
        },
        gridLines: {
          display: false,
          drawBorder: false
        },
        minBarLength: 50
      }],
    },
    legend: {
      display: false,
    },
    tooltips: {
      enabled: false,
    }
  }
};

const transportChartConfig = {
  plugins: [ChartDataLabels],
  type: `horizontalBar`,
  data: {
    labels: [`🚗 DRIVE`, `🚕 RIDE`, `✈️ FLY`, `🛳️ SAIL`],
    datasets: [{
      data: [4, 3, 2, 1],
      backgroundColor: `#ffffff`,
      hoverBackgroundColor: `#ffffff`,
      anchor: `start`
    }]
  },
  options: {
    maintainAspectRatio: false,
    plugins: {
      datalabels: {
        font: {
          size: 13
        },
        color: `#000000`,
        anchor: `end`,
        align: `start`,
        formatter: (val) => `${val}x`
      }
    },
    title: {
      display: true,
      text: `TRANSPORT`,
      fontColor: `#000000`,
      fontSize: 23,
      position: `left`
    },
    scales: {
      yAxes: [{
        ticks: {
          fontColor: `#000000`,
          padding: 5,
          fontSize: 13,
        },
        gridLines: {
          display: false,
          drawBorder: false
        },
        barThickness: 44,
      }],
      xAxes: [{
        ticks: {
          display: false,
          beginAtZero: true,
        },
        gridLines: {
          display: false,
          drawBorder: false
        },
        minBarLength: 50
      }],
    },
    legend: {
      display: false
    },
    tooltips: {
      enabled: false,
    }
  }
};

const timeSpentChartConfig = {
  plugins: [ChartDataLabels],
  type: `horizontalBar`,
  data: {
    labels: [`🚗 DRIVE`, `🚕 RIDE`, `✈️ FLY`, `🛳️ SAIL`],
    datasets: [{
      data: [4, 3, 2, 1],
      backgroundColor: `#ffffff`,
      hoverBackgroundColor: `#ffffff`,
      anchor: `start`
    }]
  },
  options: {
    maintainAspectRatio: false,
    plugins: {
      datalabels: {
        font: {
          size: 13
        },
        color: `#000000`,
        anchor: `end`,
        align: `start`,
        formatter: (val) => {
          const hour = Math.floor(val / 60);
          const houtText = hour ? `${hour}H ` : ``;
          const minute = val % 60;
          const minuteText = minute > 9 ? `${minute}M ` : `0${minute}M`;
          return houtText + minuteText;
        }
      }
    },
    title: {
      display: true,
      text: `TIME SPENT`,
      fontColor: `#000000`,
      fontSize: 23,
      position: `left`
    },
    scales: {
      yAxes: [{
        ticks: {
          fontColor: `#000000`,
          padding: 5,
          fontSize: 13,
        },
        gridLines: {
          display: false,
          drawBorder: false
        },
        barThickness: 44,
      }],
      xAxes: [{
        ticks: {
          display: false,
          beginAtZero: true,
        },
        gridLines: {
          display: false,
          drawBorder: false
        },
        minBarLength: 50
      }],
    },
    legend: {
      display: false
    },
    tooltips: {
      enabled: false,
    }
  }
};

/**
 * Компонент отображает статистику путешествия
 */
export default class Statistic extends Component {
  constructor(getDataCallback) {
    super();
    this._getData = getDataCallback;
    this._moneyChart = null;
    this._transportChart = null;
    this._timeSpentChart = null;
  }

  get template() {
    const templateElement = document.querySelector(`#trip-statistic-template`).content;
    const element = templateElement.querySelector(`.statistic`).cloneNode(true);
    return element;
  }

  update() {
    const data = this._getData();
    if (!data) {
      return;
    }
    this._updateMoneyChart(data);
    this._updateTransportChart(data);
    this._updateTimeSpentChart(data);
  }

  hide() {
    this._element.classList.add(`visually-hidden`);
  }

  unhide() {
    this._element.classList.remove(`visually-hidden`);
  }

  _getUiElements() {
    this._ui.moneyCanvasElement = this._element.querySelector(`.statistic__money`);
    this._ui.transportCanvasElement = this._element.querySelector(`.statistic__transport`);
    this._ui.timeSpentCanvasElement = this._element.querySelector(`.statistic__time-spend`);
  }

  /**
   * Обновление диаграммы стоимости
   * @param {Array} data - массив точек путешествия
   */
  _updateMoneyChart(data) {
    if (!this._moneyChart) {
      this._moneyChart = new Chart(this._ui.moneyCanvasElement, moneyChartConfig);
    }

    const moneyStatistic = Statistic._calcTimeSpentStatistic(data);
    Statistic._updateChart({
      canvas: this._ui.moneyCanvasElement,
      chart: this._moneyChart,
      data: Statistic._getChartData(moneyStatistic),
    });
  }

  /**
   * Обновление диаграммы использования транспорта
   * @param {Array} data - массив точек путешествия
   */
  _updateTransportChart(data) {
    if (!this._transportChart) {
      this._transportChart = new Chart(this._ui.transportCanvasElement, transportChartConfig);
    }

    const transportStatistic = Statistic._calcTransportStatistic(data);
    Statistic._updateChart({
      canvas: this._ui.transportCanvasElement,
      chart: this._transportChart,
      data: Statistic._getChartData(transportStatistic),
    });
  }

  /**
   * Обновление диаграммы проведенного времени
   * @param {Array} data - массив точек путешествия
   */
  _updateTimeSpentChart(data) {
    if (!this._timeSpentChart) {
      this._timeSpentChart = new Chart(this._ui.timeSpentCanvasElement, timeSpentChartConfig);
    }

    const timeSpentStatistic = Statistic._calcTimeSpentStatistic(data);
    Statistic._updateChart({
      canvas: this._ui.timeSpentCanvasElement,
      chart: this._timeSpentChart,
      data: Statistic._getChartData(timeSpentStatistic),
    });
  }

  /**
   * Вычисление статистики по использованию транспорта
   * @param {Array} data - данные путешествия
   * @return {Object}
   */
  static _calcTransportStatistic(data) {
    const transportStatistic = {};
    const transportPoints = data.filter((tripPoint) => TripPointType[tripPoint.type].isTransport);
    for (const tripPoint of transportPoints) {
      if (transportStatistic.hasOwnProperty(tripPoint.type)) {
        transportStatistic[tripPoint.type]++;
      } else {
        transportStatistic[tripPoint.type] = 1;
      }
    }
    return transportStatistic;
  }

  /**
   * Вычисление статистики по стоимости типов точек путешествия
   * @param {Array} data - данные путешествия
   * @return {Object}
   */
  static _calcMoneyStatistic(data) {
    const moneyStatistic = {};
    for (const tripPoint of data) {
      if (moneyStatistic.hasOwnProperty(tripPoint.type)) {
        moneyStatistic[tripPoint.type] += calcTripPointCost(tripPoint);
      } else {
        moneyStatistic[tripPoint.type] = calcTripPointCost(tripPoint);
      }
    }
    return moneyStatistic;
  }

  /**
   * Вычисление статистики по проведенному времени
   * @param {Array} data - данные путешествия
   * @return {Object}
   */
  static _calcTimeSpentStatistic(data) {
    const timeSpentStatistic = {};
    for (const tripPoint of data) {
      if (timeSpentStatistic.hasOwnProperty(tripPoint.type)) {
        timeSpentStatistic[tripPoint.type] += Statistic._getDurationInMinutes(tripPoint);
      } else {
        timeSpentStatistic[tripPoint.type] = Statistic._getDurationInMinutes(tripPoint);
      }
    }
    return timeSpentStatistic;
  }

  /**
   * Возвращает данные для отображения на графике
   * @param {*} timeSpentStatistic - статистика
   * @return {Object}
   */
  static _getChartData(timeSpentStatistic) {
    const sortedKeys = Object.keys(timeSpentStatistic).sort((a, b) => {
      return timeSpentStatistic[b] - timeSpentStatistic[a];
    });
    return {
      values: sortedKeys.map((type) => timeSpentStatistic[type]),
      labels: sortedKeys.map((type) => `${TripPointType[type].icon} ${TripPointType[type].name}`),
    };
  }

  static _updateChart({canvas, chart, data}) {
    chart.config.data.datasets[0].data = data.values;
    chart.data.labels = data.labels;
    canvas.height = BAR_HEIGHT * data.labels.length;
    chart.canvas.parentNode.style.height = `${BAR_HEIGHT * data.labels.length}px`;
    chart.update();
  }

  static _getDurationInMinutes(tripPoint) {
    return Math.round(Math.abs(tripPoint.dateTo - tripPoint.dateFrom) / 60 / 1000);
  }
}

