app.controller('ctrl', function($scope, $http) {
    $scope.hideList = [];
    $scope.operatorList = function(){
        $http({
            method:'get',
            url:'/alloperator',
            headers: {
                'authorization': localStorage.token
            }
        }).then(function(response){
            $scope.operators = response.data.data;
        });
    }
    
    $scope.operatorList();

    $scope.deleteoperator = function(operatorId){
        if(confirm('Do you want to delete?')){
            $http({
                method:'post',
                url:'/deleteoperator',
                data:{operatorId:operatorId},
                headers: {
                    'authorization': localStorage.token
                }
            }).then(function(response){
                alertBox('Deleted successfully','success');
                $scope.hideList.push(operatorId);
            });
        }
    }

    $scope.hideoperator = function(operatorId){
        if($scope.hideList.indexOf(operatorId) != -1){
            return true;
        }
        else{
            return false;
        }
    }
});

sideBar('operator');