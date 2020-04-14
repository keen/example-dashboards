const client = new Keen({
  projectId: '5368fa5436bf5a5623000000',
  readKey: '3f324dcb5636316d6865ab0ebbbbc725224c7f8f3e8899c7733439965d6d4a2c7f13bf7765458790bd50ec76b4361687f51cf626314585dc246bb51aeb455c0a1dd6ce77a993d9c953c5fc554d1d3530ca5d17bdc6d1333ef3d8146a990c79435bb2c7d936f259a22647a75407921056'
});

const second_client = new KeenAnalysis({
  projectId: '5c87b64ec9e77c0001cf5b6e',
  readKey: 'FB952962910C97DE3E1C6A25EB2FC6B22FDB1ACA9D572948EA18227287BC4E12',
});


Keen.ready(function () {

  // Pageviews by browser


  const pageviews_timeline = new KeenDataviz({
    container: '#chart-03',
    type: 'line',
    widget: {
      title: {
        content: 'Page visitors'
      },
      subtitle: {
        content: 'Based on most popular browsers'
      },
      legend: {
        position: 'left',
        layout: 'vertical',
      }
    },
    settings: {
      curve: 'spline',
      margins: { top: 10, right: 30, bottom: 70, left: 40 },
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
    }
  });

  client
    .query('count', {
      event_collection: 'pageviews',
      interval: 'hourly',
      group_by: 'user.device_info.browser.family',
      timeframe: {
        start: '2014-05-04T00:00:00.000Z',
        end: '2014-05-05T00:00:00.000Z'
      }
    })
    .then(res => {
      pageviews_timeline.render(res);
    })
    .catch(err => {
      pageviews_timeline.message(err.message)
    });


  // Pageviews by browser (pie)

  const pageviews_pie = new KeenDataviz({
    container: '#chart-02',
    type: 'pie',
    settings: {
        margins: { top: 30, right: 5, bottom: 20, left: 5 },
      labelsPosition: 'inside',
    },
    widget: {
      title: {
        content: 'Pageviews'
      },
      subtitle: {
        content: 'By browser'
      }
    },
  });

  client
    .query({
      savedQueryName: 'chart-02',
    })
    .then(function(results){
      pageviews_pie
        .render(results);
    })
    .catch(function(error){
      pageviews_pie
        .message(error.message);
    });


  // Impressions timeline

  const impressions_timeline = new KeenDataviz({
    container: '#chart-01',
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
        content: 'Daily Impressions'
      },
      subtitle: {
        content: 'By advertiser'
      },
    },
  });

  client
    .query('count', {
      event_collection: 'impressions',
      group_by: 'ad.advertiser',
      interval: 'hourly',
      timeframe: {
        start: '2014-05-04T00:00:00.000Z',
        end: '2014-05-05T00:00:00.000Z'
      }
    })
    .then(res => {
      impressions_timeline.render(res);
    })
    .catch(err => {
      impressions_timeline.message(err.message)
    });

  // Impressions by device



  const impressions_by_device = new KeenDataviz({
    container: '#chart-04',
    type: 'bar',
    settings: {
      margins: { top: 20, right: 30, bottom: 70, left: 40 },
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
        content: 'Clicks'
      },
      subtitle: {
        content: 'Grouped by services'
      }
    },
  });

  client
    .query('count', {
      event_collection: 'clicks',
      group_by: 'page.domain',
      interval: 'monthly',
      timeframe: {
        start: '2014-04-01T00:00:00.000Z',
        end: '2014-05-10T00:00:00.000Z'
      }
    })
    .then(res => {
      impressions_by_device.render(res);
    })
    .catch(err => {
      impressions_by_device.message(err.message)
    });


  // Impressions by country

  const pageviews_metric = new KeenDataviz({
    container: '#chart-05',
    type: 'metric',
    widget: {
      title: {
        content: 'Page visits',
      },
      subtitle: {
        content: 'Last two days',
      },
    },
    settings: {
      labelSuffix: ' users',
      type: 'difference',
    }
  });

  client
    .query('count', {
      event_collection: 'pageviews',
      interval: 'hourly',
      timeframe: {
        start: '2014-05-03T00:00:00.000Z',
        end: '2014-05-04T00:00:00.000Z'
      },
    })
    .then(res => {
      pageviews_metric.render(res);
    })
    .catch(err => {
      pageviews_metric.message(err.message)
    });


    const funnel = new KeenDataviz({
      container: '#chart-06',
      type: 'funnel',
      mappings: {
        purchased_device: 'Purchased devices',
        activated_device: 'Activated devices',
        first_session: 'First session',
        second_session: 'Second session',
        invited_friend: 'Friends invited',
      },
      widget: {
        title: {
          content: 'Events Funnel',
        },
      },
    });


   second_client
  .query({
		analysis_type: 'funnel',
    steps: [
      {
        event_collection: 'purchased_device',
        actor_property: 'user.uuid',
        timeframe: {
          start: '2019-03-14T00:00:00.000Z',
          end: '2019-08-15T00:00:00.000Z'
        }
      },
      {
        event_collection: 'activated_device',
        actor_property: 'user.uuid',
        timeframe: {
          start: '2019-03-14T00:00:00.000Z',
          end: '2019-08-15T00:00:00.000Z'
        }
      },
      {
        event_collection: 'first_session',
        actor_property: 'user.uuid',
        timeframe: {
          start: '2019-03-14T00:00:00.000Z',
          end: '2019-08-15T00:00:00.000Z'
        }
      },
      {
        event_collection: 'second_session',
        actor_property: 'user.uuid',
        timeframe: {
          start: '2019-03-14T00:00:00.000Z',
          end: '2019-08-15T00:00:00.000Z'
        }
      },
      {
        event_collection: 'invited_friend',
        actor_property: 'user.uuid',
        timeframe: {
          start: '2019-03-14T00:00:00.000Z',
          end: '2019-08-15T00:00:00.000Z'
        }
      }
    ]
  })
  .then(function(res) {
    // Handle the result
    funnel.render(res);
  });

  const heatmap = new KeenDataviz({
    container: '#chart-07',
    type: 'heatmap',
    widget: {
      title: {
        content: 'Page views',
      },
      subtitle: {
        content: 'Based on browsers',
      },
    },
    settings: {
      margins: { top: 20, right: 30, bottom: 40, left: 50 },
    }
  });

  client
    .query('count', {
      event_collection: 'pageviews',
      interval: 'monthly',
      group_by: ['user.device_info.browser.family'],
      timeframe: {
        start: '2014-03-01T00:00:00.000Z',
        end: '2014-06-30T00:00:00.000Z'
      }
    })
    .then(res => {
      heatmap.render(res);
    })



    const choropleth = new KeenDataviz({
      container: '#chart-08',
      type: 'choropleth',
      geographicArea: 'world',
      widget: {
        title: {
          content: 'Our Clients',
        },
        subtitle: {
          content: 'Worldwide',
        },
      },
      settings: {
        projectionScale: 125,
        colorMode: 'discrete',
        colorSteps: 20,
        margins: { top: 0, right: 0, bottom: 0, left: 0 },
      }
    });

    client
      .query('count', {
        event_collection: 'pageviews',
        group_by: ['user.geo_info.country'],
        timeframe: {
          start: '2014-03-01T00:00:00.000Z',
          end: '2014-06-30T00:00:00.000Z'
        }
      })
      .then(res => {
        choropleth.render(res);
      })

      const donut = new KeenDataviz({
        container: '#chart-09',
        type: 'donut',
        settings: {
          innerRadius: 140,
          stackTreshold: 1.5,
          margins: { top: 30, right: 20, bottom: 20, left: 40 },
          theme: {
            donut: {
              labels: {
                enabled: false,
              },
              total: {
                typography: {
                  fontSize: 60,
                },
              },
            }
          }
        },
        widget: {
          title: {
            content: 'Most popular dashboards',
          },
          subtitle: {
            content: 'By pageviews',
          },
          legend: {
            enabled: true,
          }
        },
      });


      const bubbleChart = new KeenDataviz({
        type: 'bubble',
        container: '#chart-10',
        mappings: {
          '0.ad_campaing_view.count.keen.value': 'Views',
          '1.ad_campaing_cost.sum.keen.value': 'Cost',
          '2.ad_campaing_conversion.count.keen.value': 'Conversion',
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
            content: 'Correlation between views, conversion and cost',
          },
        },
      });

      client
        .query('count', {
          event_collection: 'visits',
          group_by: ['page.title'],
          timeframe: {
            start: '2014-03-01T00:00:00.000Z',
            end: '2014-06-30T00:00:00.000Z'
          }
        })
        .then(res => {
          donut.render(res);
        })


        const conversionQuery = client.query({
          analysis_type: 'count',
          event_collection: 'ad_campaing_conversion',
          group_by: ['channel'],
          timeframe: {
            start: '2020-03-01T00:00:00.000-00:00',
            end: '2020-04-01T00:00:00.000-00:00',
          },
        });

        const viewQuery = client.query({
          analysis_type: 'count',
          event_collection: 'ad_campaing_view',
          group_by: ['channel'],
          timeframe: {
            start: '2020-03-01T00:00:00.000-00:00',
            end: '2020-04-01T00:00:00.000-00:00',
          },
        });

        const costsQuery = client.query({
          analysis_type: 'sum',
          event_collection: 'ad_campaing_cost',
          target_property: 'value',
          group_by: ['channel'],
          timeframe: {
            start: '2020-03-01T00:00:00.000-00:00',
            end: '2020-04-01T00:00:00.000-00:00',
          },
        });

        client
          .run([viewQuery, costsQuery, conversionQuery])
          .then((res) => bubbleChart.render(res));

          const gauge = new KeenDataviz({
            container: '#chart-11',
            type: 'gauge',
            settings: {
              maxValue: 2500,
            },
            widget: {
              title: {
                content: 'Customers engaged',
              },
              subtitle: {
                content: 'Monthly target',
              },
            },
          });

          client
            .query('count', {
              event_collection: 'pageviews',
              timeframe: {
                start: '2014-05-03T00:00:00.000Z',
                end: '2014-05-04T00:00:00.000Z'
              },
            })
            .then(res => {
              gauge.render(res);
            });
});
