$("#addProjectForm").validate();


app.controller('ctrl', function($scope, $http) {
    $scope.submit = function () {
        
        if($("#addProjectForm").valid()){
            var submitUrl = "/addProjectGeneral";

            var formdata = new FormData();
            
            var file_data = $('#excelFile')[0].files;
            for (var i = 0; i < file_data.length; i++) {
               formdata.append("excelFile", file_data[i]);
            }
           formdata.append('operatorId',$scope.operatorId);
           formdata.append('operatorName',$("#operator option:selected").text());

           formdata.append('coordinatorId',$scope.CoordinatorId);

           formdata.append('percentage',$("#percentage option:selected").text());
            
            $http({
                method: 'POST',
                url: submitUrl,
                data:formdata,
                headers: {
                    'authorization': localStorage.token,
                    'Content-Type': undefined
                },
            }).then(function(response){
                console.log("response",response);
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
    
      $scope.downloadDemoFile = function(){
        window.location.href = "/public/demoFiles/network.xlsx";
    }
    
    $scope.reUpload = function(){
        $("#addFileSection").slideDown();
        $("#errorTbl").slideUp();
    }

    $scope.reUpload();

    $scope.errorClass = function(errorList,type){
        if(errorList.indexOf(type) != -1){
            return 'text-danger';
        }
    }

    
$scope.getDepartment = function(){
        $http({
            method:'get',
            url:'/alldepartment',
            headers: {
                'authorization': localStorage.token
            },
        }).then(function(response){
             $scope.departments = response.data.data;
        });
    }

    $scope.getDepartment();

//  $scope.getProjectType = function(){
//         $http({
//             method:'get',
//             url:'/getProjectType',
//             headers: {
//                 'authorization': localStorage.token
//             },
//         }).then(function(response){
//            $scope.projectTypes = response.data.data;
//         });
//     }

//     $scope.getProjectType();

    $scope.getProjectCode = function(){
        $http({
            method:'get',
            url:'/getallCircle',
            headers: {
                'authorization': localStorage.token
            },
        }).then(function(response){
           $scope.projectCodes = response.data.data;
        });
    }

    $scope.getProjectCode();

    $scope.filloperator = function(optId)
    {
        $http({
                method:'post',
                url:'/getOperator',
                data:{userId:optId},
                headers: {
                    'authorization': localStorage.token
                },
            }).then(function(response){
                $scope.operators = response.data.data.operator;
            });
        
    }
    
    
    $scope.getLoggedinUser = function(){
        $http({
            method:'get',
            url:'/alloperator',
            headers: {
                'authorization': localStorage.token
            },
        }).then(function(response){
             $scope.operators = response.data.data;
        });
    }

    $scope.getLoggedinUser();

    $scope.getCoordinator = function(){
        $http({
            method:'get',
            url:'/getAllCoordinator',
            headers: {
                'authorization': localStorage.token
            },
        }).then(function(response){
             $scope.coordinators = response.data.data;
        });
    }

    $scope.getCoordinator();

});

sideBar('project');