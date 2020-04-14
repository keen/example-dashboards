const client = new Keen({
  projectId: '5e9568111ad9ac3d11425511',
  readKey:
    '9e79789cf22c62efd15a50ed2e1cbe9541fd59b03f5b87e5f4a5403a83a5e00a3f364d2c8268ea4dd0d904b248bbe5da860e00a05a98039ed8a936f07f440f55b9be3d04acde0a3e3f01f52dd2da545473d415af7c4e7e10926a671f3578536f',
});

/* Views by Channel */

const viewsByChannel = new KeenDataviz({
  type: 'pie',
  container: '#chart-10',
  widget: {
    title: {
      content: 'Advertisement views',
    },
    subtitle: {
      content: 'By channel',
    },
  },
});

const viewsByChannelQuery = client
  .query({
    analysis_type: 'count',
    event_collection: 'ad_campaing_view',
    group_by: ['channel'],
    timeframe: {
      start: '2020-04-01T00:00:00.000-00:00',
      end: '2020-04-15T00:00:00.000-00:00',
    },
  })
  .then((res) => viewsByChannel.render(res));

/* Today Costs */

const costMetric = new KeenDataviz({
  type: 'metric',
  container: '#chart-03 ',
  settings: {
    type: 'difference',
    labelPrefix: '$',
  },
  widget: {
    title: {
      content: 'Marketing Qualified Leads',
    },
    subtitle: {
      content: 'Daily cost compare',
    },
  },
});

const todayCost = client
  .query({
    analysis_type: 'sum',
    event_collection: 'ad_campaing_mql',
    target_property: 'cost',
    interval: 'daily',
    timeframe: {
      start: '2020-04-01T00:00:00.000-00:00',
      end: '2020-04-12T00:00:00.000-00:00',
    },
  })
  .then((res) => {
    console.log(res, 'kwa');
    costMetric.render(res);
  });

/* Advertisement Budget */

const totalCostGauge = new KeenDataviz({
  type: 'gauge',
  container: '#chart-01',
  settings: {
    //  colorMode: 'discrete',
    colorSteps: 3,
    maxValue: 25000,
  },
  widget: {
    title: {
      content: 'Advertisement Budget',
    },
    subtitle: {
      content: 'Total money spend',
    },
  },
});

/* MQL over time */

const mqlByChannel = new KeenDataviz({
  container: '#chart-02',
  type: 'area',
  settings: {
    margins: { top: 20, right: 30, bottom: 70, left: 40 },
    groupMode: 'stacked',
    theme: {
      gridX: {
        enabled: false,
      },
      axisX: {
        labels: {
          radiusAngle: 45,
        },
      },
    },
  },
  widget: {
    title: {
      content: 'Marketing Qualified Leads',
    },
    subtitle: {
      content: 'By channel',
    },
  },
});

client
  .query('count', {
    event_collection: 'ad_campaing_mql',
    group_by: 'channel',
    interval: 'daily',
    timeframe: {
      start: '2020-04-01T00:00:00.000Z',
      end: '2020-04-12T00:00:00.000Z',
    },
  })
  .then((res) => {
    mqlByChannel.render(res);
  });

const campaingTotalCostsQuery = client
  .query({
    analysis_type: 'sum',
    event_collection: 'ad_campaing_cost',
    target_property: 'cost',
    timeframe: {
      start: '2020-04-01T00:00:00.000-00:00',
      end: '2020-04-15T00:00:00.000-00:00',
    },
  })
  .then((res) => totalCostGauge.render(res));

/* Correlation between clicks, cost and views */

const campaingConversionQuery = client.query({
  analysis_type: 'count',
  event_collection: 'ad_campaing_click',
  group_by: ['channel'],
  timeframe: {
    start: '2020-04-01T00:00:00.000-00:00',
    end: '2020-04-15T00:00:00.000-00:00',
  },
});

const campaingCostsQuery = client.query({
  analysis_type: 'sum',
  event_collection: 'ad_campaing_cost',
  target_property: 'cost',
  group_by: ['channel'],
  timeframe: {
    start: '2020-04-01T00:00:00.000-00:00',
    end: '2020-04-15T00:00:00.000-00:00',
  },
});

const campaingViewQuery = client.query({
  analysis_type: 'count',
  event_collection: 'ad_campaing_view',
  group_by: ['channel'],
  timeframe: {
    start: '2020-04-01T00:00:00.000-00:00',
    end: '2020-04-15T00:00:00.000-00:00',
  },
});

const bubbleChart = new KeenDataviz({
  type: 'bubble',
  container: '#chart-07',
  mappings: {
    '0.ad_campaing_click.count.keen.value': 'Clicks',
    '1.ad_campaing_view.count.keen.value': 'Views',
    '2.ad_campaing_cost.sum.keen.value': 'Cost',
  },
  settings: {
    maxAreaRadius: 25,
    margins: { top: 20, right: 20, bottom: 50, left: 40 },
  },
  widget: {
    title: {
      content: 'Ad Campaing',
    },
    subtitle: {
      content: 'Correlation between views, clicks and cost',
    },
  },
});

client
  .run([campaingConversionQuery, campaingViewQuery, campaingCostsQuery])
  .then((res) => bubbleChart.render(res));

/* Total Conversions */

const clicksMetric = new KeenDataviz({
  type: 'metric',
  container: '#chart-06',
  widget: {
    title: {
      content: 'Total conversions',
    },
    subtitle: {
      content: 'Advertisement clicks',
    },
  },
});

client
  .query({
    analysis_type: 'count',
    event_collection: 'ad_campaing_click',
    timeframe: {
      start: '2020-04-01T00:00:00.000-00:00',
      end: '2020-04-15T00:00:00.000-00:00',
    },
  })
  .then((res) => clicksMetric.render(res));

/* Total Impressions */

const impressionsMetric = new KeenDataviz({
  type: 'metric',
  container: '#chart-05',
  widget: {
    title: {
      content: 'Total impressions',
    },
    subtitle: {
      content: 'Advertisement views',
    },
  },
});

client
  .query({
    analysis_type: 'count',
    event_collection: 'ad_campaing_view',
    timeframe: {
      start: '2020-04-01T00:00:00.000-00:00',
      end: '2020-04-15T00:00:00.000-00:00',
    },
  })
  .then((res) => impressionsMetric.render(res));

/* MQL Cost over time */

const mqlCostOverTime = new KeenDataviz({
  container: '#chart-08',
  type: 'line',
  settings: {
    margins: { top: 20, right: 30, bottom: 70, left: 40 },
    curve: 'spline',
    theme: {
      gridX: {
        enabled: false,
      },
      axisX: {
        labels: {
          radiusAngle: 45,
        },
      },
    },
  },
  widget: {
    title: {
      content: 'Marketing Qualified Leads',
    },
    subtitle: {
      content: 'Daily cost per channel',
    },
  },
});

client
  .query({
    analysis_type: 'sum',
    event_collection: 'ad_campaing_mql',
    group_by: 'channel',
    interval: 'daily',
    target_property: 'cost',
    timeframe: {
      start: '2020-04-01T00:00:00.000Z',
      end: '2020-04-12T00:00:00.000Z',
    },
  })
  .then((res) => {
    mqlCostOverTime.render(res);
  });

/* MQL Total */

const mqlMetric = new KeenDataviz({
  type: 'metric',
  container: '#chart-09',
  widget: {
    title: {
      content: 'Marketing Qualified Leads',
    },
    subtitle: {
      content: 'Total',
    },
  },
});

client
  .query({
    analysis_type: 'count',
    event_collection: 'ad_campaing_mql',
    timeframe: {
      start: '2020-04-01T00:00:00.000Z',
      end: '2020-04-12T00:00:00.000Z',
    },
  })
  .then((res) => {
    mqlMetric.render(res);
  });

/* Views by country  */

const countryViews = new KeenDataviz({
  type: 'bar',
  container: '#chart-11',
  settings: {
    theme: {
      gridX: {
        enabled: false
      }
    }
  },
  widget: {
    title: {
      content: 'Advertisement Cost',
    },
    subtitle: {
      content: 'Daily by channel',
    },
  },
});

client
  .query({
    analysis_type: 'sum',
    event_collection: 'ad_campaing_mql',
    group_by: 'channel',
    interval: 'daily',
    target_property: 'cost',
    timeframe: {
      start: '2020-04-01T00:00:00.000Z',
      end: '2020-04-12T00:00:00.000Z',
    },
  })
  .then((res) => {
    countryViews.render(res);
  });
