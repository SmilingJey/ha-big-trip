import Component from "./component.js";
import Chart from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import {TripPointType} from './trip-point-type.js';

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

export default class Statistic extends Component {
  constructor(getDataCallback) {
    super();
    this._getData = getDataCallback;
    this._moneyChart = null;
    this._transportChart = null;
    this._timeSpentChart = null;
  }

  get template() {
    const templateElement = document.querySelector(`#trip-statistic`).content;
    const element = templateElement.querySelector(`.statistic`).cloneNode(true);
    return element;
  }

  update() {
    const data = this._getData();
    this._updateMoneyChart(data);
    this._updateTransportChart(data);
    this._updateTimeSpentChart(data);
  }

  _updateMoneyChart(data) {
    const moneyChartElement = this._element.querySelector(`.statistic__money`);
    if (!this._moneyChart) {
      this._moneyChart = new Chart(moneyChartElement, moneyChartConfig);
    }

    const moneyStatistic = {};
    for (const tripPoint of data) {
      if (moneyStatistic.hasOwnProperty(tripPoint.type)) {
        moneyStatistic[tripPoint.type] += tripPoint.price;
      } else {
        moneyStatistic[tripPoint.type] = tripPoint.price;
      }
    }

    const sortedKeys = Object.keys(moneyStatistic).sort((a, b) => {
      return moneyStatistic[b] - moneyStatistic[a];
    });
    const values = sortedKeys.map((type) => moneyStatistic[type]);
    const labels = sortedKeys.map((type) => `${TripPointType[type].icon} ${TripPointType[type].name}`);

    this._moneyChart.config.data.datasets[0].data = values;
    this._moneyChart.data.labels = labels;
    moneyChartElement.height = BAR_HEIGHT * labels.length;
    this._moneyChart.canvas.parentNode.style.height = `${BAR_HEIGHT * labels.length}px`;
    this._moneyChart.update();
  }

  _updateTransportChart(data) {
    const transportChartElement = this._element.querySelector(`.statistic__transport`);
    if (!this._transportChart) {
      this._transportChart = new Chart(transportChartElement, transportChartConfig);
    }

    const transportStatistic = {};
    const transportPoints = data.filter((tripPoint) => TripPointType[tripPoint.type].isTransport);

    for (const tripPoint of transportPoints) {
      if (transportStatistic.hasOwnProperty(tripPoint.type)) {
        transportStatistic[tripPoint.type]++;
      } else {
        transportStatistic[tripPoint.type] = 1;
      }
    }

    const sortedKeys = Object.keys(transportStatistic).sort((a, b) => {
      return transportStatistic[b] - transportStatistic[a];
    });
    const values = sortedKeys.map((type) => transportStatistic[type]);
    const labels = sortedKeys.map((type) => `${TripPointType[type].icon} ${TripPointType[type].name}`);

    this._transportChart.config.data.datasets[0].data = values;
    this._transportChart.data.labels = labels;
    transportChartElement.height = BAR_HEIGHT * labels.length;
    this._transportChart.canvas.parentNode.style.height = `${BAR_HEIGHT * labels.length}px`;
    this._transportChart.update();
  }

  _updateTimeSpentChart(data) {
    const timeSpentChartElement = this._element.querySelector(`.statistic__time-spend`);
    if (!this._timeSpentChart) {
      this._timeSpentChart = new Chart(timeSpentChartElement, timeSpentChartConfig);
    }

    const timeSpentStatistic = {};

    for (const tripPoint of data) {
      if (timeSpentStatistic.hasOwnProperty(tripPoint.type)) {
        timeSpentStatistic[tripPoint.type] += this._getTripPointMinuteDuration(tripPoint);
      } else {
        timeSpentStatistic[tripPoint.type] = this._getTripPointMinuteDuration(tripPoint);
      }
    }

    const sortedKeys = Object.keys(timeSpentStatistic).sort((a, b) => {
      return timeSpentStatistic[b] - timeSpentStatistic[a];
    });
    const values = sortedKeys.map((type) => timeSpentStatistic[type]);
    const labels = sortedKeys.map((type) => `${TripPointType[type].icon} ${TripPointType[type].name}`);

    this._timeSpentChart.config.data.datasets[0].data = values;
    this._timeSpentChart.data.labels = labels;
    timeSpentChartElement.height = BAR_HEIGHT * labels.length;
    this._timeSpentChart.canvas.parentNode.style.height = `${BAR_HEIGHT * labels.length}px`;
    this._timeSpentChart.update();
  }

  _getTripPointMinuteDuration(tripPoint) {
    return Math.abs(tripPoint.startTime - tripPoint.endTime) / 60 / 1000;
  }
}

