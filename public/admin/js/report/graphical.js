app.controller('ctrl', function($scope, $http) {
    $scope.circleName = {};
    let today = new Date();
    let calMonths = [];
    let showMonths = [];
    for(x=9;x>=0;x--){
        let date = new Date(today.getFullYear(), today.getMonth()-x, 1);
        calMonths.push(date.getFullYear()+"-"+(pad(date.getMonth()+1)));
        showMonths.push((getMonthName(date.getMonth()+1))+"-"+date.getFullYear());
    }


    $scope.getReport = function(){
        $http({
            method:'get',
            url:'/getGraphicalReport',
            headers: {
                'authorization': localStorage.token
            }
        }).then(function(response){
            for(x in response.data.data.circle){
                $scope.circleName[response.data.data.circle[x].code] = response.data.data.circle[x].name;
            }

            $scope.clientMontlyReport(response.data.data.clientMontly);
            $scope.circleMontlyReport(response.data.data.circleMontly);
            $scope.departmentMontlyReport(response.data.data.departmentMontly);
            $scope.clientPie(response.data.data.clientPie);
            $scope.circlePie(response.data.data.circlePie);
            $scope.departmentPie(response.data.data.departmentPie);
        });
    }

    $scope.getReport();
    
    /* Client Montly report */
    $scope.clientMontlyReport = function(data){
        
        let point = $scope.getCalculation(data);
        

        Highcharts.chart('clientMontlyReport', {
            chart: {
                type: 'line'
            },
            title: {
                text: 'Client montly report'
            },
            subtitle: {
                text: ''
            },
            xAxis: {
                categories: showMonths
            },
            yAxis: {
                title: {
                    text: 'Count'
                }
            },
            plotOptions: {
                line: {
                    dataLabels: {
                        enabled: true
                    }
                }
            },
            series: point
        });
    }
    /* /Client Montly report */

    /* Circle Montly report */
    $scope.circleMontlyReport = function(data){
        
        let point = $scope.getCalculation(data);
        for(x in point){
            let row = point[x];
            row.name = $scope.circleName[row.name];
        }

        Highcharts.chart('circleMontlyReport', {
            chart: {
                type: 'line'
            },
            title: {
                text: 'Circle montly report'
            },
            subtitle: {
                text: ''
            },
            xAxis: {
                categories: showMonths
            },
            yAxis: {
                title: {
                    text: 'Count'
                }
            },
            plotOptions: {
                line: {
                    dataLabels: {
                        enabled: true
                    }
                }
            },
            series: point
        });
    }
    /* /Circle Montly report */

    /* Department Montly report */
    $scope.departmentMontlyReport = function(data){
        
        let point = $scope.getCalculation(data);

        Highcharts.chart('departmentMontlyReport', {
            chart: {
                type: 'line'
            },
            title: {
                text: 'Department montly report'
            },
            subtitle: {
                text: ''
            },
            xAxis: {
                categories: showMonths
            },
            yAxis: {
                title: {
                    text: 'Count'
                }
            },
            plotOptions: {
                line: {
                    dataLabels: {
                        enabled: true
                    }
                }
            },
            series: point
        });
    }
    /* /Department Montly report */

    /* Client Pie */
    $scope.clientPie = function(data){
        let point = [];
        for(x in data){
            let row = {
                name: data[x]._id,
                y: data[x].count
            };

            if(x == 0){
                row['sliced'] = true;
                row['selected'] = true;
            }
            
            point.push(row);
        }

        Highcharts.chart('clientPie', {
            chart: {
                plotBackgroundColor: null,
                plotBorderWidth: null,
                plotShadow: false,
                type: 'pie'
            },
            title: {
                text: 'Client Pie chart'
            },
            tooltip: {
                pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
            },
            plotOptions: {
                pie: {
                    allowPointSelect: true,
                    cursor: 'pointer',
                    dataLabels: {
                        enabled: true,
                        format: '<b>{point.name}</b>: {point.y}',
                        style: {
                            color: (Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black'
                        }
                    }
                }
            },
            series: [{
                name: 'Count',
                colorByPoint: true,
                data: point
            }]
        });
    }
    /* /Client Pie */

    /* Circle Pie */
    $scope.circlePie = function(data){
        let point = [];
        for(x in data){
            let row = {
                name: $scope.circleName[data[x]._id],
                y: data[x].count
            };

            if(x == 0){
                row['sliced'] = true;
                row['selected'] = true;
            }
            
            point.push(row);
        }

        Highcharts.chart('circlePie', {
            chart: {
                plotBackgroundColor: null,
                plotBorderWidth: null,
                plotShadow: false,
                type: 'pie'
            },
            title: {
                text: 'Circle Pie chart'
            },
            tooltip: {
                pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
            },
            plotOptions: {
                pie: {
                    allowPointSelect: true,
                    cursor: 'pointer',
                    dataLabels: {
                        enabled: true,
                        format: '<b>{point.name}</b>: {point.y}',
                        style: {
                            color: (Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black'
                        }
                    }
                }
            },
            series: [{
                name: 'Count',
                colorByPoint: true,
                data: point
            }]
        });
    }
    /* /Circle Pie */

    /* Department Pie */
    $scope.departmentPie = function(data){
        let point = [];
        for(x in data){
            let row = {
                name: data[x]._id,
                y: data[x].count
            };

            if(x == 0){
                row['sliced'] = true;
                row['selected'] = true;
            }
            
            point.push(row);
        }

        Highcharts.chart('departmentPie', {
            chart: {
                plotBackgroundColor: null,
                plotBorderWidth: null,
                plotShadow: false,
                type: 'pie'
            },
            title: {
                text: 'Department Pie chart'
            },
            tooltip: {
                pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
            },
            plotOptions: {
                pie: {
                    allowPointSelect: true,
                    cursor: 'pointer',
                    dataLabels: {
                        enabled: true,
                        format: '<b>{point.name}</b>: {point.y}',
                        style: {
                            color: (Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black'
                        }
                    }
                }
            },
            series: [{
                name: 'Count',
                colorByPoint: true,
                data: point
            }]
        });
    }
    /* /Department Pie */

    /* Data calculation */
    $scope.getCalculation = function(data){
        let point = {};
        for(x in data){
            let row = data[x];
            if(!point[row._id.name]){
                point[row._id.name] = {};
            }
            point[row._id.name][row._id.monthYear] = row.count;
        }

        let point2 = [];
        for(x in point){
            let row = {};
            row.name = x;
            row.data = [];
            for(monthYear in calMonths){
                if(point[x][calMonths[monthYear]]){
                    row.data.push(point[x][calMonths[monthYear]]);
                }
                else{
                    row.data.push(0);
                }
            }
            
            point2.push(row);
        }
        return point2;
    }
    /* /Data calculation */
});

function pad(number) {
    return (parseInt(number) < 10 ? '0' : '') + number;
}

function getMonthName(number){
    let monthNames = {
        1:'JAN',
        2:'FEN',
        3:'MAR',
        4:'APR',
        5:'MAY',
        6:'JUN',
        7:'JUL',
        8:'AUG',
        9:'SEP',
        10:'OCT',
        11:'NOV',
        12:'DEC',
    };

    return monthNames[number];
}

sideBar('reporting');