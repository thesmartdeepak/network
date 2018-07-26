app.controller('ctrl', function($scope, $http) {
    $scope.circleByCode = {};
    
    $scope.getReport = function(){
        let searchData = {
            'fromDate': $scope.fromDate,
            'toDate': $scope.toDate,
            'client':$scope.client
        };
        $http({
            method:'post',
            url:'/getMisClientCircle',
            data:searchData,
            headers: {
                'authorization': localStorage.token
            }
        }).then(function(response){
            $scope.totalCount = 0;
            $scope.totalAcceptance = 0;
            $scope.totalPoAmount = 0;
            $scope.report = [];
            let responseD = response.data.data;

            let report = {};
            
            for(x in responseD.circleClientSite){
                let row = responseD.circleClientSite[x];
                row.amount = 0;
                row.acceptance = 0;
                if(!report[row._id.client]){
                    report[row._id.client] = {}
                }
                
                report[row._id.client][row._id.circle] = row;

                $scope.totalCount+=row.count;
            }

            for(x in responseD.circleClientAcceptance){
                let row = responseD.circleClientAcceptance[x];
                if(report[row._id.client][row._id.circle]){
                    row.count = report[row._id.client][row._id.circle].count;
                }
                else{
                    row.count = 0;
                }

                report[row._id.client][row._id.circle] = row;

                $scope.totalAcceptance += row.acceptance;
                $scope.totalPoAmount += row.amount;
            }

            $scope.report = report;
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
        for(x in list){
            count++;
        }
        alert(count);
        return count;
    }

    $scope.circleName = function(code){
        
        return $scope.circleByCode[code].name;
    }

    $scope.clearFilter = function(){
        $scope.fromDate = '';
        $scope.toDate = '';
        $scope.client = '';
        $scope.getReport();
    }
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
