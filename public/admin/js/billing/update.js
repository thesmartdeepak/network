$("#addProjectForm").validate();


app.controller('ctrl', function($scope, $http) {
    $scope.submit = function () {
        
        if($("#addProjectForm").valid()){
            var submitUrl = "/updateBilling";

            var formdata = new FormData();
            
            var file_data = $('#excelFile')[0].files;
            for (var i = 0; i < file_data.length; i++) {
                formdata.append("excelFile", file_data[i]);
            }
            
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
                        window.location.href = "/view-billing";
                    },1000);
                }
                else{
                    alertBox(response.data.msg,'danger');
                }
            });
        }
    };
});

sideBar('billing');