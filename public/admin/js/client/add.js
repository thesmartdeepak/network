$("#addclientForm").validate();

app.controller('ctrl', function($scope, $http) {

    $scope.formData = {
        name:"",
        ponumber: "",
        shipmentno: "",
        clientcode: "",
        contactperson: "",
        contactpersonNo: "",
        contactaddress: "",
    };
  
    $scope.submit = function () {
        if($("#addclientForm").valid()){
            var submitUrl = "/addclient";
            if(window.location.search){
                submitUrl = "/editclient"+window.location.search;
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
                        window.location.href = "/view-Client";
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
            url: '/oneclient'+window.location.search,
            data:$scope.formData,
            headers: {
                'authorization': localStorage.token
            },
        }).then(function(response){
            $scope.formData = {
                name:response.data.data.name,
                ponumber:response.data.data.ponumber,
                shipmentno:response.data.data.shipmentno,
                clientcode:response.data.data.clientcode,
                contactperson:response.data.data.contactperson,
                contactpersonNo:response.data.data.contactpersonNo,
                contactaddress:response.data.data.contactaddress,
            };
            
            $scope.editMode = true;
        });
    }
});


sideBar('client');