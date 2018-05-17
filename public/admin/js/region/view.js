app.controller('ctrl', function($scope, $http) {
    $scope.hideList = [];
    $scope.regionList = function(){
        $http({
            method:'get',
            url:'/allRegion',
            headers: {
                'authorization': localStorage.token
            }
        }).then(function(response){
            $scope.regions = response.data.data;
        });
    }
    
    $scope.regionList();

    $scope.deleteRegion = function(regionId){
        $http({
            method:'post',
            url:'/deleteRegion',
            data:{regionId:regionId},
            headers: {
                'authorization': localStorage.token
            }
        }).then(function(response){
            alertBox('Deleted successfully','success');
            $scope.hideList.push(regionId);
        });
    }

    $scope.hideRegion = function(regionId){
        if($scope.hideList.indexOf(regionId) != -1){
            return true;
        }
        else{
            return false;
        }
    }
});

sideBar('region');