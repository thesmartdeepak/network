app.controller('ctrl', function($scope, $http) {
    $scope.hideList = [];
    $scope.currentPage = 1;
    
    $scope.projecttypeList = function(page){
        $http({
            method:'get',
            url:'/allprojecttype?page='+page,
            headers: {
                'authorization': localStorage.token
            }
        }).then(function(response){
            $scope.projecttypes = response.data.data;
        });
    }

    $scope.setPagination = function(){
        $http({
            method:'get',
            url:'/allProjectTypeCount',
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
                        $scope.projecttypeList(page);
                    }
                });
            }
            else{
                $scope.projecttypes = [];
            }
        });
    }

    $scope.setPagination();

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
            if($scope.projecttypes.length > 1){
                $scope.projecttypeList($scope.currentPage);
            }
            else{
                $('#pagination').twbsPagination('destroy');
                $scope.startPage = $scope.currentPage-1;
                $scope.setPagination();
            }
        });
    }

    $scope.departmentName = function(department){
        let departmentName = '';
        department.forEach(function(value,index){
            departmentName = value.name;
        });
        
        return departmentName;
    }
});

sideBar('projecttype');