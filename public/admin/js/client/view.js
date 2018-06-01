app.controller('ctrl', function($scope, $http) {
    $scope.currentPage = 1;
    $scope.startPage = 1;
    $scope.clientList = function(page){
        $http({
            method:'get',
            url:'/allclient?page='+page,
            headers: {
                'authorization': localStorage.token
            }
        }).then(function(response){
            $scope.clients = response.data.data;
        });
    }
    
    $scope.setPagination = function(){
        $http({
            method:'get',
            url:'/allclientCount',
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
                        $scope.clientList(page);
                    }
                });
            }
            else{
                $scope.clients = [];
            }
        });
    }

    $scope.setPagination();

    $scope.deleteclient = function(clientId){
        if(confirm('Do you want to delete?')){
            $http({
                method:'post',
                url:'/deleteclient',
                data:{clientId:clientId},
                headers: {
                    'authorization': localStorage.token
                }
            }).then(function(response){
                alertBox('Deleted successfully','success');
                if($scope.clients.length > 1){
                    $scope.clientList($scope.currentPage);
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

sideBar('client');