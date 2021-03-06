app.controller('ctrl', function($scope, $http) {
    $scope.currentPage = 1;
    $scope.startPage = 1;
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
            if(totalPage > 0){
                $('#pagination').twbsPagination({
                    totalPages: totalPage,
                    visiblePages:3,
                    startPage:$scope.startPage,
                    onPageClick: function (event, page) {
                        $scope.currentPage = page;
                        $scope.activityList(page);
                    }
                });
            }
            else{
                $scope.activitys = [];
            }
        });
    }

    $scope.setPagination();

    $scope.deleteActivity = function(activityId){
        if(confirm('Do you want to delete?')){
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
                    $('#pagination').twbsPagination('destroy');
                    $scope.startPage = $scope.currentPage-1;
                    $scope.setPagination();
                }
            });
        }
    }
});

sideBar('activity');