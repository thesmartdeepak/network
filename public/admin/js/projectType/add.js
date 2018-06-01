$("#addProjectTypeForm").validate();

app.controller('ctrl', function($scope, $http) {
    $scope.defaultDepartmentName = {
        _id:"",
        name:"Select a Department"
    };
    $scope.formData = {
        name:"",
        departmentId:"",
     };
  
    $scope.submit = function () {
        $scope.formData.departmentId = $("#departmentNameList").val();
        if($("#addProjectTypeForm").valid()){
            var submitUrl = "/addProjectType";
            if(window.location.search){
                submitUrl = "/editProjectType"+window.location.search;
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
                        window.location.href = "/project-type";
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
            url: '/oneProjectType'+window.location.search,
            data:$scope.formData,
            headers: {
                'authorization': localStorage.token
            },
        }).then(function(response){
            $scope.formData = {
                name:response.data.data.oneProjectType.name,
            };
            $scope.defaultDepartmentName = response.data.data.oneDepartment;
            
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
sideBar('projectType');