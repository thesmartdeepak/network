app.controller('ctrl', function($scope, $http,$filter) {
    $scope.currentPage = 1;
    $scope.projects = [];
    $scope.startPage = 1;
    $scope.pageCount = "25";
   // $scope.pagination = null;

    $scope.vendorList = function(page){  
        let submitData = $scope.submitData();
        
        $http({
            method:'post',
            url:'/allAttendanceMonthly?page='+page,
            data:submitData,
            headers: {
                'authorization': localStorage.token
            }
        }).then(function(response){
            $scope.attendances = response.data.data;
            // console.log(" $scope.attendances", $scope.attendances);
        });
    }

    $scope.currentIndex = function(index){
        return ($scope.currentPage-1)*parseInt($scope.pageCount)+index;
    }
     $scope.submitData = function(){
        let dataToFind = {
            year: $("#year").val(),
            month: $("#month").val(),
            pageCount:parseInt($scope.pageCount),
            filter:{}
        };
        // console.log("dataToFind",dataToFind);

        $(".filterData").each(function(){
            
            if($(this).val()){
                let name = $(this).attr('name');
                let value = $(this).val();
                dataToFind.filter[name] = value;
            }
        });

        return dataToFind;
    }



    $scope.resetPagination = function(){
        $('#pagination').twbsPagination('destroy');
        $scope.startPage = 1;
        $scope.setPagination();
    }

    $(".dateFilter").change(function(){
        $scope.resetPagination();
    });


    $(".filterData").change(function(){
        $scope.resetPagination();
    });

    $(".filterData").keyup(function(){
        $scope.resetPagination();
    });

    $scope.setPagination = function(){
        let submitData = $scope.submitData();
        $http({
            method:'post',
            url:'/allAttendanceMonthly?type=count',
            data:submitData,
            headers: {
                'authorization': localStorage.token
            }
        }).then(function(response){
            let count = response.data.data;

            let totalPage = Math.ceil(count/parseInt($scope.pageCount));
            if(totalPage > 0){
                
                $scope.pagination = $('#pagination').twbsPagination({
                    totalPages: totalPage,
                    visiblePages:3,
                    startPage:$scope.startPage,
                    onPageClick: function (event, page) {
                        $scope.currentPage = page;
                        $scope.vendorList(page);
                    }
                });
            }
            else{
                $scope.attendances = [];
            }
        });
    }

    $scope.setPagination();
  
    $scope.toUcFirst = function(oldTxt){
        return oldTxt.charAt(0).toUpperCase()+oldTxt.slice(1);
    }

    $scope.exportTable = function(){
        let submitData = $scope.submitData();

        $http({
            method:'post',
            url:'/allAttendanceMonthly?type=download',
            data:submitData,
            headers: {
                'authorization': localStorage.token,
             },
        }).then(function(response){
            // var blob = new Blob([response.data], {type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"});
            // var objectUrl = URL.createObjectURL(blob);
            // window.open(objectUrl)
            
            // console.log(response);
            window.location.href = response.data;
        });
    }

    $scope.activityStatusList = [];
    $scope.remarkList = [];
    $scope.reportStatusList = [];
    $scope.reportAcceptanceStatusList = [];
    $scope.clientRemarkList = [];
   

    // $scope.downloadDemoFile = function(){
    //     window.location.href = "/public/demoFiles/attendance.xlsx";
    // }
});

$(".sidebar-mini").addClass("sidebar-collapse");


$("body").on('click','tr.dataRow',function() {
    $(".highlight").not(this).removeClass("highlight");
    $(this).toggleClass("highlight");
});



$('#month').datepicker({
    autoclose: true,
    format: "MM",
    viewMode: "months", 
    minViewMode: "months"
});

$('#year').datepicker({
    autoclose: true,
    format: "yyyy",
    viewMode: "years", 
    minViewMode: "years"
});


$('#searchPreDoneDate').datepicker({
    autoclose: true
});

$('#searchPostDoneDate').datepicker({
    autoclose: true
});

$('#date').datepicker({
    autoclose:true,
    maxDate: "+0D"
})

sideBar('attendance');