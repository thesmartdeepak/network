app.controller('ctrl', function($scope, $http) {
    $scope.circleByCode = {};
    $scope.vendors = {};
    // $scope.year = "2018";
    $scope.getReport1 = function(){
        var a = $('#circle option:selected').text();
        alert(a);
    }

    $scope.getReport = function(){
     
        let searchData = {
            'year' : $scope.year, 
            'month' : $scope.month,
            'clientName':$scope.clientId,
            'circleName': $scope.circleCode,
           'activityName': $scope.activityId,
        };
        $http({
            method:'post',
            url:'/getMisVendor',
            data:searchData,
            headers: {
                'authorization': localStorage.token
            }
        }).then(function(response){
            $scope.totalAmount = 0;

            $scope.report = [];
            let responseD = response.data.data.user;

            let report = {};
            
            let vendorTypeCount = {};
            let vendorNameCount = {};
            let clientNameCount = {};
            let circleNameCount = {};
            
            for(x in responseD){
                let row = responseD[x];
                if(!report[row.vendorType]){
                    report[row.vendorType] = {};
                }
                if(!report[row.vendorType][row.vendorName]){
                    report[row.vendorType][row.vendorName] = {};
                }
                if(!report[row.vendorType][row.vendorName][row.clientName]){
                    report[row.vendorType][row.vendorName][row.clientName] = {};
                }
                if(!report[row.vendorType][row.vendorName][row.clientName][row.circleName]){
                    report[row.vendorType][row.vendorName][row.clientName][row.circleName] = {};
                }

                report[row.vendorType][row.vendorName][row.clientName][row.circleName][row.activityName] = row;

                if(!vendorTypeCount[row.vendorType]){
                    vendorTypeCount[row.vendorType] = 0;
                }
                vendorTypeCount[row.vendorType] += 1;

                if(!vendorNameCount[row.vendorType+row.vendorName]){
                    vendorNameCount[row.vendorType+row.vendorName] = 0;
                }
                vendorNameCount[row.vendorType+row.vendorName] += 1;

                if(!clientNameCount[row.vendorType+row.vendorName+row.clientName]){
                    clientNameCount[row.vendorType+row.vendorName+row.clientName] = 0;
                }
                clientNameCount[row.vendorType+row.vendorName+row.clientName] += 1;
                
                if(!circleNameCount[row.vendorType+row.vendorName+row.clientName+row.circleName]){
                    circleNameCount[row.vendorType+row.vendorName+row.clientName+row.circleName] = 0;
                }
                circleNameCount[row.vendorType+row.vendorName+row.clientName+row.circleName] += 1;

                $scope.totalAmount+=row.totalAmount;

            }

            $scope.report = [];
            for(x in report){
                
                let showVendorType = true;
                for(y in report[x]){
                    
                    let showVendorName = true;
                    for(z in report[x][y]){
                        let showClientName = true;
                        
                        for(a in report[x][y][z]){
                            let showCircleName = true;
                            
                            for(k in report[x][y][z][a]){
                                
                                let row = report[x][y][z][a][k];
                                row.showVendorType = showVendorType;
                                row.vendorTypeCount = vendorTypeCount[x];
                                row.showVendorName = showVendorName;
                                row.vendorNameCount = vendorNameCount[x+y];
                                row.showClientName = showClientName;
                                row.clientNameCount = clientNameCount[x+y+z];
                                row.showCircleName = showCircleName;
                                row.circleNameCount = circleNameCount[x+y+z+a];

                                showVendorType = false;
                                showVendorName = false;
                                showClientName = false;
                                showCircleName = false;
                                $scope.report.push(row);
                                
                            }
                        }
                    }
                }
            }

            console.log($scope.report);
            
        });
    }

    $scope.getReport();

    // $scope.circleCountFromClient = function(list,type){
    //     let total = 0;
    //     for(x in list){
    //         total += list[x][type];
    //     }

    //     return total;
    // }

    // $scope.objectCount = function(list){
    //     let count = 0;
    //     for(x in list){
    //         count++;
    //     }
    //     return count;
    // }

    // $scope.circleName = function(code){
        
    //     return $scope.circleByCode[code].name;
    // }

    $scope.clearFilter = function(){
       $scope.year = '';
        $scope.month = '';
        $scope.getReport();
       // $scope.vendors = [];
        
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

    $scope.getAllCircleForReporting();
    $scope.getAllClinetForReporting();
});


sideBar('reporting');
sideBar('mis');

// $('#fromDate').datepicker({
//     autoclose: true,
//     maxDate: "+0D"
// });

// $('#toDate').datepicker({
//     autoclose: true,
//     maxDate: "+0D"
// });
