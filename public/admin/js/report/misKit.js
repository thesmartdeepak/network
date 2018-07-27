app.controller('ctrl', function ($scope, $http) {
    $scope.circleByCode = {};
    $scope.vendors = {};
    // $scope.year = "2018";
    $scope.getReport = function () {

        let searchData = {
            'year': $scope.year,
            'month': $scope.month,
            'clientName': $scope.clientId,
            'circleName': $scope.circleCode,
        };
        $http({
            method: 'post',
            url: '/getMisKit',
            data: searchData,
            headers: {
                'authorization': localStorage.token
            }
        }).then(function (response) {
            $scope.totalAmount = 0;

            $scope.report = [];
            let responseD = response.data.data.user;
            let report = {};

            $scope.empNameCount = {};

            $scope.empTotal = {};

            for (x in responseD) {
                let row = responseD[x];
                if (!report[row.empName]) {
                    report[row.empName] = {};
                }
                
                report[row.empName][row.kitName] = row;

                if (!$scope.empNameCount[row.empName]) {
                    $scope.empNameCount[row.empName] = 0;
                }
                $scope.empNameCount[row.empName] += 1;

                $scope.totalAmount += row.totalAmount;

                if(!$scope.empTotal[row.empName]){
                    $scope.empTotal[row.empName] = 0;
                }
                $scope.empTotal[row.empName] += row.totalAmount;
            }

            $scope.report = report;
        });
    }
    $scope.getReport();

    let already_seen_row = {};
    $scope.show_row = function(data_row){
        if(already_seen_row[data_row]){
            return false;
        }
        else{
            already_seen_row[data_row] = true;
            return true;
        }
    }
  
    $scope.clearFilter = function () {
        $scope.year = '';
        $scope.month = '';
        $scope.clientId = '';
        $scope.circleCode = '';
        $scope.activityId = '';
        $scope.getReport();
        // $scope.vendors = [];

    }

    $scope.getAllCircleForReporting = function () {
        $http({
            method: 'get',
            url: '/getAllCircleForReporting',
            headers: {
                'authorization': localStorage.token
            }
        }).then(function (response) {
            let responseD = response.data.data;

            for (x in responseD) {
                $scope.circleByCode[responseD[x].code] = responseD[x];
            }

        });
    }

    $scope.getAllClinetForReporting = function () {
        $http({
            method: 'get',
            url: '/getAllClinetForReporting',
            headers: {
                'authorization': localStorage.token
            }
        }).then(function (response) {
            $scope.clients = response.data.data;
        });
    }
    $scope.getActivity = function () {
        $http({
            method: 'get',
            url: '/allActivity',
            headers: {
                'authorization': localStorage.token,
            },
        }).then(function (response) {
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
