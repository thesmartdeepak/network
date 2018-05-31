$("#addprojecttypeForm").validate();

app.controller('ctrl', function($scope, $http) {
    $scope.defaultdepartmentName = {
        _id:"",
        name:"Select a Department"
    };
    $scope.formData = {
        name:"",
        departmentId:"",
     };
  
    $scope.submit = function () {
        $scope.formData.departmentId = $("#departmentNameList").val();
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
            $scope.defaultdepartmentName = response.data.data.departmentOne;
            $scope.editMode = true;
        });
    }
});

$('#departmentNameList').select2({
    ajax: {
        url: '/totaldepartmentList',
        headers: {
            'authorization': localStorage.token
        }
    },
    placeholder: "Select a Co-ordinator"
});
sideBar('projecttype');