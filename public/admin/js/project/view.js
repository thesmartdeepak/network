app.controller('ctrl', function($scope, $http) {
    $scope.currentPage = 1;
    $scope.projects = [];
    $scope.startPage = 1;
    $scope.pagination = null;
    $scope.projectList = function(page){
        $http({
            method:'get',
            url:'/allProject?page='+page,
            headers: {
                'authorization': localStorage.token
            }
        }).then(function(response){
            $scope.projects = response.data.data;
            // for(x in response.data.data){
            //     $scope.projects.push(response.data.data[x]);
            // }

            // if(response.data.data.length == 10){
            //     $scope.currentPage += 1;
            // }
        });
    }
    
    $scope.setPagination = function(){
        $http({
            method:'get',
            url:'/allProjectCount',
            headers: {
                'authorization': localStorage.token
            }
        }).then(function(response){
            let totalPage = Math.ceil(response.data.data/10);
            if(totalPage > 0){
                
                $scope.pagination = $('#pagination').twbsPagination({
                    totalPages: totalPage,
                    visiblePages:3,
                    startPage:$scope.startPage,
                    onPageClick: function (event, page) {
                        $scope.currentPage = page;
                        $scope.projectList(page);
                    }
                });
            }
            else{
                $scope.projects = [];
            }
        });
    }

    $scope.setPagination();

    $scope.toUcFirst = function(oldTxt){
        return oldTxt.charAt(0).toUpperCase()+oldTxt.slice(1);
    }

    $scope.deleteProject = function(projectId){
        $http({
            method:'post',
            url:'/deleteProject',
            data:{projectId:projectId},
            headers: {
                'authorization': localStorage.token
            }
        }).then(function(response){
            alertBox('Deleted successfully','success');
            if($scope.projects.length > 1){
                $scope.projectList($scope.currentPage);
            }
            else{
                $('#pagination').twbsPagination('destroy');
                $scope.startPage = $scope.currentPage-1;
                $scope.setPagination();
            }
        });
    }
});

sideBar('project');