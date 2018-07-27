app.controller('ctrl', function($scope, $http) {
    $scope.circleByCode = {};
    $scope.vendors = {};
    // $scope.year = "2018";
    $scope.getReport = function(){
     
        let searchData = {
            'year' : $scope.year, 
            'month' : $scope.month,
            'clientName':$scope.clientId,
            'circleName': $scope.circleCode,
        };
        $http({
            method:'post',
            url:'/getMisKit',
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

            let empNameCount = {};
           // let totalAmountCount = {};
            let kitNameCount = {};
           
            for(x in responseD){
                let row = responseD[x];
                if(!report[row.empName]){
                  report[row.empName] = {};
                }
                if(!report[row.empName][row.kitName]){
                    report[row.empName][row.kitName] = {};
                }
                // if(!report[row.empName][row.vendorName][row.clientName]){
                //     report[row.vendorType][row.vendorName][row.clientName] = {};
                // }
                // if(!report[row.vendorType][row.vendorName][row.clientName][row.circleName]){
                //     report[row.vendorType][row.vendorName][row.clientName][row.circleName] = {};
                // }

                report[row.empName][row.kitName] [row.perDayAmount] = row;
                
                if(!empNameCount[row.empName]){
                    empNameCount[row.empName] = 0;
                }
                empNameCount[row.empName] += 1;

                if(!kitNameCount[row.empName+row.kitName]){
                    kitNameCount[row.empName+row.kitName] = 0;
                }
                kitNameCount[row.empName+row.kitName] += 1;

                // if(!clientNameCount[row.vendorType+row.vendorName+row.clientName]){
                //     clientNameCount[row.vendorType+row.vendorName+row.clientName] = 0;
                // }
                // clientNameCount[row.vendorType+row.vendorName+row.clientName] += 1;
                
                // if(!circleNameCount[row.vendorType+row.vendorName+row.clientName+row.circleName]){
                //     circleNameCount[row.vendorType+row.vendorName+row.clientName+row.circleName] = 0;
                // }
                // circleNameCount[row.vendorType+row.vendorName+row.clientName+row.circleName] += 1;

                $scope.totalAmount+=row.perDayAmount;

            }

            $scope.report = [];
            for(x in report){
                
                let showEmpName = true;
                for(y in report[x]){
                    let showKitName = true;
                    for(z in report[x][y]){
                      //  let showClientName = true;
                        
                        //for(a in report[x][y][z]){
                         //   let showCircleName = true;
                            
                            //for(k in report[x][y][z][a]){
                                
                                let row = report[x];
                                row.showEmpName = showEmpName;
                                row.empNameCount = empNameCount[x];
                                row.showKitName = showKitName;
                                row.kitNameCount = kitNameCount[x+y];
                                // row.showClientName = showClientName;
                                // row.clientNameCount = clientNameCount[x+y+z];
                                // row.showCircleName = showCircleName;
                                // row.circleNameCount = circleNameCount[x+y+z+a];
                               showEmpName = false;
                                showKitName = false;
                               // showClientName = false;
                               // showCircleName = false;
                               $scope.report.push(row);
                                
                           // }
                        //}
                    }
                }
            }

           //console.log($scope.report);
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
        $scope.clientId = '';
        $scope.circleCode = '';
       $scope.activityId ='';
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
