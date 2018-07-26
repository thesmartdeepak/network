app.controller('ctrl', function($scope, $http) {
    $scope.circleByCode = {};
    $scope.claimAdvances = {};
    // $scope.year = "2018";
    $scope.getReport = function(){
      let searchData = {
            'year' : $scope.year, 
            'month' : $scope.month,
        };
        $http({
            method:'post',
            url:'/getMisClaimAdvance',
            data:searchData,
            headers: {
                'authorization': localStorage.token
            }
        }).then(function(response){
            $scope.claimAdvances = [];

            $scope.totalCount = 0;
            $scope.totalAcceptance = 0;
            $scope.totalAmount = 0;
            $scope.report = [];
            let responseD = response.data.data;

            let report = {};

            $scope.claimAdvances = responseD.user;
            
            for(x in responseD.user){
                let row = responseD.user[x];
                $scope.totalAmount+=responseD.user[x].totalTransfer;
            }

            $('#example').DataTable().destroy();
            setTimeout(function(){
                $('#example').DataTable();
            },10);
           
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
       // $scope.claimAdvances = [];
        
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
