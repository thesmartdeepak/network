$("#addclaimAdvanceForm").validate();
$("#addclaimMonthlyForm").validate();

app.controller('ctrl',function($scope,$http)
{
    $scope.submit = function () {
        if($("#addclaimAdvanceForm").valid()){
            var submitUrl = "/addclaimAdvance";


            var formdata = new FormData();
            
            var file_data = $('#excelFile')[0].files;
            // console.log("file_data",file_data);
            for (var i = 0; i < file_data.length; i++) {
                formdata.append("excelFile", file_data[i]);
// console.log("formdata",formdata);
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
                        window.location.href = "/view-claim-Advance";
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
        window.location.href = "/public/demoFiles/claimAdvance.xlsx";
    }

    $scope.reUpload = function(){
        $("#addFileSection").slideDown();
        $("#addFileSectionM").slideDown();
        $("#errorTbl").slideUp();
    }

    $scope.errorClass = function(errorList,type){
        if(errorList.indexOf(type) != -1){
            return 'text-danger';
        }
    }

     /*-------------Monthly Basis Sheet-------------------------------------------------*/ 
     $scope.downloadDemoFile_monthely = function(){
        window.location.href = "/public/demoFiles/claimMonthly.xlsx";
    }
 
    $scope.submit_monthly = function () {
        if($("#addclaimMonthlyForm").valid()){
            var submitUrl = "/addclaimMonthly";


            var formdata = new FormData();
            
            var file_data = $('#excelFilem')[0].files;
            console.log("file_data",file_data);
            for (var i = 0; i < file_data.length; i++) {
                formdata.append("excelFile", file_data[i]);
            }

             console.log("formdata",formdata);
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
                        window.location.href = "/view-claim-Monthly";
                    },1000);
                }
                else{
                    alertBox(response.data.msg,'danger');
                    $scope.errorDataList = response.data.err;
                    $("#addFileSection").slideUp();
                    $("#addFileSectionM").slideUp();
                    $('#dailyadvance').hide();
                    $("#errorTbl").slideDown();
                }
            });
        }
    };
    




});

sideBar('claimAdvance');