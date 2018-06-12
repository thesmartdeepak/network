$("#addUserForm").validate();

app.controller('ctrl', function($scope, $http) {
    if(window.location.search){
        $scope.editMode = true;
    }
    $scope.defaultProjectCode = {
        _id:"",
        name:"Select a project code"
    };

    $scope.userTypes = [];

    $scope.formData = {
        // image:'',
        fullname:'',
        employeeId:'',
        email: "",
        password: "",
        userType:'',
        projectCode:"",
        address:'',
        city:'',
        state:'',
        pincode:'',
        phone:'',
        lat:'',
        long:''
    };
  
    $scope.getMasterData = function(){
        $http({
            method: 'POST',
            url: '/addUserRequiredData',
            headers: {
                'authorization': localStorage.token
            },
        }).then(function(response){
          
            response.data.data.forEach(function(value,index){
                if(localStorage.userType == 'admin' && value.userType == 'manager'){
                    $scope.userTypes.push(value);
                }
                else if(localStorage.userType == 'manager' && value.userType != 'manager'){
                    $scope.userTypes.push(value);
                }
            });

            if(localStorage.userType == 'admin'){
                $scope.formData.userType = 'manager';
                $scope.getDepartment();
            }
            else if(localStorage.userType == 'manager'){
                $scope.formData.userType = 'co-ordinator';
                $scope.getProjectType();
            }
        });
    }
    $scope.getMasterData();

    $scope.getProjectType = function(){
        $http({
            method:'post',
            url:'/projectTypeByDepartment',
            data:{departmentId:localStorage.departmentId},
            headers: {
                'authorization': localStorage.token
            },
        }).then(function(response){
            $scope.projectTypes = response.data.data;
            if($scope.projectTypes && !$scope.editMode){
                $scope.formData.projectType = $scope.projectTypes[0]._id;
            }
        });
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
            if($scope.departments && !$scope.editMode){
                $scope.formData.department = $scope.departments[0]._id;
            }
        });
    }

    $scope.submit = function () {
        $scope.formData.projectCode = $("#projectCodeList").val();
        $scope.formData.departmentName = $("#department option:selected").text();
        $scope.formData.projectTypeName = $("#projectType option:selected").text();
        if($("#addUserForm").valid()){
            var submitUrl = "/addUser";
            if(window.location.search){
                submitUrl = "editUser"+window.location.search;
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
                        window.location.href = "/view-users";
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
            url: '/oneUser'+window.location.search,
            data:$scope.formData,
            headers: {
                'authorization': localStorage.token
            },
        }).then(function(response){
            $scope.formData = {
                // image:'',
                fullname:response.data.data.fullname,
                employeeId:response.data.data.employeeId,
                email: response.data.data.email,
                password: '******',
                userType:response.data.data.userType,
                // defaultProjectCode:response.data.data.projectCode,
                address:response.data.data.address,
                city:response.data.data.city,
                state:response.data.data.state,
                pincode:response.data.data.pincode,
                phone:response.data.data.phone,
                lat:response.data.data.lat,
                long:response.data.data.long,
                department:response.data.data.departmentId,
                projectType:response.data.data.projectTypeId
            };

            $scope.defaultProjectCode = {
                _id:response.data.data.projectCode,
                name:response.data.data.projectCode
            };
        });
    }

    $scope.toUcFirst = function(oldTxt){
        return oldTxt.charAt(0).toUpperCase()+oldTxt.slice(1);
    }
});

$('#projectCodeList').select2({
    ajax: {
        url: '/totalProjectCodeList',
        headers: {
            'authorization': localStorage.token
        }
    }
});

sideBar('user');