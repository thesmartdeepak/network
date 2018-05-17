$("#addUserForm").validate();

app.controller('ctrl', function($scope, $http) {

    $scope.formData = {
        // image:'',
        fullname:'',
        email: "",
        password: "",
        userType:'co-ordinator',
        address:'',
        city:'',
        state:'',
        pincode:'',
        phone:''
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
                email: response.data.data.email,
                password: '******',
                userType:response.data.data.userType,
                address:response.data.data.address,
                city:response.data.data.city,
                state:response.data.data.state,
                pincode:response.data.data.pincode,
                phone:response.data.data.phone,
            };
            
            $scope.editMode = true;
        });
    }

    $scope.toUcFirst = function(oldTxt){
        return oldTxt.charAt(0).toUpperCase()+oldTxt.slice(1);
    }

});


sideBar('user');