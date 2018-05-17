app.controller('ctrl', function($scope, $http) {

    $scope.activityList = function(page){
        $http({
            method:'get',
            url:'/allActivity?page='+page,
            headers: {
                'authorization': localStorage.token
            }
        }).then(function(response){
            $scope.activitys = response.data.data;
        });
    }
    
    $scope.setPagination = function(){
        $http({
            method:'get',
            url:'/allActivityCount',
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
                    $scope.activityList(page);
                }
            });
        });
    }

    $scope.setPagination();

    $scope.deleteActivity = function(activityId){
        $http({
            method:'post',
            url:'/deleteActivity',
            data:{activityId:activityId},
            headers: {
                'authorization': localStorage.token
            }
        }).then(function(response){
            alertBox('Deleted successfully','success');
            if($scope.activitys.length > 1){
                $scope.activityList($scope.currentPage);
            }
            else{
                $scope.currentPage-=1;
                $scope.activityList($scope.currentPage);
            }
        });
    }

});

sideBar('activity');