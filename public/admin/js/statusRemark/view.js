app.controller('ctrl', function($scope, $http) {
    $scope.statusRemarkList = function(){
        $http({
            method:'get',
            url:'/allStatusRemark',
            headers: {
                'authorization': localStorage.token
            }
        }).then(function(response){
            $scope.statusRemarks = response.data.data;
        });
    }

    $scope.statusRemarkList();

    $scope.deleteStatusRemark = function(statusRemarkId){
        if(confirm('Do you want to delete?')){
            $http({
                method:'post',
                url:'/deleteStatusRemark',
                data:{statusRemarkId:statusRemarkId},
                headers: {
                    'authorization': localStorage.token
                }
            }).then(function(response){
                alertBox('Deleted successfully','success');
                $scope.statusRemarkList();
            });
        }
    }

    $scope.type = function(type){
        let typeObj = {
            activityStatus: "Activity Status",
            remark: "Remark",
            reportStatus: "Report Status",
            reportAcceptanceStatus: "Report Acceptance Status",
            clientRemark: "Client Remark",
        }

        if(typeObj[type]){
            return typeObj[type];
        }
        else{
            return type;
        }
    }
    
});


sideBar('statusRemark');