app.controller('ctrl', function($scope, $http,$filter) {
    $scope.currentPage = 1;
    $scope.projects = [];
    $scope.startPage = 1;
    $scope.pageCount = "25";
   // $scope.pagination = null;

    $scope.projectList = function(page){

        let submitData = $scope.submitData();

        $http({
            method:'post',
            url:'/allProject?page='+page+'&pageType=project',
            data:submitData,
            headers: {
                'authorization': localStorage.token
            }
        }).then(function(response){
            $scope.projects = response.data.data;
        });
    }

    $scope.currentIndex = function(index){
        return ($scope.currentPage-1)*parseInt($scope.pageCount)+index;
    }

    // let fromToDate = {
    //     fromDate: new Date(),
    //     toDate: new Date(),
    // };operatorId

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
            url:'/allProject?type=count&pageType=project',
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
                        $scope.projectList(page);
                    }
                });
            }
            else{
                $scope.projects = [];
            }
        });
    }

    $scope.setPagination();
    $scope.getLoggedinUser = function(){
        $http({
            method:'get',
            url:'/alloperator',
            headers: {
                'authorization': localStorage.token
            },
        }).then(function(response){
             $scope.operators = response.data.data;
        });
    }
    
    $scope.getLoggedinUser();
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
                    $scope.projectList($scope.currentPage);
                }
                else{
                    $('#pagination').twbsPagination('destroy');
                    $scope.startPage = $scope.currentPage-1;
                    $scope.setPagination();
                }
            });
        }
    }

    $scope.coOrdinatorName = function(users){
        let coOrdinatorName = "";
        users.forEach(function(value,index){
            coOrdinatorName = value.fullname;
        });
        return coOrdinatorName;
    }

    $scope.exportTable = function(){
        let submitData = $scope.submitData();

        $http({
            method:'post',
            url:'/allProject?type=download&pageType=project',
            data:submitData,
            headers: {
                'authorization': localStorage.token,
                // 'Content-type': 'application/json'
            },
            // responseType: 'arraybuffer'
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
    $scope.statusRemark = function(){
        $http({
            method:'GET',
            url:'/allStatusRemark',
            headers: {
                'authorization': localStorage.token
            }
        }).then(function(response){
            response.data.data.forEach(function(value,index){
                
                if(value.type=='activityStatus'){
                    $scope.activityStatusList.push(value);
                }
                else if(value.type=='remark'){
                    $scope.remarkList.push(value);
                }
                else if(value.type=='reportStatus'){
                    $scope.reportStatusList.push(value);
                }
                else if(value.type=='reportAcceptanceStatus'){
                    $scope.reportAcceptanceStatusList.push(value);
                }
                else if(value.type=='clientRemark'){
                    $scope.clientRemarkList.push(value);
                }

                
            });
            
        });
    }

    $scope.statusRemark();

    $("body").on('click','.statusRemarkTr1',function(){
        $(".statusRemarkTr2").removeClass('statusRemarkTr2').addClass('statusRemarkTr1');
        $(this).removeClass('statusRemarkTr1').addClass('statusRemarkTr2');
    });

    $("body").on('change','.statusRemarkSelect',function(){
        
        var type = $(this).data('type');
        var value = $(this).val();
        var id = $(this).data('id');
        
        $http({
            method:'POST',
            url:'/changeStatusRemark',
            data:{type:type,value:value,id:id},
            headers: {
                'authorization': localStorage.token
            }
        }).then(function(response){
            if(response.data.success)
                alertBox(response.data.msg,'success');
            else
                alertBox(response.data.msg,'danger');
        });
        
        $(this).parents('.statusRemarkTr2').find('.statusRemarkTxt').text(value);
        setTimeout(function(){
            $(".statusRemarkTr2").removeClass('statusRemarkTr2').addClass('statusRemarkTr1');
        },1000);
        
    });

    $scope.statusRemarkSelected = function(value1,value2){
        if(value1.trim()==value2.trim()){
            return true;
        }
        else{
            return false;
        }
    }

    $scope.downloadDemoFile = function(){
        window.location.href = "/public/demoFiles/network.xlsx";
    }
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



sideBar('project');