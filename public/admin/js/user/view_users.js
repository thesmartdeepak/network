app.controller('ctrl', function($scope, $http) {
    $scope.currentPage = 1;
    $scope.users = [];
    $scope.startPage = 1;
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
            if(totalPage > 0){
                
                $('#pagination').twbsPagination({
                    totalPages: totalPage,
                    visiblePages:3,
                    startPage:$scope.startPage,
                    onPageClick: function (event, page) {
                        $scope.currentPage = page;
                        $scope.userList(page);
                    }
                });
            }
            else{
                $scope.users = [];
            }
        });
    }

    $scope.setPagination();

    $scope.toUcFirst = function(oldTxt){
        return oldTxt.charAt(0).toUpperCase()+oldTxt.slice(1);
    }

    $scope.showProjectCode = function(value){
        
        if(value){
            return value;
        }
        else{
            return '--';
        }
    }

    $scope.showOperator = function(value){
        
         if(value && value[0]){
            let operatorsName = [];
            for(x in value){
                operatorsName.push(value[x].operatorName);
            }

            return operatorsName.join(", ");
        }
        else{
            return '--';
        }
    }

    $scope.deleteUser = function(userId){
        if(confirm('Do you want to delete?')){
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
                    $('#pagination').twbsPagination('destroy');
                    $scope.startPage = $scope.currentPage-1;
                    $scope.setPagination();
                }
            });
        }
    }
    
    $scope.changePasswordCurrentId = null;
    $scope.error = {};
    $scope.changePassword = function(id,name){
        $scope.changePasswordCurrentId = id;
        $scope.changePasswordCurrentName = name;
        $("#changePasswordModel").modal();
    }

    $scope.updatePassword = function(){
        $scope.error = {};
        
        if(($scope.password) && ($scope.password == $scope.repeatPassword)){
            $http({
                method:'POST',
                url:'/changePassword',
                data:{id:$scope.changePasswordCurrentId,password:$scope.password},
                headers: {
                    'authorization': localStorage.token
                }
            }).then(function(response){
                $("#changePasswordModel").modal('hide');
                alertBox(response.data.msg,'success');
            });
        }
        else{
            if(!$scope.password){
                $scope.error.password = "Please enter password.";
            }
            else{
                $scope.error.repeatPassword = "Repeat password not matching.";
            }
        }
    }


    $scope.hide_edit_delete = function(user){
        if(user.userType=='admin'){
            return true;
        }
        else if((user.userType != 'manager' && user.userType != 'billing-admin') && localStorage.userType=='admin'){
            return true;
        }
    }
});

sideBar('user');