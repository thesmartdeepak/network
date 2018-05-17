$("#addRegionForm").validate();

app.controller('ctrl', function($scope, $http) {

    $scope.formData = {
        name:"",
        description: "",
        code: "",
    };
  
    $scope.submit = function () {
        if($("#addRegionForm").valid()){
            var submitUrl = "/addRegion";
            if(window.location.search){
                submitUrl = "/editRegion"+window.location.search;
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
                        window.location.href = "/view-region";
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
            url: '/oneRegion'+window.location.search,
            data:$scope.formData,
            headers: {
                'authorization': localStorage.token
            },
        }).then(function(response){
            $scope.formData = {
                name:response.data.data.name,
                description: response.data.data.description,
                code: response.data.data.code,
            };
            
            $scope.editMode = true;
        });
    }
});


sideBar('region');