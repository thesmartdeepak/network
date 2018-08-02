app.controller('ctrl', function ($scope, $http) {
    $scope.month = "";
    $scope.year = "";
    let currentYear = (new Date()).getFullYear();
    $scope.selectYears = [];
    for (x = currentYear; x >= currentYear - 10; x--) {
        $scope.selectYears.push(x);
    }

    $scope.managementPer = 0;

    const monthNames = {
        "january": 1,
        "february": 2,
        "march": 3,
        "april": 4,
        "may": 5,
        "june": 6,
        "july": 7,
        "august": 8,
        "september": 9,
        "october": 10,
        "november": 11,
        "december": 12
    };

    $scope.getReport = function () {

        let searchData = {
            'year': $scope.year,
            'month': $scope.month,
            'clientName': $scope.clientId,
            'circleName': $scope.circleCode,
        };
        $http({
            method: 'post',
            url: '/getMisPL',
            data: searchData,
            headers: {
                'authorization': localStorage.token
            }
        }).then(function (response) {
            $scope.project = {};

            for (x in response.data.data.projectDetails) {
                row = response.data.data.projectDetails[x];
                row.investment = 0;
                row.salary = 0;
                row.salary_per = 0;
                row.claim = 0;
                row.claim_per = 0;
                row.cab = 0;
                row.cab_per = 0;
                row.vendor = 0;
                row.vendor_per = 0;
                row.kit = 0;
                row.kit_per = 0;
                $scope.project[row._id] = row;
            }

            for (x in response.data.data.salaryDetails) {
                var row = response.data.data.salaryDetails[x];
                if ($scope.project[row._id]) {
                    $scope.project[row._id].salary = row.processSalary.toFixed(2);
                    $scope.project[row._id].investment += parseInt(row.processSalary);
                }
            }

            for (x in response.data.data.advanceClaimDetails) {
                var row = response.data.data.advanceClaimDetails[x];

                if ($scope.project[row._id]) {
                    $scope.project[row._id].claim = row.totalTransfer.toFixed(2);
                    $scope.project[row._id].investment += parseInt(row.totalTransfer);
                }
            }

            for (x in response.data.data.cabDetails) {
                var row = response.data.data.cabDetails[x];

                if ($scope.project[row._id]) {
                    $scope.project[row._id].cab = row.totalAmount.toFixed(2);
                    $scope.project[row._id].investment += parseInt(row.totalAmount);
                }
            }


            for (x in response.data.data.vendorDetails) {
                var row = response.data.data.vendorDetails[x];

                if ($scope.project[row._id]) {
                    $scope.project[row._id].vendor = row.totalAmount.toFixed(2);
                    $scope.project[row._id].investment += parseInt(row.totalAmount);
                }
            }

            let defaultTotalMonth = 0;
            let fromDate = null;
            let today = getFormattedDate(new Date());
            
            if ($scope.month && $scope.year) {
                fromDate = "01/" + monthNames[$scope.month.toLowerCase()] + "/" + $scope.year;
                
                defaultTotalMonth = 1;
            }

            for (x in response.data.data.kitDetails) {
                var row = response.data.data.kitDetails[x];
             
                let createdAt = getFormattedDate(new Date(row.createAt));

                let afterFromDate = defaultTotalMonth;

                let afterFromDateCount = monthDiff(createdAt, today);

                if ((defaultTotalMonth <= 0) || (afterFromDateCount < defaultTotalMonth) || (fromDate == null)) {
                    afterFromDate = afterFromDateCount;
                }
                
                row.totalAmount = row.kitRent * afterFromDate;
                
                //
                if ($scope.project[row.projectCode]) {
                    if(!$scope.project[row.projectCode]["kit"]){
                        $scope.project[row.projectCode]["kit"] = 0;
                    }
                    $scope.project[row.projectCode]["kit"] += row.totalAmount;
                    $scope.project[row.projectCode].investment += row.totalAmount;
                }
            }
        });
    }
    $scope.getReport();


    $scope.clearFilter = function () {
        $scope.year = '';
        $scope.month = '';
        $scope.getReport();
    }

    $scope.percent = function (amount, total) {
        let percent = 0;
        if (amount && total) {
            percent = amount * 100 / total;
        }

        return percent.toFixed(2);
    }

    $scope.managementCost = function (amount) {
        let cost = amount * $scope.managementPer / 100;
        return parseInt(cost);
    }

    $scope.revenue = function (business, investment) {
        let revenue = 0;

        if (business && investment) {
            let totalInvestment = investment + $scope.managementCost(investment);
            revenue = (business - totalInvestment) * 100 / business;
        }
        return revenue.toFixed(2);
    }
    $scope.netProfit = function (business, investment) {
        let revenue = 0;

        if (business && investment) {
            let totalInvestment = investment + $scope.managementCost(investment);
            revenue = (business - totalInvestment);
        }
        return revenue;
    }
});


sideBar('reporting');
sideBar('mis');