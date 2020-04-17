const client = new Keen({
  projectId: '5e9559b18039643b3d4c1ab5',
  readKey:
    '73428cfdfd1b4c5dfd40b8a20e90c38b725ed51601d1d4ffd160f3f348c4358bd1324b928967c13ccf148d6e053aa00ad356f37c8f4be33f07a3c28ca3b0b74d8b20cb5ffa91c03a7fd385c490e3bcdcead2cd17411f0c0ce9824e1fc3cd4faf',
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
    container: '#chart-07',
    settings: {
      labelSelector: 'label',
      labelSuffix: '%',
      keys: ['churn'],
      data: [
        {
          label: 'Churn',
          churn: (canceled / total).toFixed(3),
        },
      ],
    },
    widget: {
      title: {
        content: 'Churn',
      },
      subtitle: {
        content: 'Last 30 days',
      },
    },
  }).render();
});

/* Total Users */

const newUsers = new KeenDataviz({
  type: 'metric',
  container: '#chart-03',
  widget: {
    title: {
      content: 'New Users',
    },
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
  type: 'area',
  container: '#chart-01',
  settings: {
    curve: 'spline',
    theme: {
      colors: ['#E29B1E'],
      gridX: {
        enabled: false,
      },
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
      enabled: false,
    },
    title: {
      content: 'Number of sessions',
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
  container: '#chart-05',
  settings: {
    barPadding: 0.5,
  },
  widget: {
    legend: {
      enabled: false,
    },
    title: {
      content: 'Features usage',
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
  type: 'line',
  container: '#chart-04',
  settings: {
    maxValue: 60,
    theme: {
      gridX: {
        enabled: false,
      },
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
      enabled: false,
    },
    title: {
      content: 'Average Session Time',
    },
    subtitle: {
      content: 'In seconds',
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
  container: '#chart-02',
  mappings: {
    singup: 'Signups',
    account_setup: 'Account Setup',
    account_activation: 'Account Activation',
  },
  widget: {
    title: {
      content: 'Users conversion rate',
    },
    subtitle: {
      content: 'Last month',
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
