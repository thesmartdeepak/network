app.controller('ctrl', function($scope, $http) {
    let currentYear = (new Date()).getFullYear();
    $scope.selectYears = [];
    for (x = currentYear; x >= currentYear - 10; x--) {
        $scope.selectYears.push(x);
    }
    $scope.circleByCode = {};
    $scope.salarys = {};
    $scope.getReport = function(){
      let searchData = {
            'year' : $scope.year, 
            'month' : $scope.month,
            'circleCode': $scope.circleCode,
            //'fromDate': $scope.fromDate,
            //'toDate': $scope.toDate,
            //'client':$scope.client
        };
        $http({
            method:'post',
            url:'/getMisSalary',
            data:searchData,
            headers: {
                'authorization': localStorage.token
            }
        }).then(function(response){
        
            let responseD = response.data.data.user;

            let report = {};
            $scope.circleTotalAmount = {};
            $scope.totalAmount = 0;

            for(x in responseD){
                var row = responseD[x];
                if(!report[row.circleName]){
                    report[row.circleName] = [];
                    $scope.circleTotalAmount[row.circleName] = 0;
                }

                report[row.circleName].push(row);
                $scope.circleTotalAmount[row.circleName]+=row.processSalary;
                $scope.totalAmount+=row.processSalary;
            }

            $scope.report = report;

            // $scope.salarys = responseD;
            
            // for(x in responseD.user){
            //     let row = responseD.user[x];
            //     $scope.totalAmount+=responseD.user[x].processSalary;
            // }

            // setTimeout(function(){
            //     $('#example').DataTable();
            // },100);
           
        });
    };
    $scope.getAllCircleForReporting = function(){
        $http({
            method:'get',
            url:'/getAllCircleForReporting',
            headers: {
                'authorization': localStorage.token
            }
        }).then(function(response){
            let responseD = response.data.data;
            console.log(responseD);
            for(x in responseD){
                $scope.circleByCode[responseD[x].code] = responseD[x];
            }

        });
    }
    $scope.getAllCircleForReporting();
    $scope.getReport();

    $scope.circleCountFromClient = function(list,type){
        let total = 0;
        for(x in list){
            total += list[x][type];
        }

        return total;
    };
    

    $scope.objectCount = function(list){
        let count = 0;
        for(x in list){
            count++;
        }
        return count;
    }

    $scope.circleName = function(code){
        
        return $scope.circleByCode[code].name;
    }

    $scope.clearFilter = function(){
       $scope.year = '';
        $scope.month = '';
        $scope.getReport();
    }
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
