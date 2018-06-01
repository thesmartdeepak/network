app.controller('ctrl', function($scope, $http) {
    $scope.hideList = [];
    $scope.departmentList = function(){
        $http({
            method:'get',
            url:'/alldepartment',
            headers: {
                'authorization': localStorage.token
            }
        }).then(function(response){
            $scope.departments = response.data.data;
        });
    }
    
    $scope.departmentList();

    $scope.deletedepartment = function(departmentId){
        if(confirm('Do you want to delete?')){
            $http({
                method:'post',
                url:'/deletedepartment',
                data:{departmentId:departmentId},
                headers: {
                    'authorization': localStorage.token
                }
            }).then(function(response){
                alertBox('Deleted successfully','success');
                $scope.hideList.push(departmentId);
            });
        }
    }

    $scope.hidedepartment = function(departmentId){
        if($scope.hideList.indexOf(departmentId) != -1){
            return true;
        }
        else{
            return false;
        }
    }
});

sideBar('department');