app.controller('ctrl', function($scope, $http) {
    $scope.hideList = [];
    $scope.currentPage = 1;
    
    $scope.projectTypeList = function(page){
        $http({
            method:'get',
            url:'/allProjectType?page='+page,
            headers: {
                'authorization': localStorage.token
            }
        }).then(function(response){
            $scope.projectTypes = response.data.data;
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
                        $scope.projectTypeList(page);
                    }
                });
            }
            else{
                $scope.projectTypes = [];
            }
        });
    }

    $scope.setPagination();

    $scope.deleteProjectType = function(projectTypeId){
        if(confirm('Do you want to delete?')){
            $http({
                method:'post',
                url:'/deleteProjectType',
                data:{projectTypeId:projectTypeId},
                headers: {
                    'authorization': localStorage.token
                }
            }).then(function(response){

                alertBox('Deleted successfully','success');
                if($scope.projectTypes.length > 1){
                    $scope.projectTypeList($scope.currentPage);
                }
                else{
                    $('#pagination').twbsPagination('destroy');
                    $scope.startPage = $scope.currentPage-1;
                    $scope.setPagination();
                }
            });
        }
    }

    $scope.departmentName = function(department){
        let departmentName = '';
        department.forEach(function(value,index){
            departmentName = value.name;
        });
        
        return departmentName;
    }
});

sideBar('projectType');