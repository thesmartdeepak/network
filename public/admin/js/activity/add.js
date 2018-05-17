$("#addActivityForm").validate();

app.controller('ctrl', function($scope, $http) {

    $scope.formData = {
        name:"",
        description: "",
        seq: "",
    };
  
    $scope.submit = function () {
        if($("#addActivityForm").valid()){
            var submitUrl = "/addActivity";
            if(window.location.search){
                submitUrl = "/editActivity"+window.location.search;
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
                        window.location.href = "/view-activity";
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
            url: '/oneActivity'+window.location.search,
            data:$scope.formData,
            headers: {
                'authorization': localStorage.token
            },
        }).then(function(response){
            $scope.formData = {
                name:response.data.data.name,
                description: response.data.data.description,
                seq: response.data.data.seq,
            };
            
            $scope.editMode = true;
        });
    }
});


sideBar('activity');