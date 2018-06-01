$("#addUserForm").validate();

app.controller('ctrl', function($scope, $http) {
    $scope.defaultProjectCode = {
        _id:"",
        name:"Select a project code"
    };
   $scope.formData = {
        // image:'',
        fullname:'',
        employeeId:'',
        email: "",
        password: "",
        userType:'co-ordinator',
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
          $scope.userTypes = response.data.msg;
        });
    }
    $scope.getMasterData();

    $scope.submit = function () {
        $scope.formData.projectCode = $("#projectCodeList").val();
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
                long:response.data.data.long
            };

            $scope.defaultProjectCode = {
                _id:response.data.data.projectCode,
                name:response.data.data.projectCode
            };

            $scope.editMode = true;
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
    },
    placeholder: "Select a Co-ordinator"
});

sideBar('user');