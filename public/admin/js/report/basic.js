app.controller('ctrl', function($scope, $http) {
    $scope.circleClient = [];
    $scope.circleName = {};
    $scope.getReport = function(){
        $http({
            method:'get',
            url:'/getBasicReport',
            headers: {
                'authorization': localStorage.token
            }
        }).then(function(response){
            let responseData = response.data.data;
            let list = {};
            for(x in responseData.circleClient){
                if(!list[responseData.circleClient[x]['_id']['circleCode']]){
                    list[responseData.circleClient[x]['_id']['circleCode']] = {};
                }
                
                list[responseData.circleClient[x]['_id']['circleCode']][responseData.circleClient[x]._id.operator] = {
                    "_id":responseData.circleClient[x]._id.clientId,
                    "operator":responseData.circleClient[x]._id.operator,
                    "totalCount":responseData.circleClient[x].count,
                    "curruntCount":0
                };
            }

            for(x in responseData.circleClientCurrentMonth){
                if(!list[responseData.circleClientCurrentMonth[x]['_id']['circleCode']]){
                    list[responseData.circleClientCurrentMonth[x]['_id']['circleCode']] = {};
                }
                
                if(list[responseData.circleClientCurrentMonth[x]['_id']['circleCode']][responseData.circleClientCurrentMonth[x]._id.operator]){
                    list[responseData.circleClientCurrentMonth[x]['_id']['circleCode']][responseData.circleClientCurrentMonth[x]._id.operator]["curruntCount"] = responseData.circleClientCurrentMonth[x].count;
                }
                else{
                    list[responseData.circleClientCurrentMonth[x]['_id']['circleCode']][responseData.circleClientCurrentMonth[x]._id.operator] = {
                        "_id":responseData.circleClientCurrentMonth[x]._id.clientId,
                        "operator":responseData.circleClientCurrentMonth[x]._id.operator,
                        "curruntCount":responseData.circleClientCurrentMonth[x].count,
                        "totalCount":0
                    };
                }
            }



            $scope.circleClient = list;

            for(x in responseData.circle){
                $scope.circleName[responseData.circle[x].code] = responseData.circle[x].name;
            }

            $scope.clients = {};
            for(x in responseData.client){
                let row = responseData.client[x];
                row['currentCount'] = 0;
                $scope.clients[responseData.client[x]._id] = row;
            }

            for(x in responseData.clientCurrentMonth){
                if($scope.clients[responseData.clientCurrentMonth[x]._id]){
                    $scope.clients[responseData.clientCurrentMonth[x]._id]['currentCount'] = responseData.clientCurrentMonth[x].count;
                }
                else{
                    let row = responseData.clientCurrentMonth[x];
                    row['currentCount'] = responseData.clientCurrentMonth[x].count;
                    row['count'] = 0;
                    $scope.clients[responseData.clientCurrentMonth[x]._id] = row;
                }
                
            }

            let departmentProejctType = {};
            for(x in responseData.departmentProjectType){
                let row = responseData.departmentProjectType[x];
                if(!departmentProejctType[row._id.departmentName]){
                    departmentProejctType[row._id.departmentName] = {};
                }
                row['currentCount'] = 0;
                departmentProejctType[row._id.departmentName][row._id.projectTypeName] = row;
            }

            for(x in responseData.departmentProjectTypeCurrentMonth){
                let row = responseData.departmentProjectTypeCurrentMonth[x];
                departmentProejctType[row._id.departmentName][row._id.projectTypeName]['currentCount'] = row.count;
            }

            $scope.departmentProejctType = departmentProejctType;
        });
    }
    

    $scope.circleCountFromClient = function(clientList,type){
        let totalSite = 0;
        for(x in clientList){
            if(type=='current'){
                totalSite += clientList[x].curruntCount;
            }
            else{
                totalSite += clientList[x].totalCount;
            }
            
        }

        return totalSite;
    }

    $scope.generalCountFromChild = function(clientList,type){
        let totalSite = 0;
        for(x in clientList){
            if(type=='current'){
                totalSite += clientList[x].currentCount;
            }
            else{
                totalSite += clientList[x].count;
            }
            
        }
        return totalSite;
    }

    $scope.getReport();

    $scope.objectCount = function(obj){
        let count = 0;
        for(x in obj){
            count++;
        }
        return count;
    }

});


sideBar('reporting');