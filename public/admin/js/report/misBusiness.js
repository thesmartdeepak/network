app.controller('ctrl', function($scope, $http) {
    $scope.circleByCode = {};
    
    $scope.getReport = function(){
        var toDate = new Date();
        if($scope.toDate){
            toDate = new Date($scope.toDate);
            toDate.setDate(toDate.getDate() + 1);
        }
        
        var fromDate = new Date(1970,10,30);
        if($scope.fromDate){
            fromDate = new Date($scope.fromDate);
        }

        let searchData = {
            'fromDate': fromDate,
            'toDate': toDate,
            'clientId':$scope.clientId,
            'circleCode':$scope.circleCode,
            'operatorId':$scope.operatorId,
            'activityId':$scope.activityId,
        };
        $http({
            method:'post',
            url:'/getMisBusiness',
            data:searchData,
            headers: {
                'authorization': localStorage.token
            }
        }).then(function(response){
            $scope.totalCount = 0;
            $scope.totalAcceptance = 0;
            $scope.totalPoAmount = 0;
            $scope.totalDoneNotAccepted = 0;
            $scope.totalSite = 0;
            $scope.report = [];
            let responseD = response.data.data;

            let report = {};
            
            let circleCount = {};
            let clientCount = {};
            let operatorCount = {};
            
            for(x in responseD.circleClientSite){
                let row = responseD.circleClientSite[x];
                row.amount = 0;
                row.acceptance = 0;
                row.notAcceptedDone = 0;
                row.totalSite = 0;

                if(!report[row._id.circle]){
                    report[row._id.circle] = {};
                    circleCount[row._id.circle] = 0;
                }
                if(!report[row._id.circle][row._id.client]){
                    report[row._id.circle][row._id.client] = {};
                    clientCount[row._id.circle+row._id.client] = 0;
                }
                if(!report[row._id.circle][row._id.client][row._id.operator]){
                    report[row._id.circle][row._id.client][row._id.operator] = {};
                    operatorCount[row._id.circle+row._id.client+row._id.operator] = 0;
                }

                report[row._id.circle][row._id.client][row._id.operator][row._id.activity] = row;
                

                circleCount[row._id.circle] += 1;
                clientCount[row._id.circle+row._id.client] += 1;
                operatorCount[row._id.circle+row._id.client+row._id.operator] += 1;
            }
            
            
            for(x in responseD.busniess){
                let row = responseD.busniess[x];
                let current_row = report[row.circle][row.client][row.operator][row.activity];
                
                if(current_row){
                    
                    row.count = current_row.count;
                    row._id = {};
                    row._id.client = row.client;
                    row._id.circle = row.circle;
                    row_amount = row.amount;
                    
                    var preDoneDate = new Date(row.preDoneDate);

                    var post_ActivityDoneDate = new Date(row.post_ActivityDoneDate);

                    var acceptance = current_row.acceptance;

                    var notAcceptedDone = current_row.notAcceptedDone;

                    var amount = current_row.amount;

                    var current_amount = 0;

                    if( preDoneDate > fromDate &&  preDoneDate < toDate ){
                        current_amount += row_amount*row.percentage/100;
                    }

                    if( post_ActivityDoneDate > fromDate &&  post_ActivityDoneDate < toDate ){
                        
                        if(row.reportAcceptanceStatus != "Accepted"){
                            $scope.totalDoneNotAccepted += 1;
                            notAcceptedDone += 1;
                        }
                        else{
                            acceptance++;
                            $scope.totalAcceptance += 1;
                            $scope.totalCount++;
                        }

                        current_amount += (row_amount - (row_amount*row.percentage/100));
                    }

                    
                    if(current_amount){
                        amount+=current_amount;
                        $scope.totalPoAmount+=current_amount;
                    }
                    
                    report[row.circle][row.client][row.operator][row.activity].acceptance = acceptance;
                    report[row.circle][row.client][row.operator][row.activity].notAcceptedDone = notAcceptedDone;
                    report[row.circle][row.client][row.operator][row.activity].amount = amount;
                    report[row.circle][row.client][row.operator][row.activity].totalSite += 1;
                    
                    $scope.totalSite += 1;
                }
                else{
                    row.count = 0;
                }
                
            }
            
            $scope.report = [];
            for(x in report){
                
                let showCircle = true;
                for(y in report[x]){
                    
                    let showClient = true;
                    for(z in report[x][y]){
                        let showOperator = true;
                        
                        for(k in report[x][y][z]){
                            let row = report[x][y][z][k];
                            row.showCircle = showCircle;
                            row.circleCount = circleCount[x];
                            row.showClient = showClient;
                            row.clientCount = clientCount[x+y];
                            row.showOperator = showOperator;
                            row.operatorCount = operatorCount[x+y+z];
                            showCircle = false;
                            showClient = false;
                            showOperator = false;
                            $scope.report.push(row);
                            
                        }
                    }
                }
            }
            

        });
    }

    $scope.getAllCircleForReporting = function(){
        $http({
            method:'get',
            url:'/getAllCircleForReporting',
            headers: {
                'authorization': localStorage.token
            }
        }).then(function(response){
            let responseD = response.data.data;
            
            for(x in responseD){
                $scope.circleByCode[responseD[x].code] = responseD[x];
            }

        });
    }

    $scope.getAllClinetForReporting = function(){
        $http({
            method:'get',
            url:'/getAllClinetForReporting',
            headers: {
                'authorization': localStorage.token
            } 
        }).then(function(response){
            $scope.clients = response.data.data;
        });
    }


    $scope.getAllCircleForReporting();
    $scope.getAllClinetForReporting();
    $scope.getReport();

    $scope.circleCountFromClient = function(list,type){
        let total = 0;
        for(x in list){
            total += list[x][type];
        }

        return total;
    }

    $scope.objectCount = function(list){
        let count = 0;
        for(tt in list){
            count++;
        }
        return count;
    }

    $scope.clearFilter = function(){
        $scope.fromDate = '';
        $scope.toDate = '';
        $scope.clientId = '';
        $scope.circleCode = "";
        $scope.operatorId = '';
        $scope.activityId = '';
        $scope.getReport();
    }
    $scope.getAllOperator = function(){
        $http({
            method:'get',
            url:'/alloperator',
            headers: {
                'authorization': localStorage.token
            },
        }).then(function(response){
             $scope.operators = response.data.data;
        });
    }
    
    $scope.getAllOperator();

    $scope.getActivity = function(){
        $http({
            method:'get',
            url:'/allActivity',
            headers:{
                'authorization':localStorage.token,
            },
        }).then(function(response){
        $scope.activityList = response.data.data;
        });
    }
    $scope.getActivity();
});


sideBar('reporting');
sideBar('mis');

$('#fromDate').datepicker({
    autoclose: true,
    maxDate: "+0D"
});

$('#toDate').datepicker({
    autoclose: true,
    maxDate: "+0D"
});
