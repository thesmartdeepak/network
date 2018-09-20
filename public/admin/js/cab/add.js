$("#addCabForm").validate();

app.controller('ctrl',function($scope,$http)
{
    $scope.submit = function () {
        
        if($("#addCabForm").valid()){
            var submitUrl = "/addCab";


            var formdata = new FormData();
            
            var file_data = $('#excelFile')[0].files;
            for (var i = 0; i < file_data.length; i++) {
                formdata.append("excelFile", file_data[i]);
            }

              
            $http({
                method: 'post',
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
                        window.location.href = "/view-cab";
                    },1000);
                }
                else{
                    alertBox(response.data.msg,'danger');
                    $scope.errorDataList = response.data.err;
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

});

sideBar('cab');