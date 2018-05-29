app.controller('ctrl', function($scope, $http) {
    $scope.hideList = [];
    $scope.projecttypeList = function(){
        $http({
            method:'get',
            url:'/allprojecttype',
            headers: {
                'authorization': localStorage.token
            }
        }).then(function(response){
            $scope.projecttypes = response.data.data;
        });
    }
    
    $scope.projecttypeList();

    $scope.deleteprojecttype = function(projecttypeId){
        $http({
            method:'post',
            url:'/deleteprojecttype',
            data:{projecttypeId:projecttypeId},
            headers: {
                'authorization': localStorage.token
            }
        }).then(function(response){
            alertBox('Deleted successfully','success');
            $scope.hideList.push(projecttypeId);
        });
    }

    $scope.hideprojecttype = function(projecttypeId){
        if($scope.hideList.indexOf(projecttypeId) != -1){
            return true;
        }
        else{
            return false;
        }
    }
});

sideBar('projecttype');