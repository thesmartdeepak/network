$("#addCircleForm").validate();


app.controller('ctrl', function($scope, $http) {

    $scope.formData = {
        name:"",
        description: "",
        code: "",
        clientId:"",
    };

    $scope.getMasterData = function(){
        $http({
            method: 'get',
            url: '/addCircleRequiredData',
            headers: {
                'authorization': localStorage.token
            },
        }).then(function(response){
          $scope.regions = response.data.msg.regions;
        });
    }
    $scope.getMasterData();

    $scope.submit = function () {
        $scope.formData.clientId = $("#clintList").val();

        if($("#addCircleForm").valid()){
            var submitUrl = "/addCircle";
            if(window.location.search){
                submitUrl = "/editCircle"+window.location.search;
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
                        window.location.href = "/view-circle";
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
            url: '/oneCircle'+window.location.search,
            data:$scope.formData,
            headers: {
                'authorization': localStorage.token
            },
        }).then(function(response){
            $scope.formData = {
                name:response.data.data.name,
                description: response.data.data.description,
                code: response.data.data.code,
                clientId:response.data.data.clientId,
            };
            
            $scope.editMode = true;
        });
    }
});

$('#clintList').select2({
    ajax: {
        url: '/totalClintList',
        headers: {
            'authorization': localStorage.token
        },
    }
});

sideBar('circle');