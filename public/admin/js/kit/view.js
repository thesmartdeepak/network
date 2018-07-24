app.controller('ctrl', function($scope, $http,$filter) {
    $scope.currentPage = 1;
    $scope.projects = [];
    $scope.startPage = 1;
    $scope.pageCount = "25";
   // $scope.pagination = null;

    $scope.kitList = function(page){

        let submitData = $scope.submitData();

        $http({
            method:'post',
            url:'/allKit?page='+page,
            data:submitData,
            headers: {
                'authorization': localStorage.token
            }
        }).then(function(response){
            $scope.kits = response.data.data;
        });
    }

    $scope.currentIndex = function(index){
        return ($scope.currentPage-1)*parseInt($scope.pageCount)+index;
    }
     $scope.submitData = function(){
        let dataToFind = {
            fromDate: $("#fromDate").val(),
            toDate: $("#toDate").val(),
            pageCount:parseInt($scope.pageCount),
            filter:{}
        };

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
            url:'/allKit?type=count',
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
                        $scope.kitList(page);
                    }
                });
            }
            else{
                $scope.kits = [];
            }
        });
    }

    $scope.setPagination();
  
    $scope.toUcFirst = function(oldTxt){
        return oldTxt.charAt(0).toUpperCase()+oldTxt.slice(1);
    }

    $scope.deleteProject = function(projectId){
        if(confirm('Do you want to delete?')){
            $http({
                method:'post',
                url:'/deleteProject',
                data:{projectId:projectId},
                headers: {
                    'authorization': localStorage.token
                }
            }).then(function(response){
                alertBox('Deleted successfully','success');
                if($scope.projects.length > 1){
                    $scope.kitList($scope.currentPage);
                }
                else{
                    $('#pagination').twbsPagination('destroy');
                    $scope.startPage = $scope.currentPage-1;
                    $scope.setPagination();
                }
            });
        }
    }

    $scope.exportTable = function(){
        let submitData = $scope.submitData();

        $http({
            method:'post',
            url:'/allKit?type=download&pageType=project',
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
   

    $scope.downloadDemoFile = function(){
        window.location.href = "/public/demoFiles/kitDemo.xlsx";
    }
});

$(".sidebar-mini").addClass("sidebar-collapse");


$("body").on('click','tr.dataRow',function() {
    $(".highlight").not(this).removeClass("highlight");
    $(this).toggleClass("highlight");
});

$('#fromDate').datepicker({
    autoclose: true,
    maxDate: "+0D"
}).datepicker("setDate", new Date()).datepicker("option","dateFormat","dd/MM/yy");

$('#toDate').datepicker({
    autoclose: true
}).datepicker("setDate", new Date()).datepicker("option","dateFormat","dd/MM/yy");

$('#searchPreDoneDate').datepicker({
    autoclose: true
});

$('#searchPostDoneDate').datepicker({
    autoclose: true
});



sideBar('kit');