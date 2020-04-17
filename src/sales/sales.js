const client = new Keen({
  projectId: '5e997ab41047844b20e7cbb0',
  readKey:
    '4abf4fc8c26fed7ceae64cf3fa2fcc44ee65e19ca734d2c050e5950af5ad6180271a622e6ccb5a90f1d30ad816e3dcf8270c0f215edf223721810b347e692adda68ac600a3dd58b63ef9c92687afd4f17ed3b4030cc6d0eb5fc5c87b10e87461',
});

/* Gauges */

const totalLeads = client.query({
  analysis_type: 'count',
  event_collection: 'marketing_lead',
  timeframe: {
    start: '2020-04-03T00:00:00.000Z',
    end: '2020-04-04T00:00:00.000Z',
  },
});

const totalWins = client.query({
  analysis_type: 'count',
  event_collection: 'marketing_win',
  timeframe: {
    start: '2020-04-03T00:00:00.000Z',
    end: '2020-04-04T00:00:00.000Z',
  },
});

const totalOpportunities = client.query({
  analysis_type: 'count',
  event_collection: 'marketing_opportunity',
  timeframe: {
    start: '2020-04-03T00:00:00.000Z',
    end: '2020-04-04T00:00:00.000Z',
  },
});

client.run([totalOpportunities, totalWins]).then((res) => {
  const opportunities = res[0].result;

  new KeenDataviz({
    type: 'gauge',
    container: '#chart-07',
    widget: {
      title: {
        content: 'Opportunity to win ratio',
      },
    },
    settings: {
      maxValue: opportunities,
    },
  }).render(res[1]);
});

client.run([totalLeads, totalWins]).then((res) => {
  const leads = res[0].result;

  new KeenDataviz({
    type: 'gauge',
    container: '#chart-08',
    widget: {
      title: {
        content: 'Lead Conversion Ratio',
      },
    },
    settings: {
      maxValue: leads,
    },
  }).render(res[1]);
});

client.run([totalLeads, totalOpportunities]).then((res) => {
  const leads = res[0].result;

  new KeenDataviz({
    type: 'gauge',
    container: '#chart-09',
    widget: {
      title: {
        content: 'Lead to opportunity ratio',
      },
    },
    settings: {
      maxValue: leads,
    },
  }).render(res[1]);
});

/* Average Lead Cycle */

const averageLeadCycle = new KeenDataviz({
  type: 'metric',
  container: '#chart-02',
  settings: {
    caption: 'Avg. Lead cycle time',
    formatValue: (v) => `${v.toFixed(0)} days`,
    theme: {
      metric: {
        value: {
          typography: {
            fontSize: 40,
          },
        },
        icon: {
          enabled: true,
        },
      },
    },
  },
});

client
  .query({
    analysis_type: 'average',
    event_collection: 'marketing_lead',
    target_property: 'days_in_stage',
    timeframe: {
      start: '2020-04-03T00:00:00.000Z',
      end: '2020-04-04T00:00:00.000Z',
    },
  })
  .then((res) => averageLeadCycle.render(res));

/* Average Opportunities Cycle */

const averageOppCycle = new KeenDataviz({
  type: 'metric',
  container: '#chart-03',
  settings: {
    caption: 'Avg. Opp cycle time',
    formatValue: (v) => `${v.toFixed(0)} days`,
    theme: {
      metric: {
        value: {
          typography: {
            fontSize: 40,
          },
        },
        icon: {
          enabled: true,
        },
      },
    },
  },
});

client
  .query({
    analysis_type: 'average',
    event_collection: 'marketing_opportunity',
    target_property: 'days_in_stage',
    timeframe: {
      start: '2020-04-03T00:00:00.000Z',
      end: '2020-04-04T00:00:00.000Z',
    },
  })
  .then((res) => averageOppCycle.render(res));

/* Average Evaluation Cycle */

const averageEvaluationCycle = new KeenDataviz({
  type: 'metric',
  container: '#chart-04',
  settings: {
    caption: 'Avg. Eval. cycle time',
    formatValue: (v) => `${Math.ceil(v)} days`,
    theme: {
      metric: {
        value: {
          typography: {
            fontSize: 40,
          },
        },
        icon: {
          enabled: true,
        },
      },
    },
  },
});

client
  .query({
    analysis_type: 'average',
    event_collection: 'marketing_evaluation',
    target_property: 'days_in_stage',
    timeframe: {
      start: '2020-04-03T00:00:00.000Z',
      end: '2020-04-04T00:00:00.000Z',
    },
  })
  .then((res) => averageEvaluationCycle.render(res));

/* Average Closing Cycle */

const averageClosingCycle = new KeenDataviz({
  type: 'metric',
  container: '#chart-05',
  settings: {
    caption: 'Avg. Closing cycle time',
    formatValue: (v) => `${Math.ceil(v)} days`,
    theme: {
      metric: {
        value: {
          typography: {
            fontSize: 40,
          },
        },
        icon: {
          enabled: true,
        },
      },
    },
  },
});

client
  .query({
    analysis_type: 'average',
    event_collection: 'marketing_close',
    target_property: 'days_in_stage',
    timeframe: {
      start: '2020-04-03T00:00:00.000Z',
      end: '2020-04-04T00:00:00.000Z',
    },
  })
  .then((res) => averageClosingCycle.render(res));

/* Average Win Cycle */

const averageWinCycle = new KeenDataviz({
  type: 'metric',
  container: '#chart-06',
  settings: {
    caption: 'Avg. Win cycle time',
    formatValue: (v) => `${Math.ceil(v)} days`,
    theme: {
      metric: {
        value: {
          typography: {
            fontSize: 40,
          },
        },
        icon: {
          enabled: true,
        },
      },
    },
  },
});

client
  .query({
    analysis_type: 'average',
    event_collection: 'marketing_win',
    target_property: 'days_in_stage',
    timeframe: {
      start: '2020-04-03T00:00:00.000Z',
      end: '2020-04-04T00:00:00.000Z',
    },
  })
  .then((res) => averageWinCycle.render(res));

/* Sales Funnel */

const usersFlowFunnel = new KeenDataviz({
  type: 'funnel',
  container: '#chart-01',
  mappings: {
    marketing_lead: 'Leads',
    marketing_opportunity: 'Opportunities',
    marketing_evaluation: 'Evaluation',
    marketing_close: 'Closing',
    marketing_win: 'Won',
  },
  widget: {
    title: {
      content: 'Sales Funnel',
    },
  },
});

client
  .query({
    analysis_type: 'funnel',
    steps: [
      {
        event_collection: 'marketing_lead',
        actor_property: 'user_id',
        timeframe: {
          start: '2020-04-03T00:00:00.000Z',
          end: '2020-04-04T00:00:00.000Z',
        },
      },
      {
        event_collection: 'marketing_opportunity',
        actor_property: 'user_id',
        timeframe: {
          start: '2020-04-03T00:00:00.000Z',
          end: '2020-04-04T00:00:00.000Z',
        },
      },
      {
        event_collection: 'marketing_evaluation',
        actor_property: 'user_id',
        timeframe: {
          start: '2020-04-03T00:00:00.000Z',
          end: '2020-04-04T00:00:00.000Z',
        },
      },
      {
        event_collection: 'marketing_close',
        actor_property: 'user_id',
        timeframe: {
          start: '2020-04-03T00:00:00.000Z',
          end: '2020-04-04T00:00:00.000Z',
        },
      },
      {
        event_collection: 'marketing_win',
        actor_property: 'user_id',
        timeframe: {
          start: '2020-04-03T00:00:00.000Z',
          end: '2020-04-04T00:00:00.000Z',
        },
      },
    ],
  })
  .then((res) => usersFlowFunnel.render(res));
