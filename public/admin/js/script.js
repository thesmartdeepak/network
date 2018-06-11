var app = angular.module("App",[]);

app.controller('headerSidebarCtrl', function($scope) {
    $scope.name = localStorage.fullname;
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
    $("."+sideBarClass+" .treeview-menu").show();
}

function manageAccess(){
   setTimeout(function(){
        if(localStorage.userType == 'admin' || localStorage.userType == 'manager'){
            $(".mangerAdminAccess").css('display','block');
        }
        else if(localStorage.userType == 'co-ordinator'){
            $(".coOrdinatorAccess").show();
        }
   },100);
}

manageAccess();

$( document ).ajaxComplete(function() {
    manageAccess();
    alert(1);
});