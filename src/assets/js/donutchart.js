       
          
          // donut chart
          Highcharts.chart('donutchart-1', {
            chart: {
                plotBackgroundColor: null,
                plotBorderWidth: 0,
                plotShadow: false,
                events: {
                    load: function(event) {
                    var chart = this,
                        points = chart.series[0].points,
                        len = points.length,
                        total = 0,
                        i = 0;

                    for (; i < len; i++) {
                        total += points[i].y;
                    }

                    chart.setTitle({
                        text: total,
                        align: 'center',
                        verticalAlign: 'middle',
                        y: 10,
                        style: {
                        fontWeight: 'bold',
                        color: '#457b9d',
                        },
                    });
                    }
                }
            },
           
            title: {
        
                style: {
                    fontSize: '12px',
                    fontWeight: 'bold',
                },
                // y: 40
            },
            subtitle: {
                text: 'Requisition',
                align: 'center',
                verticalAlign: 'bottom',
        
                style: {
                    fontSize: '12px',
                    fontWeight: 'bold',
                    
                },
            },
            legend: {
                enabled: false,
            },
            exporting: { enabled: false },
            credits: {
                enabled: false
            },
            tooltip: {
                formatter: function() {
                    return '<b>' + this.point.name + '</b> :' + this.y;
                }
            },
            accessibility: {
                point: {
                    valueSuffix: '1500'
                }
            },
            plotOptions: {
                pie: {
                    dataLabels: {
                        enabled: false,
                        connectorWidth: 0,
                    },
                    startAngle: -90,
                    endAngle: 360,
                    center: ['45%', '80%'],
                    size: '110%',
                    borderWidth: 0,
                }
            },
           
            series: [{
                type: 'pie',
                name: 'Requisition',
                innerSize: '80%',
                data: [{
                name: 'Materials',
                y: 700,
                value: 700,
                color: '#1d3557',
            }, {
                name: 'Services',
                y: 800,
                value: 800,
                color:'#a8dadc'
            },{
                name: 'Others',
                y: 124,
                value: 124,
                color:'#e63946'
            }
        ],
        }],
        });

     // donut chart
     Highcharts.chart('donutchart-2', {
            chart: {
                plotBackgroundColor: null,
                plotBorderWidth: 0,
                plotShadow: false,
                events: {
                    load: function(event) {
                    var chart = this,
                        points = chart.series[0].points,
                        len = points.length,
                        total = 0,
                        i = 0;

                    for (; i < len; i++) {
                        total += points[i].y;
                    }

                    chart.setTitle({
                        text: total,
                        align: 'center',
                        verticalAlign: 'middle',
                        y: 10,
                        style: {
                        fontWeight: 'bold',
                        color: '#457b9d',
                        },
                    });
                    }
                }
            },
           
            title: {
                text: 'Analysing',
                style: {
                    fontSize: '12px',
                    fontWeight: 'bold',
                },
                // y: 40
            },
            subtitle: {
                text: 'Analysing',
                align: 'center',
                verticalAlign: 'bottom',
        
                style: {
                    fontSize: '12px',
                    fontWeight: 'bold',
                  
                },
            },
            legend: {
                enabled: false,
            },
            exporting: { enabled: false },
            credits: {
                enabled: false
            },
            tooltip: {
                pointFormat: '   <b>{point.value}',
            },
            accessibility: {
                point: {
                    valueSuffix: '1500'
                }
            },
            plotOptions: {
                pie: {
                    dataLabels: {
                        enabled: false,
                        connectorWidth: 0,
                    },
                    startAngle: -90,
                    endAngle: 360,
                    center: ['45%', '80%'],
                    size: '110%',
                    borderWidth: 0,
                }
            },
           
            series: [{
                type: 'pie',
                name: 'Requisition',
                innerSize: '80%',
                data: [{
                name: 'Materials',
                y: 300,
                value: 300,
                color: '#1d3557',
            }, {
                name: 'Services',
                y: 132,
                value: 132,
                color:'#a8dadc'
            },{
                name: 'Others',
                y: 150,
                value: 150,
                color:'#e63946'
            }],
        }],
        });

         // donut chart
      Highcharts.chart('donutchart-3', {
            chart: {
                plotBackgroundColor: null,
                plotBorderWidth: 0,
                plotShadow: false,
                events: {
                    load: function(event) {
                    var chart = this,
                        points = chart.series[0].points,
                        len = points.length,
                        total = 0,
                        i = 0;

                    for (; i < len; i++) {
                        total += points[i].y;
                    }

                    chart.setTitle({
                        text: total,
                        align: 'center',
                        verticalAlign: 'middle',
                        y: 10,
                        style: {
                        fontWeight: 'bold',
                        color: '#457b9d',
                        },
                    });
                    }
                }
            },
           
            title: {
                text: 'RFQ',
                // align: 'center',
                // verticalAlign: 'bottom',
                style: {
                    fontSize: '12px',
                    fontWeight: 'bold',
                },
                // y: 40
            },
            subtitle: {
                text: 'RFQ',
                align: 'center',
                verticalAlign: 'bottom',
        
                style: {
                    fontSize: '12px',
                    fontWeight: 'bold',
                   
                },
            },
            legend: {
                enabled: false,
            },
            exporting: { enabled: false },
            credits: {
                enabled: false
            },
            tooltip: {
                pointFormat: '   <b>{point.value}',
            },
            accessibility: {
                point: {
                    valueSuffix: '1500'
                }
            },
            plotOptions: {
                pie: {
                    dataLabels: {
                        enabled: false,
                        connectorWidth: 0,
                    },
                    startAngle: -90,
                    endAngle: 360,
                    center: ['45%', '80%'],
                    size: '110%',
                    borderWidth: 0,
                }
            },
           
            series: [{
                type: 'pie',
                name: 'Requisition',
                innerSize: '80%',
                data: [{
                name: 'Materials',
                y: 546,
                value: 546,
                color: '#1d3557',
            }, {
                name: 'Services',
                y: 100,
                value: 100,
                color:'#a8dadc'
            },{
                name: 'Others',
                y: 400,
                value: 400,
                color:'#e63946'
            }],
        }],
        });


         // donut chart
      Highcharts.chart('donutchart-4', {
            chart: {
                plotBackgroundColor: null,
                plotBorderWidth: 0,
                plotShadow: false,
                events: {
                    load: function(event) {
                    var chart = this,
                        points = chart.series[0].points,
                        len = points.length,
                        total = 0,
                        i = 0;

                    for (; i < len; i++) {
                        total += points[i].y;
                    }

                    chart.setTitle({
                        text: total,
                        align: 'center',
                        verticalAlign: 'middle',
                        y: 10,
                        style: {
                        fontWeight: 'bold',
                        color: '#457b9d',
                        },
                    });
                    }
                }
            },
           
            title: {
                text: 'Identification',
                // align: 'center',
                // verticalAlign: 'bottom',
                style: {
                    fontSize: '12px',
                    fontWeight: 'bold',
                },
                // y: 40
            },
            subtitle: {
                text: 'Identification',
                align: 'center',
                verticalAlign: 'bottom',
                color: '#457b9d',
        
                style: {
                    fontSize: '12px',
                    fontWeight: 'bold',
                 
                },
            },
            legend: {
                enabled: false,
            },
            exporting: { enabled: false },
            credits: {
                enabled: false
            },
            tooltip: {
                pointFormat: '   <b>{point.value}',
            },
            accessibility: {
                point: {
                    valueSuffix: '1500'
                }
            },
            plotOptions: {
                pie: {
                    dataLabels: {
                        enabled: false,
                        connectorWidth: 0,
                    },
                    startAngle: -90,
                    endAngle: 360,
                    center: ['45%', '80%'],
                    size: '110%',
                    borderWidth: 0,
                }
            },
           
            series: [{
                type: 'pie',
                name: 'Requisition',
                innerSize: '80%',
                data: [{
                name: 'Materials',
                y: 1200,
                value: 1200,
                color: '#1d3557',
            }, {
                name: 'Services',
                y: 300,
                value: 300,
                color:'#a8dadc',
            },{
                name: 'Others',
                y: 124,
                value: 124,
                color:'#e63946'
            }],
        }],
        });

         // donut chart
      Highcharts.chart('donutchart-5', {
            chart: {
                plotBackgroundColor: null,
                plotBorderWidth: 0,
                plotShadow: false,
                events: {
                    load: function(event) {
                    var chart = this,
                        points = chart.series[0].points,
                        len = points.length,
                        total = 0,
                        i = 0;

                    for (; i < len; i++) {
                        total += points[i].y;
                    }

                    chart.setTitle({
                        text: total,
                        align: 'center',
                        verticalAlign: 'middle',
                        y: 10,
                        style: {
                        fontWeight: 'bold',
                        color: '#457b9d',
                        },
                    });
                    }
                }
            },
           
            title: {
                text: 'Submission',
                // align: 'center',
                // verticalAlign: 'bottom',
                style: {
                    fontSize: '12px',
                    fontWeight: 'bold',
                },
                // y: 40
            },
            subtitle: {
                text: 'Submission',
                align: 'center',
                verticalAlign: 'bottom',
                color: '#457b9d',
        
                style: {
                    fontSize: '12px',
                    fontWeight: 'bold',
                   
                },
            },
            legend: {
                enabled: false,
            },
            exporting: { enabled: false },
            credits: {
                enabled: false
            },
            tooltip: {
                pointFormat: '   <b>{point.value}',
            },
            accessibility: {
                point: {
                    valueSuffix: '1500'
                }
            },
            plotOptions: {
                pie: {
                    dataLabels: {
                        enabled: false,
                        connectorWidth: 0,
                    },
                    startAngle: -90,
                    endAngle: 360,
                    center: ['45%', '80%'],
                    size: '110%',
                    borderWidth: 0,
                }
            },
           
            series: [{
                type: 'pie',
                name: 'Requisition',
                innerSize: '80%',
                data: [{
                name: 'Materials',
                y: 134,
                value: 134,
                color: '#1d3557',
            }, {
                name: 'Services',
                y: 100,
                value: 100,
                color:'#a8dadc'
            },{
                name: 'Others',
                y: 220,
                value: 220,
                color:'#e63946'
            }],
        }],
        });

         // donut chart
      Highcharts.chart('donutchart-6', {
            chart: {
                plotBackgroundColor: null,
                plotBorderWidth: 0,
                plotShadow: false,
                events: {
                    load: function(event) {
                    var chart = this,
                        points = chart.series[0].points,
                        len = points.length,
                        total = 0,
                        i = 0;

                    for (; i < len; i++) {
                        total += points[i].y;
                    }

                    chart.setTitle({
                        text: total,
                        align: 'center',
                        verticalAlign: 'middle',
                        y: 10,
                        style: {
                        fontWeight: 'bold',
                        color: '#457b9d',
                        },
                    });
                    }
                }
            },
           
            title: {
                text: 'Invoicing',
                // align: 'center',
                // verticalAlign: 'bottom',
                style: {
                    fontSize: '12px',
                    fontWeight: 'bold',
                },
                // y: 40
            },
            subtitle: {
                text: 'Invoicing',
                align: 'center',
                verticalAlign: 'bottom',
                color: '#457b9d',
        
                style: {
                    fontSize: '12px',
                    fontWeight: 'bold',
                   
                },
            },
            legend: {
                enabled: false,
            },
            exporting: { enabled: false },
            credits: {
                enabled: false
            },
            tooltip: {
                pointFormat: '   <b>{point.value}',
            },
            accessibility: {
                point: {
                    valueSuffix: '1500'
                }
            },
            plotOptions: {
                pie: {
                    dataLabels: {
                        enabled: false,
                        connectorWidth: 0,
                    },
                    startAngle: -90,
                    endAngle: 360,
                    center: ['45%', '80%'],
                    size: '110%',
                    borderWidth: 0,
                }
            },
           
            series: [{
                type: 'pie',
                name: 'Requisition',
                innerSize: '80%',
                data: [{
                name: 'Materials',
                y: 200,
                value: 200,
                color: '#1d3557',
            }, {
                name: 'Services',
                y: 232,
                value: 232,
                color:'#a8dadc'
            },{
                name: 'Others',
                y: 124,
                value: 124,
                color:'#e63946'
            }],
        }],
        });

         // donut chart
      Highcharts.chart('donutchart-7', {
            chart: {
                plotBackgroundColor: null,
                plotBorderWidth: 0,
                plotShadow: false,
                events: {
                    load: function(event) {
                    var chart = this,
                        points = chart.series[0].points,
                        len = points.length,
                        total = 0,
                        i = 0;

                    for (; i < len; i++) {
                        total += points[i].y;
                    }

                    chart.setTitle({
                        text: total,
                        align: 'center',
                        verticalAlign: 'middle',
                        y: 10,
                        style: {
                        fontWeight: 'bold',
                        color: '#457b9d',
                        },
                    });
                    }
                }
            },
           
            title: {
                text: 'Shipment',
                // align: 'center',
                // verticalAlign: 'bottom',
                style: {
                    fontSize: '12px',
                    fontWeight: 'bold',
                },
                // y: 40
            },
            subtitle: {
                text: 'Shipment',
                align: 'center',
                verticalAlign: 'bottom',
              
        
                style: {
                    fontSize: '12px',
                    fontWeight: 'bold',
                    
                },
            },
            legend: {
                enabled: false,
            },
            exporting: { enabled: false },
            credits: {
                enabled: false
            },
            tooltip: {
                pointFormat: '   <b>{point.value}',
            },
            accessibility: {
                point: {
                    valueSuffix: '1500'
                }
            },
            plotOptions: {
                pie: {
                    dataLabels: {
                        enabled: false,
                        connectorWidth: 0,
                    },
                    startAngle: -90,
                    endAngle: 360,
                    center: ['45%', '80%'],
                    size: '110%',
                    borderWidth: 0,
                }
            },
           
            series: [{
                type: 'pie',
                name: 'Requisition',
                innerSize: '80%',
                data: [{
                name: 'Materials',
                y: 100,
                value: 100,
                color: '#1d3557',
            }, {
                name: 'Services',
                y: 332,
                value: 332,
                color:'#a8dadc'
            },{
                name: 'Others',
                y: 88,
                value: 88,
                color:'#e63946'
            }],
        }],
        });

         // donut chart
      Highcharts.chart('donutchart-8', {
            chart: {
                plotBackgroundColor: null,
                plotBorderWidth: 0,
                plotShadow: false,
                events: {
                    load: function(event) {
                    var chart = this,
                        points = chart.series[0].points,
                        len = points.length,
                        total = 0,
                        i = 0;

                    for (; i < len; i++) {
                        total += points[i].y;
                    }

                    chart.setTitle({
                        text: total,
                        align: 'center',
                        verticalAlign: 'middle',
                        y: 10,
                        style: {
                        fontWeight: 'bold',
                        color: '#457b9d',
                        },
                    });
                    }
                }
            },
           
            title: {
                text: 'Warehouse',
                // align: 'center',
                // verticalAlign: 'bottom',
                style: {
                    fontSize: '12px',
                    fontWeight: 'bold',
                },
                // y: 40
            },
            subtitle: {
                text: 'Warehouse',
                align: 'center',
                verticalAlign: 'bottom',
               
        
                style: {
                    fontSize: '12px',
                    fontWeight: 'bold',
                   
                },
            },
            legend: {
                enabled: false,
            },
            exporting: { enabled: false },
            credits: {
                enabled: false
            },
            tooltip: {
                pointFormat: '   <b>{point.value}',
            },
            accessibility: {
                point: {
                    valueSuffix: '1500'
                }
            },
            plotOptions: {
                pie: {
                    dataLabels: {
                        enabled: false,
                        connectorWidth: 0,
                    },
                    startAngle: -90,
                    endAngle: 360,
                    center: ['45%', '80%'],
                    size: '110%',
                    borderWidth: 0,
                }
            },
           
            series: [{
                type: 'pie',
                name: 'Requisition',
                innerSize: '80%',
                data: [{
                name: 'Materials',
                y: 340,
                value: 340,
                color: '#1d3557',
            }, {
                name: 'Services',
                y: 306,
                value: 306,
                color:'#a8dadc'
            },{
                name: 'Others',
                y: 407,
                value: 407,
                color:'#e63946'
            }],
        }],
        });

         // donut chart
      Highcharts.chart('donutchart-9', {
            chart: {
                plotBackgroundColor: null,
                plotBorderWidth: 0,
                plotShadow: false,
                events: {
                    load: function(event) {
                    var chart = this,
                        points = chart.series[0].points,
                        len = points.length,
                        total = 0,
                        i = 0;

                    for (; i < len; i++) {
                        total += points[i].y;
                    }

                    chart.setTitle({
                        text: total,
                        align: 'center',
                        verticalAlign: 'middle',
                        y: 10,
                        style: {
                        fontWeight: 'bold',
                        color: '#457b9d',
                        },
                    });
                    }
                }
            },
           
            title: {
                text: 'Others',
                // align: 'center',
                // verticalAlign: 'bottom',
                style: {
                    fontSize: '12px',
                    fontWeight: 'bold',
                },
                // y: 40
            },
            subtitle: {
                text: 'Others',
                align: 'center',
                verticalAlign: 'bottom',
               
        
                style: {
                    fontSize: '12px',
                    fontWeight: 'bold',
                   
                },
            },
            legend: {
                enabled: false,
            },
            exporting: { enabled: false },
            credits: {
                enabled: false
            },
            tooltip: {
                pointFormat: '   <b>{point.value}',
            },
            accessibility: {
                point: {
                    valueSuffix: '1500'
                }
            },
            plotOptions: {
                pie: {
                    dataLabels: {
                        enabled: false,
                        connectorWidth: 0,
                    },
                    startAngle: -90,
                    endAngle: 360,
                    center: ['45%', '80%'],
                    size: '110%',
                    borderWidth: 0,
                }
            },
           
            series: [{
                type: 'pie',
                name: 'Requisition',
                innerSize: '80%',
                data: [{
                name: 'Materials',
                y: 500,
                value: 500,
                color: '#1d3557',
            }, {
                name: 'Services',
                y: 142,
                value: 142,
                color:'#a8dadc'
            },{
                name: 'Others',
                y: 124,
                value: 124,
                color:'#e63946'
            }],
        }],
        });

        
        // donutchart one procurement

               
          
          // donut chart
          Highcharts.chart('donutchart-11', {
            chart: {
                plotBackgroundColor: null,
                plotBorderWidth: 0,
                plotShadow: false,
                events: {
                    load: function(event) {
                    var chart = this,
                        points = chart.series[0].points,
                        len = points.length,
                        total = 0,
                        i = 0;

                    for (; i < len; i++) {
                        total += points[i].y;
                    }

                    chart.setTitle({
                        text: total,
                        align: 'center',
                        verticalAlign: 'middle',
                        y: 10,
                        style: {
                        fontWeight: 'bold',
                        color: '#457b9d',
                        },
                    });
                    }
                }
            },
           
            title: {
        
                style: {
                    fontSize: '12px',
                    fontWeight: 'bold',
                },
                // y: 40
            },
            subtitle: {
                text: 'Requisition',
                align: 'center',
                verticalAlign: 'bottom',
              
        
                style: {
                    fontSize: '12px',
                    fontWeight: 'bold',
                    
                },
            },
            legend: {
                enabled: false,
            },
            exporting: { enabled: false },
            credits: {
                enabled: false
            },
            tooltip: {
                formatter: function() {
                    return '<b>' + this.point.name + '</b> :' + this.y;
                }
            },
            accessibility: {
                point: {
                    valueSuffix: '1500'
                }
            },
            plotOptions: {
                pie: {
                    dataLabels: {
                        enabled: false,
                        connectorWidth: 0,
                    },
                    startAngle: -90,
                    endAngle: 360,
                    center: ['45%', '80%'],
                    size: '110%',
                    borderWidth: 0,
                }
            },
           
            series: [{
                type: 'pie',
                name: 'Requisition',
                innerSize: '80%',
                data: [{
                name: 'Materials',
                y: 700,
                value: 700,
                color: '#1d3557',
            }, {
                name: 'Services',
                y: 300,
                value: 300,
                color:'#a8dadc'
            },{
                name: 'Others',
                y: 124,
                value: 124,
                color:'#e63946'
            }],
        }],
        });

     // donut chart
     Highcharts.chart('donutchart-21', {
            chart: {
                plotBackgroundColor: null,
                plotBorderWidth: 0,
                plotShadow: false,
                events: {
                    load: function(event) {
                    var chart = this,
                        points = chart.series[0].points,
                        len = points.length,
                        total = 0,
                        i = 0;

                    for (; i < len; i++) {
                        total += points[i].y;
                    }

                    chart.setTitle({
                        text: total,
                        align: 'center',
                        verticalAlign: 'middle',
                        y: 10,
                        style: {
                        fontWeight: 'bold',
                        color: '#457b9d',
                        },
                    });
                    }
                }
            },
           
            title: {
                text: 'Analysing',
                style: {
                    fontSize: '12px',
                    fontWeight: 'bold',
                },
                // y: 40
            },
            subtitle: {
                text: 'Analysing',
                align: 'center',
                verticalAlign: 'bottom',
                
        
                style: {
                    fontSize: '12px',
                    fontWeight: 'bold',
                   
                },
            },
            legend: {
                enabled: false,
            },
            exporting: { enabled: false },
            credits: {
                enabled: false
            },
            tooltip: {
                pointFormat: '   <b>{point.value}',
            },
            accessibility: {
                point: {
                    valueSuffix: '1500'
                }
            },
            plotOptions: {
                pie: {
                    dataLabels: {
                        enabled: false,
                        connectorWidth: 0,
                    },
                    startAngle: -90,
                    endAngle: 360,
                    center: ['45%', '80%'],
                    size: '110%',
                    borderWidth: 0,
                }
            },
           
            series: [{
                type: 'pie',
                name: 'Requisition',
                innerSize: '80%',
                data: [{
                name: 'Materials',
                y: 132,
                value: 132,
                color: '#1d3557',
            }, {
                name: 'Services',
                y: 300,
                value: 300,
                color:'#a8dadc'
            },{
                name: 'Others',
                y: 80,
                value: 80,
                color:'#e63946'
            }],
        }],
        });

         // donut chart
      Highcharts.chart('donutchart-31', {
            chart: {
                plotBackgroundColor: null,
                plotBorderWidth: 0,
                plotShadow: false,
                events: {
                    load: function(event) {
                    var chart = this,
                        points = chart.series[0].points,
                        len = points.length,
                        total = 0,
                        i = 0;

                    for (; i < len; i++) {
                        total += points[i].y;
                    }

                    chart.setTitle({
                        text: total,
                        align: 'center',
                        verticalAlign: 'middle',
                        y: 10,
                        style: {
                        fontWeight: 'bold',
                        color: '#457b9d',
                        },
                    });
                    }
                }
            },
           
            title: {
                text: 'RFQ',
                // align: 'center',
                // verticalAlign: 'bottom',
                style: {
                    fontSize: '12px',
                    fontWeight: 'bold',
                },
                // y: 40
            },
            subtitle: {
                text: 'RFQ',
                align: 'center',
                verticalAlign: 'bottom',
               
        
                style: {
                    fontSize: '12px',
                    fontWeight: 'bold',
                   
                },
            },
            legend: {
                enabled: false,
            },
            exporting: { enabled: false },
            credits: {
                enabled: false
            },
            tooltip: {
                pointFormat: '   <b>{point.value}',
            },
            accessibility: {
                point: {
                    valueSuffix: '1500'
                }
            },
            plotOptions: {
                pie: {
                    dataLabels: {
                        enabled: false,
                        connectorWidth: 0,
                    },
                    startAngle: -90,
                    endAngle: 360,
                    center: ['45%', '80%'],
                    size: '110%',
                    borderWidth: 0,
                }
            },
           
            series: [{
                type: 'pie',
                name: 'Requisition',
                innerSize: '80%',
                data: [{
                name: 'Materials',
                y: 100,
                value: 100,
                color: '#1d3557',
            }, {
                name: 'Services',
                y: 546,
                value: 546,
                color:'#a8dadc'
            },{
                name: 'Others',
                y: 200,
                value: 200,
                color:'#e63946'
            }],
        }],
        });


         // donut chart
      Highcharts.chart('donutchart-41', {
            chart: {
                plotBackgroundColor: null,
                plotBorderWidth: 0,
                plotShadow: false,
                events: {
                    load: function(event) {
                    var chart = this,
                        points = chart.series[0].points,
                        len = points.length,
                        total = 0,
                        i = 0;

                    for (; i < len; i++) {
                        total += points[i].y;
                    }

                    chart.setTitle({
                        text: total,
                        align: 'center',
                        verticalAlign: 'middle',
                        y: 10,
                        style: {
                        fontWeight: 'bold',
                        color: '#457b9d',
                        },
                    });
                    }
                }
            },
           
            title: {
                text: 'Identification',
                // align: 'center',
                // verticalAlign: 'bottom',
                style: {
                    fontSize: '12px',
                    fontWeight: 'bold',
                },
                // y: 40
            },
            subtitle: {
                text: 'Identification',
                align: 'center',
                verticalAlign: 'bottom',
              
        
                style: {
                    fontSize: '12px',
                    fontWeight: 'bold',
                   
                },
            },
            legend: {
                enabled: false,
            },
            exporting: { enabled: false },
            credits: {
                enabled: false
            },
            tooltip: {
                pointFormat: '   <b>{point.value}',
            },
            accessibility: {
                point: {
                    valueSuffix: '1500'
                }
            },
            plotOptions: {
                pie: {
                    dataLabels: {
                        enabled: false,
                        connectorWidth: 0,
                    },
                    startAngle: -90,
                    endAngle: 360,
                    center: ['45%', '80%'],
                    size: '110%',
                    borderWidth: 0,
                }
            },
           
            series: [{
                type: 'pie',
                name: 'Requisition',
                innerSize: '80%',
                data: [{
                name: 'Materials',
                y: 100,
                value: 100,
                color: '#1d3557',
            }, {
                name: 'Services',
                y: 1200,
                value: 1200,
                color:'#a8dadc',
            },{
                name: 'Others',
                y: 300,
                value: 300,
                color:'#e63946'
            }],
        }],
        });

         // donut chart
      Highcharts.chart('donutchart-51', {
            chart: {
                plotBackgroundColor: null,
                plotBorderWidth: 0,
                plotShadow: false,
                events: {
                    load: function(event) {
                    var chart = this,
                        points = chart.series[0].points,
                        len = points.length,
                        total = 0,
                        i = 0;

                    for (; i < len; i++) {
                        total += points[i].y;
                    }

                    chart.setTitle({
                        text: total,
                        align: 'center',
                        verticalAlign: 'middle',
                        y: 10,
                        style: {
                        fontWeight: 'bold',
                        color: '#457b9d',
                        },
                    });
                    }
                }
            },
           
            title: {
                text: 'Submission',
                // align: 'center',
                // verticalAlign: 'bottom',
                style: {
                    fontSize: '12px',
                    fontWeight: 'bold',
                },
                // y: 40
            },
            subtitle: {
                text: 'Submission',
                align: 'center',
                verticalAlign: 'bottom',
               
        
                style: {
                    fontSize: '12px',
                    fontWeight: 'bold',
                   
                },
            },
            legend: {
                enabled: false,
            },
            exporting: { enabled: false },
            credits: {
                enabled: false
            },
            tooltip: {
                pointFormat: '   <b>{point.value}',
            },
            accessibility: {
                point: {
                    valueSuffix: '1500'
                }
            },
            plotOptions: {
                pie: {
                    dataLabels: {
                        enabled: false,
                        connectorWidth: 0,
                    },
                    startAngle: -90,
                    endAngle: 360,
                    center: ['45%', '80%'],
                    size: '110%',
                    borderWidth: 0,
                }
            },
           
            series: [{
                type: 'pie',
                name: 'Requisition',
                innerSize: '80%',
                data: [{
                name: 'Materials',
                y: 134,
                value: 134,
                color: '#1d3557',
            }, {
                name: 'Services',
                y: 400,
                value: 400,
                color:'#a8dadc'
            },{
                name: 'Others',
                y: 124,
                value: 124,
                color:'#e63946'
            }],
        }],
        });




         // donut chart Budget
         Highcharts.chart('donutchart-20', {
            chart: {
                plotBackgroundColor: null,
                plotBorderWidth: 0,
                plotShadow: false,
                events: {
                    load: function(event) {
                    var chart = this,
                        points = chart.series[0].points,
                        len = points.length,
                        total = 0,
                        i = 0;

                    for (; i < len; i++) {
                        total += points[i].y;
                    }

                    chart.setTitle({
                        text: total,
                        align: 'center',
                        verticalAlign: 'middle',
                        y: 10,
                        style: {
                        fontWeight: 'bold',
                        color: '#457b9d',
                        },
                    });
                    }
                }
            },
           
            title: {
                text: 'Budget1',
                // align: 'center',
                // verticalAlign: 'bottom',
                style: {
                    fontSize: '12px',
                    fontWeight: 'bold',
                },
                // y: 40
            },
            subtitle: {
                text: 'Budget1',
                align: 'center',
                verticalAlign: 'bottom',
               
        
                style: {
                    fontSize: '12px',
                    fontWeight: 'bold',
                   
                },
            },
            legend: {
                enabled: false,
            },
            exporting: { enabled: false },
            credits: {
                enabled: false
            },
            tooltip: {
                pointFormat: '   <b>{point.value}',
            },
            accessibility: {
                point: {
                    valueSuffix: '1500'
                }
            },
            plotOptions: {
                pie: {
                    dataLabels: {
                        enabled: false,
                        connectorWidth: 0,
                    },
                    startAngle: -90,
                    endAngle: 360,
                    center: ['45%', '80%'],
                    size: '110%',
                    borderWidth: 0,
                }
            },
           
            series: [{
                type: 'pie',
                name: 'Requisition',
                innerSize: '80%',
                data: [{
                name: 'Materials',
                y: 630,
                value: 630,
                color: '#1d3557',
            }, {
                name: 'Services',
                y: 105,
                value: 105,
                color:'#a8dadc'
            },{
                name: 'Others',
                y: 150,
                value: 150,
                color:'#e63946'
            }],
        }],
        });
 

         // donut chart
      Highcharts.chart('donutchart-22', {
            chart: {
                plotBackgroundColor: null,
                plotBorderWidth: 0,
                plotShadow: false,
                events: {
                    load: function(event) {
                    var chart = this,
                        points = chart.series[0].points,
                        len = points.length,
                        total = 0,
                        i = 0;

                    for (; i < len; i++) {
                        total += points[i].y;
                    }

                    chart.setTitle({
                        text: total,
                        align: 'center',
                        verticalAlign: 'middle',
                        y: 10,
                        style: {
                        fontWeight: 'bold',
                        color: '#457b9d',
                        },
                    });
                    }
                }
            },
           
            title: {
                text: 'Budget2',
                // align: 'center',
                // verticalAlign: 'bottom',
                style: {
                    fontSize: '12px',
                    fontWeight: 'bold',
                },
                // y: 40
            },
            subtitle: {
                text: 'Budget2',
                align: 'center',
                verticalAlign: 'bottom',
               
        
                style: {
                    fontSize: '12px',
                    fontWeight: 'bold',
                   
                },
            },
            legend: {
                enabled: false,
            },
            exporting: { enabled: false },
            credits: {
                enabled: false
            },
            tooltip: {
                pointFormat: '   <b>{point.value}',
            },
            accessibility: {
                point: {
                    valueSuffix: '1500'
                }
            },
            plotOptions: {
                pie: {
                    dataLabels: {
                        enabled: false,
                        connectorWidth: 0,
                    },
                    startAngle: -90,
                    endAngle: 360,
                    center: ['45%', '80%'],
                    size: '110%',
                    borderWidth: 0,
                }
            },
           
            series: [{
                type: 'pie',
                name: 'Requisition',
                innerSize: '80%',
                data: [{
                name: 'Materials',
                y: 200,
                value: 200,
                color: '#1d3557',
            }, {
                name: 'Services',
                y: 332,
                value: 332,
                color:'#a8dadc'
            },{
                name: 'Others',
                y: 124,
                value: 124,
                color:'#e63946'
            }],
        }],
        });

         // donut chart
      Highcharts.chart('donutchart-23', {
            chart: {
                plotBackgroundColor: null,
                plotBorderWidth: 0,
                plotShadow: false,
                events: {
                    load: function(event) {
                    var chart = this,
                        points = chart.series[0].points,
                        len = points.length,
                        total = 0,
                        i = 0;

                    for (; i < len; i++) {
                        total += points[i].y;
                    }

                    chart.setTitle({
                        text: total,
                        align: 'center',
                        verticalAlign: 'middle',
                        y: 10,
                        style: {
                        fontWeight: 'bold',
                        color: '#457b9d',
                        },
                    });
                    }
                }
            },
           
            title: {
                text: 'Budget3',
                // align: 'center',
                // verticalAlign: 'bottom',
                style: {
                    fontSize: '12px',
                    fontWeight: 'bold',
                },
                // y: 40
            },
            subtitle: {
                text: 'Budget3',
                align: 'center',
                verticalAlign: 'bottom',
               
        
                style: {
                    fontSize: '12px',
                    fontWeight: 'bold',
                   
                },
            },
            legend: {
                enabled: false,
            },
            exporting: { enabled: false },
            credits: {
                enabled: false
            },
            tooltip: {
                pointFormat: '   <b>{point.value}',
            },
            accessibility: {
                point: {
                    valueSuffix: '1500'
                }
            },
            plotOptions: {
                pie: {
                    dataLabels: {
                        enabled: false,
                        connectorWidth: 0,
                    },
                    startAngle: -90,
                    endAngle: 360,
                    center: ['45%', '80%'],
                    size: '110%',
                    borderWidth: 0,
                }
            },
           
            series: [{
                type: 'pie',
                name: 'Requisition',
                innerSize: '80%',
                data: [{
                name: 'Materials',
                y: 306,
                value: 306,
                color: '#1d3557',
            }, {
                name: 'Services',
                y: 140,
                value: 140,
                color:'#a8dadc'
            },{
                name: 'Others',
                y: 320,
                value: 320,
                color:'#e63946'
            }],
        }],
        });

         // donut chart
      Highcharts.chart('donutchart-24', {
            chart: {
                plotBackgroundColor: null,
                plotBorderWidth: 0,
                plotShadow: false,
                events: {
                    load: function(event) {
                    var chart = this,
                        points = chart.series[0].points,
                        len = points.length,
                        total = 0,
                        i = 0;

                    for (; i < len; i++) {
                        total += points[i].y;
                    }

                    chart.setTitle({
                        text: total,
                        align: 'center',
                        verticalAlign: 'middle',
                        y: 10,
                        style: {
                        fontWeight: 'bold',
                        color: '#457b9d',
                        },
                    });
                    }
                }
            },
           
            title: {
                text: 'Budget4',
                // align: 'center',
                // verticalAlign: 'bottom',
                style: {
                    fontSize: '12px',
                    fontWeight: 'bold',
                },
                // y: 40
            },
            subtitle: {
                text: 'Budget4',
                align: 'center',
                verticalAlign: 'bottom',
                
        
                style: {
                    fontSize: '12px',
                    fontWeight: 'bold',
                   
                },
            },
            legend: {
                enabled: false,
            },
            exporting: { enabled: false },
            credits: {
                enabled: false
            },
            tooltip: {
                pointFormat: '   <b>{point.value}',
            },
            accessibility: {
                point: {
                    valueSuffix: '1500'
                }
            },
            plotOptions: {
                pie: {
                    dataLabels: {
                        enabled: false,
                        connectorWidth: 0,
                    },
                    startAngle: -90,
                    endAngle: 360,
                    center: ['45%', '80%'],
                    size: '110%',
                    borderWidth: 0,
                }
            },
           
            series: [{
                type: 'pie',
                name: 'Requisition',
                innerSize: '80%',
                data: [{
                name: 'Materials',
                y: 210,
                value: 210,
                color: '#1d3557',
            }, {
                name: 'Services',
                y: 54,
                value: 54,
                color:'#a8dadc'
            },{
                name: 'Others',
                y: 124,
                value: 124,
                color:'#e63946'
            }],
        }],
        });