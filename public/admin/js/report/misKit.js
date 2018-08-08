app.controller('ctrl', function ($scope, $http) {
    let currentYear = (new Date()).getFullYear();
    $scope.selectYears = [];
    for (x = currentYear; x >= currentYear - 10; x--) {
        $scope.selectYears.push(x);
    }
    $scope.circleByCode = {};
    $scope.vendors = {};
    let responseD = [];

    $scope.getFromDb = function () {
       // alert($scope.fromDate);
        let searchData = {
            'fromDate': $scope.fromDate,
            'toDate': $scope.toDate,
        };
        $http({
            method: 'post',
            url: '/getMisKit', 
            data:searchData,
            headers: {
                'authorization': localStorage.token
            }
        }).then(function (response) {
            responseD = response.data.data.user;
            $scope.getReport();
        });
    }

    $scope.getFromDb();

    function SendDate(createAt) {
        let monthDifrrence = null;
        if (!$scope.fromDate && !$scope.toDate) {
            monthCount = monthDiff(createAt, getFormattedDate(new Date()));
            
            return monthCount;
        }
        else if (!$scope.fromDate && $scope.toDate) { 
           monthCount = monthDiff(createAt, getFormattedDate(new Date($scope.toDate)));
           return monthCount;
        }
        else if($scope.fromDate && !$scope.toDate){
            if(compareDate(createAt) < compareDate($scope.fromDate)){
                monthCount = monthDiff(getFormattedDate(new Date($scope.fromDate)),getFormattedDate(new Date()));
                return monthCount;
            }else{
                monthCount = monthDiff(createAt,getFormattedDate(new Date()));
                return monthCount;
            }
        }
        else if($scope.fromDate && $scope.toDate){
           if(compareDate(createAt) < compareDate($scope.fromDate)){
                monthCount = monthDiff(getFormattedDate(new Date($scope.fromDate)),getFormattedDate(new Date($scope.toDate)));
                return monthCount;
            }else{
                 monthCount = monthDiff(createAt,$scope.toDate);
                return monthCount;
            }
        }
    };
    function compareDate(date){
        var parts = date.split("/");
        return new Date(parts[2], parts[1] - 1, parts[0]);
     }
    $scope.getReport = function () {

        $scope.totalAmount = 0;

        $scope.report = [];

        let today = getFormattedDate(new Date());

        let defaultTotalMonth = 0;
        let fromDate = null;

        if ($scope.month && $scope.year) {
            fromDate = "01/" + $scope.month + "/" + $scope.year;
            defaultTotalMonth = monthDiff(fromDate, today);
        }

        let report = {};

        $scope.empNameCount = {};

        $scope.empTotal = {};

        for (x in responseD) {
            let row = responseD[x];

            let createdAt = getFormattedDate(new Date(row.createAt));
            afterFromDate = SendDate(createdAt);
           // alert(row.kitName+" ...."+afterFromDate)
            // let afterFromDate = defaultTotalMonth;

            // let afterFromDateCount = monthDiff(createdAt, today);

            // if ((defaultTotalMonth <= 0) || (afterFromDateCount < defaultTotalMonth)) {
            //     afterFromDate = afterFromDateCount;
            // }

            row.totalAmount = row.kitRent * afterFromDate;

            if (!report[row.empUserId]) {
                report[row.empUserId] = [];
            }

            report[row.empUserId].push(row);

            if (!$scope.empNameCount[row.empUserId]) {
                $scope.empNameCount[row.empUserId] = 0;
            }
            $scope.empNameCount[row.empUserId] += 1;

            $scope.totalAmount += row.totalAmount;

            if (!$scope.empTotal[row.empUserId]) {
                $scope.empTotal[row.empUserId] = 0;
            }
            $scope.empTotal[row.empUserId] += row.totalAmount;
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

    $scope.rowCount = function(count,index){
        if(index ==0){
            return count;
        }
        return 0;
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
