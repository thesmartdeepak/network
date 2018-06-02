var app = angular.module("App",[]);

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