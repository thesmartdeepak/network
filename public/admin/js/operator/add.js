$("#addoperatorForm").validate();

app.controller('ctrl', function($scope, $http) {

    $scope.formData = {
        name:"",
     };
  
    $scope.submit = function () {
        if($("#addoperatorForm").valid()){
            var submitUrl = "/addoperator";
            if(window.location.search){
                submitUrl = "/editoperator"+window.location.search;
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
                        window.location.href = "/view-operator";
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
            url: '/oneoperator'+window.location.search,
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


sideBar('operator');