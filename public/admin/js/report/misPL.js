app.controller('ctrl', function ($scope, $http) {
    let currentYear = (new Date()).getFullYear();
    $scope.selectYears=[];
    for(x=currentYear;x>=currentYear-10;x--){
        $scope.selectYears.push(x);
    }

    $scope.managementPer = 0;
    
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
            $scope.project= {};
            for(x in response.data.data.projectDetails){
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
            
            for(x in response.data.data.salaryDetails){
                var row = response.data.data.salaryDetails[x];
                if($scope.project[row._id]){
                    $scope.project[row._id].salary = parseInt(row.processSalary);
                    $scope.project[row._id].investment += parseInt(row.processSalary);
                }
            }

            for(x in response.data.data.advanceClaimDetails){
                var row = response.data.data.advanceClaimDetails[x];

                if($scope.project[row._id]){
                    $scope.project[row._id].claim = parseInt(row.totalTransfer);
                    $scope.project[row._id].investment += parseInt(row.totalTransfer);
                }
            }

            for(x in response.data.data.cabDetails){
                var row = response.data.data.cabDetails[x];
 
                if($scope.project[row._id]){
                    $scope.project[row._id].cab = parseInt(row.totalAmount);
                    $scope.project[row._id].investment += parseInt(row.totalAmount);
                }
            }

            for(x in response.data.data.kitDetails){
                var row = response.data.data.kitDetails[x];

                if($scope.project[row._id]){
                    $scope.project[row._id].kit = parseInt(row.totalAmount);
                    $scope.project[row._id].investment += parseInt(row.totalAmount);
                }
            }
            
            for(x in response.data.data.vendorDetails){
                var row = response.data.data.vendorDetails[x];
                
                if($scope.project[row._id]){
                    $scope.project[row._id].vendor = parseInt(row.totalAmount);
                    $scope.project[row._id].investment += parseInt(row.totalAmount);
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

    $scope.percent = function(amount,total){
        let percent = 0;
        if(amount && total){
            percent = amount*100/total;
        }

        return percent.toFixed(2);
    }

    $scope.managementCost = function(amount){
        let cost = amount*$scope.managementPer/100;
        return parseInt(cost);
    }

    $scope.revenue = function(business,investment){
        let revenue = 0;
        
        if(business && investment){
            let totalInvestment = investment+$scope.managementCost(investment);
            revenue = (business-totalInvestment)*100/business;
        }
        return revenue.toFixed(2);
    }
});


sideBar('reporting');
sideBar('mis');