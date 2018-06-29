var app = angular.module("App",[]);

app.controller('headerSidebarCtrl', function($scope) {
    $scope.name = localStorage.fullname;
    $scope.userType = (localStorage.userType[0]).toUpperCase()+localStorage.userType.slice(1);
});

angular.module('App').factory('httpInterceptor', ['$q', '$rootScope',
    function ($q, $rootScope) {
        var loadingCount = 0;
        return {
            response: function (response) {
                manageAccess();
                return response;
            }
        };
    }
]).config(['$httpProvider', function ($httpProvider) {
    $httpProvider.interceptors.push('httpInterceptor');
}]);

function alertBox(alertTxt,alertType){
    var alertClass = 'alert-'+alertType;

    if(alertType == 'success'){
        $("#alertIcon i").attr("class",'icon fa fa-check');
        $("#alertIcon span").text("Success");
    }
    else{
        $("#alertIcon i").attr("class",'icon fa fa-ban');
        $("#alertIcon span").text("Alert!");
    }

    $("#alertBox").addClass(alertClass);
    $("#alertTxt").text(alertTxt);
    $("#alertBox").fadeIn();

    setTimeout(function(){
        $("#alertBox").fadeOut();
        $("#alertBox").removeClass(alertClass);
    },2000);
}

function sideBar(sideBarName){
    let sideBarClass = sideBarName+"SideBar";
    $("."+sideBarClass).addClass('menu-open');
    $("."+sideBarClass+" .treeview-menu:first").show();
}


function manageAccess(){
    
    setTimeout(function(){
        $(".mangerAdminAccess").hide();
        $(".coOrdinatorAccess").hide();
        $(".mangerAdmincoOrdinatorAccess").hide();
        $(".billingAdminAccess").hide();
        
        if(localStorage.userType == 'admin' || localStorage.userType == 'manager'){
            $(".mangerAdminAccess").show();
        }
        if(localStorage.userType == 'co-ordinator'){
            $(".coOrdinatorAccess").show();
        }
        if(localStorage.userType == 'co-ordinator' || localStorage.userType == 'admin' || localStorage.userType == 'manager'){
            $(".mangerAdmincoOrdinatorAccess").show();
            
        }
        if(localStorage.userType=='admin' || localStorage.userType=='billing-admin'){
            $(".billingAdminAccess").show();
        }
        
    },100);
}

manageAccess();

$( document ).ajaxComplete(function() {
    manageAccess();
});