$("#addProjectForm").validate();


app.controller('ctrl', function($scope, $http) {

    $scope.submit = function () {
        if($("#addProjectForm").valid()){
            var submitUrl = "/addProject";
            if(window.location.search){
                submitUrl = "/editProject"+window.location.search;
            }

            var formdata = new FormData();
            
            var file_data = $('#excelFile')[0].files;
            for (var i = 0; i < file_data.length; i++) {
                formdata.append("excelFile", file_data[i]);
            }
            formdata.append('departmentId',$scope.departmentModel);
            formdata.append('projectTypeId',$scope.projectTypeModel);
            
            $http({
                method: 'POST',
                url: submitUrl,
                data:formdata,
                headers: {
                    'authorization': localStorage.token,
                    'Content-Type': undefined
                },
            }).then(function(response){
                if (response.data.success){
                    alertBox(response.data.msg,'success');
                    setTimeout(function(){
                        window.location.href = "/view-project";
                    },1000);
                }
                else{
                    alertBox(response.data.msg,'danger');
                    $scope.errorDataList = response.data.data;
                    $("#addFileSection").slideUp();
                    $("#errorTbl").slideDown();
                }
            });
        }
    };

    $scope.reUpload = function(){
        $("#addFileSection").slideDown();
        $("#errorTbl").slideUp();
    }

    $scope.errorClass = function(errorList,type){
        if(errorList.indexOf(type) != -1){
            return 'text-danger';
        }
    }

    if(window.location.search){
        $http({
            method: 'get',
            url: '/oneProject'+window.location.search,
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

sideBar('project');