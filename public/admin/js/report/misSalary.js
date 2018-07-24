app.controller('ctrl', function($scope, $http) {
    $scope.circleByCode = {};
    $scope.salarys = {};
    $scope.getReport = function(){
      let searchData = {
            'year' : $scope.year, 
            'month' : $scope.month,
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
            $scope.salarys = [];

            $scope.totalCount = 0;
            $scope.totalAcceptance = 0;
            $scope.totalAmount = 0;
            $scope.report = [];
            let responseD = response.data.data;

            let report = {};

            $scope.salarys = responseD.user;
            
            for(x in responseD.user){
                let row = responseD.user[x];
                $scope.totalAmount+=responseD.user[x].processSalary;
            }

            setTimeout(function(){
                $('#example').DataTable();
            },1000);
           
        });
    }

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

$('#fromDate').datepicker({
    autoclose: true,
    maxDate: "+0D"
});

$('#toDate').datepicker({
    autoclose: true,
    maxDate: "+0D"
});
