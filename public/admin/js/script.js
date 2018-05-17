var app = angular.module("App",[]);

function alertBox(alertTxt,alertType){
    var alertClass = 'alert-'+alertType;
    $("#alertBox").addClass(alertClass);
    $("#alertTxt").text(alertTxt);
    $("#alertBox").slideDown();

    setTimeout(function(){
        $("#alertBox").slideUp();
        $("#alertBox").removeClass(alertClass);
    },2000);
}

function sideBar(sideBarName){
    let sideBarClass = sideBarName+"SideBar";
    $("."+sideBarClass).addClass('menu-open');
    $("."+sideBarClass+" .treeview-menu").show();
}