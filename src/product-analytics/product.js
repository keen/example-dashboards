const client = new Keen({
  projectId: '5e9559b18039643b3d4c1ab5',
  readKey:
    '73428cfdfd1b4c5dfd40b8a20e90c38b725ed51601d1d4ffd160f3f348c4358bd1324b928967c13ccf148d6e053aa00ad356f37c8f4be33f07a3c28ca3b0b74d8b20cb5ffa91c03a7fd385c490e3bcdcead2cd17411f0c0ce9824e1fc3cd4faf',
});

/* Themes */

const CARD = {
  backgroundColor: '#0D3D55',
};

const WIDGET_TITLE_TYPOGRAPHY = {
  fontColor: '#FFF',
  fontFamily: 'Gangster Grotesk Regular',
  fontSize: 24,
};

const METRIC_LIGHT_THEME = {
  metric: {
    icon: {
      margins: { top: 30, left: 30, bottom: 0, right: 20 },
      enabled: true,
      type: 'users-outline',
      style: 'regular',
    },
    caption: {
      typography: {
        fontColor: '#1D2729',
      },
    },
    value: {
      typography: {
        fontColor: '#012537',
      },
    },
  },
};

const METRIC_DARK_THEME = {
  metric: {
    value: {
      typography: {
        fontColor: '#C9ECF8',
      },
    },
    caption: {
      typography: {
        fontColor: '#CDCFD3',
      },
    },
    icon: {
      enabled: true,
      margins: { top: 30, left: 30, bottom: 0, right: 20 },
      style: 'regular',
    },
  },
};

const cartesianChartTheme = {
  axisX: {
    color: 'rgba(29, 39, 41, 0.59)',
    tickPadding: 15,
    tickSize: 5,
    labels: {
      typography: {
        fontColor: '#FFF',
      },
    },
  },
  axisY: {
    labels: {
      typography: {
        fontColor: '#FFF',
      },
    },
  },
  gridY: {
    color: 'rgba(205, 207, 211, 0.1)',
  },
  gridX: {
    enabled: false,
  },
  colors: ['#7ABD8E', '#E66C37'],
};

/* Revenue this month */

const revenue = client.query({
  analysis_type: 'count',
  event_collection: 'revenue_grow',
  interval: 'daily',
  timeframe: {
    start: '2020-04-01T00:00:00.000Z',
    end: '2020-04-20T00:00:00.000Z',
  },
});

const lostInRevenue = client.query({
  analysis_type: 'count',
  event_collection: 'revenue_lose',
  interval: 'daily',
  timeframe: {
    start: '2020-04-01T00:00:00.000Z',
    end: '2020-04-20T00:00:00.000Z',
  },
});

client.run([revenue, lostInRevenue]).then((res) => {
  new KeenDataviz({
    type: 'line',
    container: '#chart-07',
    mappings: {
      '0.revenue_grow.count.keen.value': 'Revenue',
      '1.revenue_lose.count.keen.value': 'Losts in revenue',
    },
    settings: {
      margins: { top: 10, left: 35, right: 25, bottom: 30 },
      theme: {
        ...cartesianChartTheme,
        colors: ['#9CC0A2', '#F28252'],
      },
    },
    widget: {
      card: {
        backgroundColor: 'transparent',
      },
      legend: {
        position: 'right',
        layout: 'vertical',
        typography: {
          fontColor: '#FFF',
        },
        card: {
          backgroundColor: '#1f3c4a',
        },
      },
      title: {
        content: 'Revenue this month',
        typography: WIDGET_TITLE_TYPOGRAPHY,
      },
    },
  }).render(res);
});

/* New accounts vs canceled accounts */

const newAccounts = client.query({
  analysis_type: 'count',
  event_collection: 'new_subscription',
  interval: 'daily',
  timeframe: {
    start: '2020-04-01T00:00:00.000Z',
    end: '2020-04-20T00:00:00.000Z',
  },
});

const removeAccounts = client.query({
  analysis_type: 'count',
  event_collection: 'cancel_subscription',
  interval: 'daily',
  timeframe: {
    start: '2020-04-01T00:00:00.000Z',
    end: '2020-04-20T00:00:00.000Z',
  },
});

client.run([newAccounts, removeAccounts]).then((res) => {
  new KeenDataviz({
    type: 'bar',
    container: '#chart-06',
    mappings: {
      '0.new_subscription.count.keen.value': 'New accounts',
      '1.cancel_subscription.count.keen.value': 'Cancelled accounts',
    },
    settings: {
      margins: { top: 30, left: 30, right: 25, bottom: 30 },
      theme: cartesianChartTheme,
      barPadding: 0.4,
    },
    widget: {
      card: {
        backgroundColor: 'transparent',
      },
      legend: {
        position: 'right',
        layout: 'vertical',
        typography: {
          fontColor: '#FFF',
        },
        card: {
          backgroundColor: '#1f3c4a',
        },
      },
      title: {
        content: 'New accounts vs cancelled accounts',
        typography: WIDGET_TITLE_TYPOGRAPHY,
      },
    },
  }).render(res);
});

/* Churn Last 30 Days */

const totalUsers = client.query({
  analysis_type: 'count_unique',
  event_collection: 'account_activation',
  target_property: 'userId',
  timeframe: {
    start: '2019-10-01T00:00:00.000Z',
    end: '2020-05-01T00:00:00.000Z',
  },
});

const subscriptionCancel = client.query({
  analysis_type: 'count',
  event_collection: 'subscription_cancel',
  timeframe: {
    start: '2020-04-01T00:00:00.000Z',
    end: '2020-04-30T00:00:00.000Z',
  },
});

client.run([totalUsers, subscriptionCancel]).then((res) => {
  const total = res[0].result;
  const canceled = res[1].result;

  new KeenDataviz({
    type: 'metric',
    container: '#chart-04',
    settings: {
      theme: METRIC_DARK_THEME,
      formatValue: (v) => `${v}%`,
      caption: 'Churn',
      keys: ['churn'],
      data: [
        {
          label: 'Churn',
          churn: (canceled / total).toFixed(3),
        },
      ],
    },
    widget: {
      card: {
        backgroundColor: '#0D3D55',
      },
    },
  }).render();
});

/* Churn cost */

const churnCost = new KeenDataviz({
  type: 'metric',
  container: '#chart-05',
  widget: {
    card: {
      backgroundColor: '#0D3D55',
    },
  },
  settings: {
    theme: {
      metric: {
        value: {
          typography: {
            fontColor: '#F76320',
          },
        },
        caption: {
          typography: {
            fontColor: '#FADACE',
          },
        },
        icon: {
          enabled: true,
          margins: { top: 30, left: 30, bottom: 0, right: 20 },
          style: 'regular',
        },
      },
    },
    formatValue: (v) => `-$${v}`,
    caption: 'Cost of churns',
  },
});

client
  .query({
    analysis_type: 'count',
    event_collection: 'churn_cost',
    timeframe: {
      start: '2020-04-01T00:00:00.000Z',
      end: '2020-04-20T00:00:00.000Z',
    },
  })
  .then((res) => churnCost.render(res));

/* Revenue from new users */

const revenueNewUsers = new KeenDataviz({
  type: 'metric',
  container: '#chart-03',
  widget: {
    card: {
      backgroundColor: '#A2D3E3',
    },
  },
  settings: {
    theme: METRIC_LIGHT_THEME,
    formatValue: (v) => `$${v}`,
    caption: 'Revenue from new accounts',
  },
});

client
  .query({
    analysis_type: 'count',
    event_collection: 'revenue_grow',
    timeframe: {
      start: '2020-04-01T00:00:00.000Z',
      end: '2020-04-20T00:00:00.000Z',
    },
  })
  .then((res) => revenueNewUsers.render(res));

/* Total New Users */

const newUsers = new KeenDataviz({
  type: 'metric',
  container: '#chart-02',
  widget: {
    card: {
      backgroundColor: '#A2D3E3',
    },
  },
  settings: {
    theme: METRIC_LIGHT_THEME,
    caption: 'New Users',
  },
});

client
  .query({
    analysis_type: 'count_unique',
    event_collection: 'account_activation',
    target_property: 'userId',
    timeframe: {
      start: '2019-12-01T00:00:00.000Z',
      end: '2020-04-20T00:00:00.000Z',
    },
  })
  .then((res) => newUsers.render(res));

/* User Sessions */

const sessionOverMonths = new KeenDataviz({
  type: 'line',
  container: '#chart-11',
  settings: {
    theme: cartesianChartTheme,
    margins: {
      top: 10,
      left: 30,
      right: 20,
      bottom: 30,
    },
  },
  widget: {
    card: CARD,
    legend: {
      enabled: false,
    },
    title: {
      content: 'Number of sessions',
      typography: WIDGET_TITLE_TYPOGRAPHY,
    },
  },
});

client
  .query({
    analysis_type: 'count',
    event_collection: 'session',
    interval: 'monthly',
    timeframe: {
      start: '2019-12-01T00:00:00.000Z',
      end: '2020-04-20T00:00:00.000Z',
    },
  })
  .then((res) => sessionOverMonths.render(res));

/* Feature Usage */

const featureUsage = new KeenDataviz({
  type: 'bar',
  container: '#chart-10',
  settings: {
    margins: {
      top: 60,
      left: 30,
      right: 20,
      bottom: 50,
    },
    barPadding: 0.7,
    theme: {
      colors: ['#B7E3F1'],
      gridX: {
        enabled: false,
      },
      axisY: {
        labels: {
          typography: {
            fontColor: '#FFF',
          },
        },
      },
      gridY: {
        color: 'rgba(245, 245, 245, 0.3)',
      },
      axisX: {
        color: 'trasnparent',
        labels: {
          typography: {
            fontColor: '#FFF',
          },
        },
      },
    },
  },
  widget: {
    card: {
      backgroundColor: 'transparent',
    },
    legend: {
      enabled: false,
    },
    title: {
      content: 'Features usage',
      typography: WIDGET_TITLE_TYPOGRAPHY,
    },
  },
});

client
  .query({
    analysis_type: 'count',
    event_collection: 'feature_use',
    group_by: ['feature'],
    timeframe: {
      start: '2019-01-01T00:00:00.000Z',
      end: '2020-05-20T00:00:00.000Z',
    },
  })
  .then((res) => featureUsage.render(res));

/* Session Length */

const sessionAverage = new KeenDataviz({
  type: 'area',
  container: '#chart-12',
  settings: {
    maxValue: 60,
    theme: {
      ...cartesianChartTheme,
      colors: ['#95D4E5'],
    },
    margins: {
      top: 10,
      left: 30,
      right: 20,
      bottom: 30,
    },
  },
  widget: {
    card: CARD,
    legend: {
      enabled: false,
    },
    title: {
      content: 'Average session time',
      typography: WIDGET_TITLE_TYPOGRAPHY,
    },
  },
});

client
  .query({
    analysis_type: 'average',
    event_collection: 'session',
    target_property: 'time',
    interval: 'monthly',
    timeframe: {
      start: '2019-12-11T00:00:00.000-00:00',
      end: '2020-03-04T00:00:00.000-00:00',
    },
  })
  .then((res) => sessionAverage.render(res));

/* Users Funnel */

const usersFlowFunnel = new KeenDataviz({
  type: 'funnel',
  container: '#chart-01',
  mappings: {
    singup: 'Signups',
    account_setup: 'Setup',
    account_activation: 'Activation',
  },
  settings: {
    layout: 'vertical',
    theme: {
      colors: ['#7ABD8E', '#A2D3E3', '#886FBF'],
      funnel: {
        step: {
          backgroundColor: '#416070',
        },
        header: {
          badge: {
            backgroundColor: '#416070',
          },
          value: {
            typography: {
              fontColor: '#fff',
            },
          },
          title: {
            typography: {
              fontColor: '#fff',
            },
          },
          backgroundColor: '#214658',
        },
      },
    },
  },
  widget: {
    card: CARD,
    title: {
      content: 'Conversion rate',
      typography: {
        fontColor: '#FFF',
        fontFamily: 'Gangster Grotesk Regular',
        fontSize: 24,
      },
    },
  },
});

client
  .query({
    analysis_type: 'funnel',
    steps: [
      {
        event_collection: 'singup',
        actor_property: 'userId',
        timeframe: {
          start: '2020-04-16T00:00:00.000Z',
          end: '2020-04-18T00:00:00.000Z',
        },
      },
      {
        event_collection: 'account_activation',
        actor_property: 'userId',
        timeframe: {
          start: '2020-04-16T00:00:00.000Z',
          end: '2020-04-18T00:00:00.000Z',
        },
      },
      {
        event_collection: 'account_setup',
        actor_property: 'userId',
        timeframe: {
          start: '2020-04-16T00:00:00.000Z',
          end: '2020-04-18T00:00:00.000Z',
        },
      },
    ],
  })
  .then((res) => usersFlowFunnel.render(res));

/* Referral Partner */

const referralPartners = new KeenDataviz({
  type: 'metric',
  container: '#chart-09',
  widget: {
    card: {
      backgroundColor: '#0D3D55',
    },
  },
  settings: {
    theme: METRIC_DARK_THEME,
    caption: 'Referral partners',
  },
});

client
  .query({
    analysis_type: 'count',
    event_collection: 'referral_partner',
    timeframe: {
      start: '2020-04-20T00:00:00.000Z',
      end: '2020-04-25T00:00:00.000Z',
    },
  })
  .then((res) => referralPartners.render(res));

/* Active Users */

const allUsers = new KeenDataviz({
  type: 'metric',
  container: '#chart-08',
  widget: {
    card: {
      backgroundColor: '#7ABD8E',
    },
  },
  settings: {
    theme: {
      metric: {
        icon: {
          margins: { top: 30, left: 30, bottom: 0, right: 20 },
          enabled: true,
          type: 'users-outline',
          style: 'regular',
        },
        caption: {
          typography: {
            fontColor: '#1D2729',
          },
        },
        value: {
          typography: {
            fontColor: '#012537',
          },
        },
      },
    },
    caption: 'Active users',
  },
});

client
  .query({
    analysis_type: 'count',
    event_collection: 'create_user',
    timeframe: {
      start: '2020-04-20T00:00:00.000Z',
      end: '2020-04-25T00:00:00.000Z',
    },
  })
  .then((res) => allUsers.render(res));

/* NPS Scores */

const npsScores = new KeenDataviz({
  type: 'bar',
  container: '#chart-13',
  settings: {
    margins: {
      top: 30,
      left: 30,
      right: 20,
      bottom: 50,
    },
    barPadding: 0.7,
    theme: {
      colors: ['#B7E3F1'],
      gridX: {
        enabled: false,
      },
      axisY: {
        labels: {
          typography: {
            fontColor: '#FFF',
          },
        },
      },
      gridY: {
        color: 'rgba(245, 245, 245, 0.3)',
      },
      axisX: {
        color: 'trasnparent',
        labels: {
          typography: {
            fontColor: '#FFF',
          },
        },
      },
    },
  },
  widget: {
    card: CARD,
    legend: {
      enabled: false,
    },
    title: {
      content: 'NPS Survey responses',
      typography: WIDGET_TITLE_TYPOGRAPHY,
    },
  },
});

client
  .query({
    analysis_type: 'count',
    event_collection: 'nps_score',
    group_by: ['score'],
    timeframe: {
      start: '2020-04-01T00:00:00.000Z',
      end: '2020-04-22T00:00:00.000Z',
    },
  })
  .then((res) => npsScores.render(res));

/* NPS Gauge */

const npsGauge = new KeenDataviz({
  type: 'gauge',
  container: '#chart-14',
  settings: {
    maxValue: 500,
    theme: {
      gauge: {
        border: {
          backgroundColor: '#68808d',
        },
        total: {
          typography: {
            fontColor: '#E1E2E4',
          },
        },
        labels: {
          typography: {
            fontColor: '#FFF',
            fontFamily: 'Lato Regular',
          },
        },
      },
      colors: ['#7ABD8E', '#E66C37'],
    },
  },
  widget: {
    card: CARD,
    title: {
      content: 'NPS Survey Users',
      typography: WIDGET_TITLE_TYPOGRAPHY,
    },
  },
});

client
  .query({
    analysis_type: 'count',
    event_collection: 'nps_score',
    timeframe: {
      start: '2020-04-01T00:00:00.000Z',
      end: '2020-04-22T00:00:00.000Z',
    },
  })
  .then((res) => npsGauge.render(res));
