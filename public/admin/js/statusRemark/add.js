$("#addStatusRemarkForm").validate();

app.controller('ctrl', function($scope, $http) {

    $scope.formData = {
        statusRemark:'',
        type:''
    };


    $scope.submit = function () {
        if($("#addStatusRemarkForm").valid()){
            var submitUrl = "/addStatusRemark";
            if(window.location.search){
                submitUrl = "/editStatusRemark"+window.location.search;
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
                        window.location.href = "/status-remark";
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
            url: '/oneStatusRemark'+window.location.search,
            data:$scope.formData,
            headers: {
                'authorization': localStorage.token
            },
        }).then(function(response){
            $scope.formData = {
                statusRemark:response.data.data.statusRemark,
                type:response.data.data.type,
            };
            
            $scope.editMode = true;
        });
    }

    $scope.toUcFirst = function(oldTxt){
        return oldTxt.charAt(0).toUpperCase()+oldTxt.slice(1);
    }

});


sideBar('statusRemark');