app.controller('ctrl', function($scope, $http) {
    $scope.typeList = function(){
        $http({
            method:'get',
            url:'/allUserType',
            headers: {
                'authorization': localStorage.token
            }
        }).then(function(response){
            $scope.types = response.data.data;
        });
    }
    $scope.typeList();

    $scope.toUcFirst = function(oldTxt){
        return oldTxt.charAt(0).toUpperCase()+oldTxt.slice(1);
    }
});


sideBar('user');