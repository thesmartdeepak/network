app.controller('ctrl', function ($scope, $http) {
    let currentYear = (new Date()).getFullYear();
    $scope.selectYears = [];
    for (x = currentYear; x >= currentYear - 10; x--) {
        $scope.selectYears.push(x);
    }
    $scope.circleByCode = {};
    $scope.vendors = {};
    let responseD = [];

    $scope.getFromDb = function(){
        $http({
            method: 'post',
            url: '/getMisKit',
            headers: {
                'authorization': localStorage.token
            }
        }).then(function (response) {
            responseD = response.data.data.user;
            $scope.getReport();
        });
    }

    $scope.getFromDb();

    $scope.getReport = function () {

        $scope.totalAmount = 0;

        $scope.report = [];

        let today = getFormattedDate(new Date());
        
        let defaultTotalMonth = 0;
        let fromDate = null;
        
        if($scope.month && $scope.year){
            fromDate = "01/"+$scope.month+"/"+$scope.year;
            defaultTotalMonth = monthDiff(fromDate,today);
        }
        
        let report = {};

        $scope.empNameCount = {};

        $scope.empTotal = {};

        for (x in responseD) {
            let row = responseD[x];
            
            let createdAt = getFormattedDate(new Date(row.createAt));

            let afterFromDate = defaultTotalMonth;
            
            let afterFromDateCount = monthDiff(createdAt,today);
            
            if((defaultTotalMonth <= 0) || (afterFromDateCount < defaultTotalMonth)){
                afterFromDate = afterFromDateCount;
            }

            row.totalAmount = row.kitRent*afterFromDate;

            if (!report[row.empName]) {
                report[row.empName] = {};
            }

            report[row.empName][row.kitName] = row;

            if (!$scope.empNameCount[row.empName]) {
                $scope.empNameCount[row.empName] = 0;
            }
            $scope.empNameCount[row.empName] += 1;

            $scope.totalAmount += row.totalAmount;

            if (!$scope.empTotal[row.empName]) {
                $scope.empTotal[row.empName] = 0;
            }
            $scope.empTotal[row.empName] += row.totalAmount;
        }

        $scope.report = report;
    }
    
    let already_seen_row = {};
    $scope.show_row = function (data_row) {
        if (already_seen_row[data_row]) {
            return false;
        }
        else {
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
