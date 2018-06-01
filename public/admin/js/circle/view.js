app.controller('ctrl', function($scope, $http) {
    $scope.currentPage = 1;
    $scope.circles = [];
    $scope.startPage = 1;
    $scope.circleList = function(page){
        $http({
            method:'get',
            url:'/allCircle?page='+page,
            headers: {
                'authorization': localStorage.token
            }
        }).then(function(response){
            $scope.circles = response.data.data;
        });
    }
    
    $scope.setPagination = function(){
        $http({
            method:'get',
            url:'/allCircleCount',
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
                        $scope.circleList(page);
                    }
                });
            }
            else{
                $scope.circles = [];
            }
        });
    }

    $scope.setPagination();

    $scope.toUcFirst = function(oldTxt){
        return oldTxt.charAt(0).toUpperCase()+oldTxt.slice(1);
    }

    $scope.deleteCircle = function(circleId){
        if(confirm('Do you want to delete?')){
            $http({
                method:'post',
                url:'/deleteCircle',
                data:{circleId:circleId},
                headers: {
                    'authorization': localStorage.token
                }
            }).then(function(response){
                alertBox('Deleted successfully','success');
                if($scope.circles.length > 1){
                    $scope.circleList($scope.currentPage);
                }
                else{
                    $('#pagination').twbsPagination('destroy');
                    $scope.startPage = $scope.currentPage-1;
                    $scope.setPagination();
                }
            });
        }
    }

    $scope.clientName = function(client){
        let clientName = '';
        client.forEach(function(value,index){
            clientName = value.name;
        });
        
        return clientName;
    }
    $scope.regionName = function(region){
        let regionName = '';
        region.forEach(function(value,index){
            regionName = value.name;
            
        });
        
        return regionName;
    }
});

sideBar('circle');