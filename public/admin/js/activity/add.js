$("#addActivityForm").validate();

app.controller('ctrl', function($scope, $http) {
    $scope.defaultClient = {
        _id:"",
        name:"Select a client"
    };
    $scope.formData = {
        name:"",
        description: "",
        clientId:""
    };
  
    $scope.submit = function () {
        $scope.formData.clientId = $("#clintList").val();
        console.log($scope.formData.clientId);
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
                name:response.data.data.oneActivity.name,
                description: response.data.data.oneActivity.description
            };
            $scope.defaultClient = response.data.data.clientOne;

            $scope.editMode = true;
        });
    }
});

$('#clintList').select2({
    ajax: {
        url: '/totalClintList',
        headers: {
            'authorization': localStorage.token
        }
    },
    placeholder: "Select a Co-ordinator"
});


sideBar('activity');