app.controller('ctrl', function($scope, $http) {
    $scope.currentPage = 1;
    $scope.projects = [];
    $scope.startPage = 1;
    $scope.pagination = null;
    $scope.projectList = function(page){
        $http({
            method:'get',
            url:'/allProject?page='+page,
            headers: {
                'authorization': localStorage.token
            }
        }).then(function(response){
            $scope.projects = response.data.data;
        });
    }
    
    $scope.setPagination = function(){
        $scope.projectList(1);
        // $http({
        //     method:'get',
        //     url:'/allProjectCount',
        //     headers: {
        //         'authorization': localStorage.token
        //     }
        // }).then(function(response){
        //     let totalPage = Math.ceil(response.data.data/10);
        //     if(totalPage > 0){
                
        //         $scope.pagination = $('#pagination').twbsPagination({
        //             totalPages: totalPage,
        //             visiblePages:3,
        //             startPage:$scope.startPage,
        //             onPageClick: function (event, page) {
        //                 $scope.currentPage = page;
        //                 $scope.projectList(page);
        //             }
        //         });
        //     }
        //     else{
        //         $scope.projects = [];
        //     }
        // });
    }

    $scope.setPagination();

    $scope.toUcFirst = function(oldTxt){
        return oldTxt.charAt(0).toUpperCase()+oldTxt.slice(1);
    }

    $scope.deleteProject = function(projectId){
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
                $scope.projectList($scope.currentPage);
            }
            else{
                $('#pagination').twbsPagination('destroy');
                $scope.startPage = $scope.currentPage-1;
                $scope.setPagination();
            }
        });
    }

    $scope.coOrdinatorName = function(users){
        let coOrdinatorName = "";
        users.forEach(function(value,index){
            coOrdinatorName = value.fullname;
        });
        return coOrdinatorName;
    }

    $scope.import = function(){
        $("#excelFile").click();
    }

    $scope.exportTable = function(){
        let alphaRow = $(".alphaRow");
        $(".alphaRow").remove();
        $("#mainTable").tableToCSV();
        $("#mainTable").prepend(alphaRow);
    }

    $scope.statusRemark = function(){
        $http({
            method:'GET',
            url:'/allStatusRemark',
            headers: {
                'authorization': localStorage.token
            }
        }).then(function(response){
            response.data.data.forEach(function(value,index){
                if(value.type='activityStatus'){
                    console.log(value.statusRemark);
                }
            });
        });
    }

    $scope.statusRemark();
});

$('#coOrdinatorList').select2({
    ajax: {
        url: '/totalCoOrdinatorList',
        headers: {
            'authorization': localStorage.token
        }
    },
    placeholder: "Select a Co-ordinator"
});


$(".sidebar-mini").addClass("sidebar-collapse");


$("body").on('click','tr.dataRow',function() {
    $(".highlight").not(this).removeClass("highlight");
    $(this).toggleClass("highlight");
});


// $(function(){
//     $("#export").click(function(){
//         let alphaRow = $(".alphaRow");
//         $(".alphaRow").remove();
//         $("#mainTable").tableToCSV();
//         $("#mainTable").prepend(alphaRow);
//     });
// });
sideBar('project');