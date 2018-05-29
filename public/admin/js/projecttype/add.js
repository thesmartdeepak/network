$("#addprojecttypeForm").validate();

app.controller('ctrl', function($scope, $http) {

    $scope.formData = {
        name:"",
     };
  
    $scope.submit = function () {
        if($("#addprojecttypeForm").valid()){
            var submitUrl = "/addprojecttype";
            if(window.location.search){
                submitUrl = "/editprojecttype"+window.location.search;
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
                        window.location.href = "/view-projecttype";
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
            url: '/oneprojecttype'+window.location.search,
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


sideBar('projecttype');