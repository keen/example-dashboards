// CONSTS

const DAYS = 30;
const TODAY = new Date();
const VALUE = {
  fontColor: '#414D53',
  fontFamily: 'Montserrat, sans-serif',
  fontSize: 60,
  fontWeight: 400,
};
const CAPTION = {
  fontColor: '#414D53',
  fontFamily: 'Montserrat, sans-serif',
  fontSize: 20,
  fontWeight: 400,
};
const SUFFIX = {
  fontColor: '#728892',
  fontFamily: 'Montserrat, sans-serif',
  fontSize: 32,
  fontWeight: 300,
};
const TITLE = {
  fontColor: '#414D53',
  fontFamily: 'Montserrat, sans-serif',
  fontSize: 18,
  fontWeight: 400,
};
const LEGEND = {
  fontColor: '#2F3E42',
  fontFamily: 'Montserrat, sans-serif',
  fontSize: 14,
  fontWeight: 400,
};
const AXIS_X = {
  fontColor: '#2F3E42',
  fontFamily: 'Montserrat, sans-serif',
  fontSize: 10,
  fontWeight: 400,
};
const AXIS_Y = {
  fontColor: '#2F3E42',
  fontFamily: 'Montserrat, sans-serif',
  fontSize: 12,
  fontWeight: 400,
};
const TOOLTIP = {
  fontFamily: 'Montserrat, sans-serif',
  fontSize: 12,
  fontWeight: 400,
}

// HELPERS

const getHeaderTime = () => {
  const currentTime = new Date();

  const weekDay = document.querySelector('.header__weekday');
  const day = document.querySelector('.header__day');
  const month = document.querySelector('.header__month');
  const time = document.querySelector('.header__time');
  const period = document.querySelector('.header__period');

  const timeParts = currentTime.toLocaleTimeString([], {hour12 : true, hour:  "numeric", minute: "numeric"}).split(' ');

  weekDay.innerHTML = currentTime.toLocaleDateString('default', { weekday: 'short' });
  day.innerHTML = currentTime.getDate();
  month.innerHTML = currentTime.toLocaleDateString('default', { month: 'long' });
  time.innerHTML = timeParts[0];
  period.innerHTML = timeParts[1].toUpperCase();
  
}

const getCycleData = () => {
  const containers = document.querySelectorAll('.cycle__date');

  const currentDate = new Date();
  const previousDate = new Date(Date.now()-DAYS*24*60*60*1000);
  const currentYear = currentDate.getFullYear();

  const formatCurrentDate = currentDate.toLocaleDateString('default', { month: 'long', day: 'numeric' });
  const formatPreviousDate = previousDate.toLocaleDateString('default', { month: 'long', day: 'numeric' });

  containers.forEach(container => {
    container.innerHTML = `${formatPreviousDate} - ${formatCurrentDate} ${currentYear}`;
  })
}

const rand = (min, max) => Math.floor(Math.random() * (max - min) + min);

const clearNavigation = () => {
  document.querySelectorAll('.nav__link').forEach((el) => {
    el.classList.remove('nav__link--active');
  });
};

const getSecurityData = num => num <= 0.25 ? 0 : 1;

// DASHBOARDS
// * Overview

const temperatureData = { result: rand(10, 40) };
const temperatureChart = new KeenDataviz({
  type: 'metric',
  container: '#chart-01',
  settings: {
    theme: {
      metric: {
        icon: {
          margins: { top: 30, left: 30, bottom: 0, right: 20 },
          enabled: true,
          type: 'temperature',
          style: 'regular',
        },
        caption: {
          typography: CAPTION,
        },
        value: {
          typography: VALUE,
        },
        suffix: {
          typography: SUFFIX,
        }
      },
    },
    caption: 'Temperature',
    valueSuffix: '°C',
  },
});

const humidityData = { result: rand(10,90) };
const humidityChart = new KeenDataviz({
  type: 'gauge',
  container: '#chart-02',
  settings: {
    margins: {
      top: 0,
      right: 0,
      bottom: 0,
      left: 0,
    },
    svgDimensions: {
      width: 700,
      height: 400,
    },
      theme: {
        gauge: {
          border: {
            backgroundColor: '#70AFCC',
          },
          total: {
            typography: {
              fontColor: '#70AFCC',
              fontFamily: 'Montserrat, sans-serif',
              fontSize: 60,
              fontWeight: 400,
            },
          },
          labels: {
            enabled: false,
          },
        },
        colors: ['#bfdae6', '#70AFCC'],
        tooltip: {
          labels: {
            typography: TOOLTIP
          }
        }
      },
      colorSteps: 2,
      colorMode: 'continuous',
      maxValue: 100,
    },
    widget: {
      title: {
        content: 'Humidity',
        typography: CAPTION,
      },
    },
  }
);

const pmData = { result: rand(3,200) };
const pmChart = new KeenDataviz({
  type: 'metric',
  container: '#chart-03',
  settings: {
    theme: {
      metric: {
        caption: {
          typography: CAPTION,
        },
        value: {
          typography: VALUE,
        },
        suffix: {
          typography: SUFFIX,
        }
      },
    },
    caption: 'PM 2.5 level',
    valueSuffix: 'µg/m³',
  },
});

const wiFiData = { result: rand(10, 500) };
const wiFiChart = new KeenDataviz({
  type: 'metric',
  container: '#chart-04',
  settings: {
    theme: {
      metric: {
        caption: {
          typography: CAPTION,
        },
        value: {
          typography: VALUE,
        },
        suffix: {
          typography: SUFFIX,
        }
      },
    },
    caption: 'WiFi',
    valueSuffix: 'Mb/s',
  },
});

const securityData = { result: getSecurityData(Math.random()) };
const securityChart = new KeenDataviz({
  type: 'metric',
  container: '#chart-05',
  settings: {
    formatValue: v => v ? 'Armed' : 'Unarmed',
    theme: {
      metric: {
        icon: {
          margins: { top: 30, left: 0, bottom: 0, right: 0 },
          enabled: true,
          type: 'lock-closed',
          style: 'regular',
        },
        caption: {
          typography: CAPTION,
        },
        value: {
          typography: {
            fontFamily: 'Montserrat, sans-serif',
            fontColor: '#2D8C86',
            fontSize: 40,
          },
        },
      },
    },
    caption: 'Security',
  },
});

// * Usage

const generateWaterConsumptionData = () => {
  let hotWater = 0;
  let coldWater = 0;
  const arr = [];

  for (let i = DAYS; i > 0; i--) {
    coldWater += rand(10, 100);
    hotWater += rand(2, 60);
    const date = new Date(Date.now()-i*24*60*60*1000).toString();
    arr.push({
      coldWater,
      hotWater,
      name: date,
    });
  }
  return arr;
};

const waterConsumption = generateWaterConsumptionData();
const waterConsumptionData = { result: waterConsumption };
const coldWaterTotal = waterConsumption.reduce((acc, cur) => cur.coldWater + acc, 0);
const hotWaterTotal = waterConsumption.reduce((acc, cur) => cur.hotWater + acc, 0);

const waterConsumptionChart = new KeenDataviz({
  type: 'area',
  container: '#chart-06',
  settings: {
    labelSelector: "name",
    keys: ['coldWater', 'hotWater'],
    strokeWidth: 0,
    markRadius: 0,
    groupMode: 'stacked',
    stackMode: 'normal',
    theme: {
      colors: ['#BED9E6', '#D64C4C'],
      axisX: {
        enabled: false
      },
      axisY: {
        enabled: false
      },
      gridX: {
        enabled: false
      },
      gridY: {
        enabled: false
      },
      tooltip: {
        labels: {
          typography: TOOLTIP
        }
      }
    },
    margins: {
      top: 10,
      left: 30,
      right: 20,
      bottom: 30,
    },
  },
  widget: {
    legend: {
      enabled: true,
      typography: LEGEND
    },
    title: {
      content: 'Water consumption',
      typography: TITLE,
    },
  },
});

const totalWaterConsumptionData = { result: [
  { consumption: 'Hot water', result: hotWaterTotal },
  { consumption: 'Cold water', result: coldWaterTotal },
]};

const totalWaterConsumptionChart = new KeenDataviz({
  type: 'donut',
  container: '#chart-07',
  widget: {
    title: {
      content: 'Total water consumption',
      typography: TITLE
    },
    legend: {
      enabled: false
    },
  },
  settings: {
    innerRadius: 0.65,
    theme: {
      colors: ['#D64C4C', '#BED9E6'],
      donut: {
        labels: {
          enabled: false
        },
        total: {
          enabled: true,
          label: {
            typography: {
              fontWeight: 400,
              fontSize: 12,
              fontFamily: 'Montserrat, sans-serif',
              fontColor: '#414D53',
            },
          },
          value: {
            typography: CAPTION,
          },
        },
      },
      tooltip: {
        labels: {
          typography: TOOLTIP
        }
      }
    }
  }
});

const generatePowerConsumptionData = () => {
  const arr = [];

  for (let i = DAYS; i > 0; i--) {
    const date = new Date(Date.now()-i*24*60*60*1000).toString();
    arr.push({
      powerConsumption: rand(5, 40),
      name: date,
    });
  }
  return arr;
};

const powerConsumption = generatePowerConsumptionData();
const powerConsumptionData = { result: powerConsumption };
const totalPowerConsumption = powerConsumption.reduce((acc, cur) => cur.powerConsumption + acc, 0);
const totalPowerConsumptionData = { result: totalPowerConsumption };

const powerConsumptionChart = new KeenDataviz({
  type: 'line',
  container: '#chart-08',
  settings: {
    minValue: 'auto',
    maxValue: 'auto',
    labelSelector: "name",
    keys: ['powerConsumption'],
    markRadius: 1,
    xScaleSettings: {
      type: 'time',
      precision: 'week',
      formatLabel: v => new Date(v).toLocaleDateString('default', { month: 'long', day: 'numeric' }),
    },
    theme: {
      colors: ['#2D8C86'],
      axisX: {
        labels: {
          typography: AXIS_X,
        }
      },
      axisY: {
        tickPadding: 20,
        labels: {
          typography: AXIS_Y
        }
      },
      gridX: {
        color: '#E1E2E4'
      },
      gridY: {
        color: '#E1E2E4'
      },
      tooltip: {
        labels: {
          typography: TOOLTIP
        }
      }
    },
    margins: {
      top: 10,
      left: 50,
      right: 20,
      bottom: 30,
    },
  },
  widget: {
    legend: {
      enabled: false,
    },
    title: {
      content: 'Power consumption',
      typography: TITLE,
    },
  },
});

const totalPowerConsumptionChart = new KeenDataviz({
  type: 'metric',
  container: '#chart-09',
  settings: {
    theme: {
      metric: {
        caption: {
          typography: CAPTION,
        },
        value: {
          typography: VALUE
        },
        suffix: {
          typography: SUFFIX
        }
      },
    },
    caption: 'Total power consumption',
    valueSuffix: 'kWh',
  },
});

// * Costs

const totalBillData = {result: rand(100, 500)};
const totalBillChart = new KeenDataviz({
  type: 'metric',
  container: '#chart-10',
  settings: {
    theme: {
      metric: {
        icon: {
          margins: { top: 30, left: 30, bottom: 0, right: 20 },
          enabled: true,
          type: 'money-outline',
          style: 'regular',
        },
        caption: {
          typography: {
            ...CAPTION,
            fontColor: '#fff',
          }
        },
        value: {
          typography: {
            ...VALUE,
            fontColor: '#fff'
          }
        },
      },
    },
    formatValue: (v) => `$${v}`,
    caption: 'Total bill to date',
  },
  widget: {
    card: {
      backgroundColor: '#69A598',
    }
  }
});

const generateCostsData = () => {
  const days = 9;
  const arr = [];

  for (let i = days; i > 0; i--) {
    const coldWater = rand(10, 20);
    const hotWater = rand(20, 40);
    const energy = rand(10,60)
    const date = new Date(Date.now()-i*24*60*60*1000).toString();
    arr.push({
      coldWater,
      hotWater,
      energy,
      name: date,
    });
  }
  return arr;
}

const totalCost = generateCostsData();
const totalCostData = { result: totalCost };
const coldWaterCost = totalCost.reduce((acc, cur) => cur.coldWater + acc, 0);
const hotWaterCost = totalCost.reduce((acc, cur) => cur.hotWater + acc, 0);
const energyCost = totalCost.reduce((acc, cur) => cur.energy + acc, 0);

const totalCostsByCategoryData = { result: [
  { cost: 'Hot water', result: hotWaterCost },
  { cost: 'Cold water', result: coldWaterCost },
  { cost: 'Energy', result: energyCost },
]};
  
const totalCostChart = new KeenDataviz({
  type: 'bar',
  container: '#chart-11',
  settings: {
    groupMode: 'stacked',
    stackMode: 'normal',
    labelSelector: "name",
    keys: ['hotWater', 'coldWater', 'energy'],
    margins: {
      top: 30,
      left: 30,
      right: 20,
      bottom: 50,
    },
    barPadding: 0.7,
    xScaleSettings: {
      type: 'time',
      precision: 'month',
      formatLabel: v => new Date(v).toLocaleDateString('default', { month: 'long', day: 'numeric' }),
    },
    theme: {
      colors: ['#CB1F1F', '#ADCFDF', '#57A39E'],
      axisX: {
        labels: {
          typography: AXIS_X
        }
      },
      axisY: {
        enabled: false,
      },
      gridX: {
        enabled: false,
      },
      gridY: {
        enabled: false,
      },
      tooltip: {
        labels: {
          typography: TOOLTIP
        }
      }
    },
  },
  widget: {
    legend: {
      enabled: true,
      typography: LEGEND
    },
    title: {
      content: 'Cost by day',
      typography: TITLE,
    },
  },
});

const totalCostByCategoryChart = new KeenDataviz({
  type: 'pie',
  container: '#chart-12',
  widget: {
    title: {
      content: 'Cost by category',
      typography: TITLE
    },
    legend: {
      enabled: false
    },
  },
  settings: {
    theme: {
      colors: ['#CB1F1F', '#ADCFDF', '#57A39E'],
      pie: {
        labels: {
          enabled: false
        }
      },
      tooltip: {
        labels: {
          typography: TOOLTIP
        }
      }
    }
  }
});



window.addEventListener('DOMContentLoaded', () => {
  const navItems = document.querySelectorAll('.nav__link');

  navItems.forEach((element) => {
    element.addEventListener('click', (e) => {
      e.preventDefault();
      const dashboard = e.currentTarget.getAttribute('data-dashboard');
      if (!dashboard) return;
      
      clearNavigation();
      element.classList.add('nav__link--active');

      document.querySelectorAll('.dashboard-page').forEach((el) => el.classList.add('hidden'));
      document.querySelector(`.dashboard-page[data-dashboard="${dashboard}"]`).classList.remove('hidden');
    });
  });

  getHeaderTime();
  getCycleData();

  temperatureChart.render(temperatureData);
  humidityChart.render(humidityData);
  pmChart.render(pmData);
  wiFiChart.render(wiFiData);
  securityChart.render(securityData);

  waterConsumptionChart.render(waterConsumptionData);
  totalWaterConsumptionChart.render(totalWaterConsumptionData);
  powerConsumptionChart.render(powerConsumptionData);
  totalPowerConsumptionChart.render(totalPowerConsumptionData);

  totalBillChart.render(totalBillData);
  totalCostChart.render(totalCostData);
  totalCostByCategoryChart.render(totalCostsByCategoryData);
});
