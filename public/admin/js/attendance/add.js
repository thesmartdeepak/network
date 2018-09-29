$("#addAttendanceForm").validate();
$("#addAttendanceForm_Monthly").validate();

app.controller('ctrl',function($scope,$http)
{
    $scope.submit = function () {
        
        if($("#addAttendanceForm").valid()){
            var submitUrl = "/addAttendance";


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
                        window.location.href = "/view-tracking-sheet";
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

     $scope.downloadDemoFile = function(){
        window.location.href = "/public/demoFiles/attendance.xlsx";
    }

    $scope.reUpload = function(){
        $("#addFileSection").slideDown();
        $("#errorTbl").slideUp();
    }

    $scope.errorClass = function(errorList,type){
        if(errorList.indexOf(type) != -1){
            return 'text-danger';
        }
    }
 
    /*------------------Monthly Sheet Section--------------------------------*/ 
      $scope.downloadDemoFile_Monthly = function(){
        window.location.href = "/public/demoFiles/attendanceMonthly.xlsx";
    }


     $scope.submit_monthly = function () {
        if($("#addAttendanceForm_Monthly").valid()){
            var submitUrl = "/addAttendanceMonthly";
            var formdata = new FormData();          
            var file_data = $('#excelFileM')[0].files;
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
                        window.location.href = "/view-tracking-monthly";
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

});

sideBar('attendance');