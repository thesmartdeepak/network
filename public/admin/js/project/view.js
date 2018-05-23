app.controller('ctrl', function($scope, $http) {
    $scope.hideList = [];
    $scope.circleList = function(){
        $http({
            method:'get',
            url:'/allCircle',
            headers: {
                'authorization': localStorage.token
            }
        }).then(function(response){
            $scope.circles = response.data.data;
        });
    }
    
    $scope.circleList();

    $scope.deleteCircle = function(circleId){
        $http({
            method:'post',
            url:'/deleteCircle',
            data:{circleId:circleId},
            headers: {
                'authorization': localStorage.token
            }
        }).then(function(response){
            alertBox('Deleted successfully','success');
            $scope.hideList.push(circleId);
        });
    }

    $scope.hideCircle = function(circleId){
        if($scope.hideList.indexOf(circleId) != -1){
            return true;
        }
        else{
            return false;
        }
    }
});

sideBar('circle');