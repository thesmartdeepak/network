$("#adddepartmentForm").validate();

app.controller('ctrl', function($scope, $http) {

    $scope.formData = {
        name:"",
     };
  
    $scope.submit = function () {
        if($("#adddepartmentForm").valid()){
            var submitUrl = "/adddepartment";
            if(window.location.search){
                submitUrl = "/editdepartment"+window.location.search;
            }
            $http({
                method: 'POST',
                url: submitUrl,
                data:$scope.formData,
                headers: {
                    'authorization': localStorage.token
                },
            }).then(function(response){
                if (response.data.success){
                    alertBox(response.data.msg,'success');
                    setTimeout(function(){
                        window.location.href = "/view-department";
                    },1000);
                }
                else{
                    alertBox(response.data.msg,'danger');
                }
            });
        }
    };

    if(window.location.search){
        $http({
            method: 'get',
            url: '/onedepartment'+window.location.search,
            data:$scope.formData,
            headers: {
                'authorization': localStorage.token
            },
        }).then(function(response){
            $scope.formData = {
                name:response.data.data.name,
            };
            
            $scope.editMode = true;
        });
    }
});


sideBar('department');