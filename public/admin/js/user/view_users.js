app.controller('ctrl', function($scope, $http) {
    $scope.currentPage = 1;
    $scope.users = [];
    $scope.userList = function(page){
        $http({
            method:'get',
            url:'/allUser?page='+page,
            headers: {
                'authorization': localStorage.token
            }
        }).then(function(response){
            $scope.users = response.data.data;
        });
    }
    
    $scope.setPagination = function(){
        $http({
            method:'get',
            url:'/allUserMaxCount',
            headers: {
                'authorization': localStorage.token
            }
        }).then(function(response){
            let totalPage = Math.ceil(response.data.data/10);
            $('#pagination-demo').twbsPagination({
                totalPages: totalPage,
                visiblePages:3,
                onPageClick: function (event, page) {
                    $scope.currentPage = page;
                    $scope.userList(page);
                }
            });
        });
    }

    $scope.setPagination();

    $scope.toUcFirst = function(oldTxt){
        return oldTxt.charAt(0).toUpperCase()+oldTxt.slice(1);
    }

    $scope.deleteUser = function(userId){
        $http({
            method:'post',
            url:'/deleteUser',
            data:{userId:userId},
            headers: {
                'authorization': localStorage.token
            }
        }).then(function(response){
            alertBox('Deleted successfully','success');
            if($scope.users.length > 1){
                $scope.userList($scope.currentPage);
            }
            else{
                $scope.currentPage-=1;
                $scope.userList($scope.currentPage);
            }
        });
    }
});

sideBar('user');