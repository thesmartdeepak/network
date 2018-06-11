/**
 * @file(project.service.js) All service realted to project  
 * @author Shakshi Pandey <shakshi.kumari@limitlessmobile.com>
 * @version 1.0.0
 * @lastModifed 5-Feb-2018
 * @lastModifedBy Shakshi
 */

import Project from '../models/project.model';
import Activity from '../models/activity.model';
import User from '../models/user.model';
import Circle from '../models/circle.model';
import Client from '../models/client.model';
import logger from '../core/logger/app.logger';
import successMsg from '../core/message/success.msg';
import msg from '../core/message/error.msg.js';
import path from 'path';
import xlsx from 'node-xlsx';
import fs from 'fs';
import jwt from 'jsonwebtoken';
import projectModel from '../models/project.model';
const { getJsDateFromExcel } = require('excel-date-to-js');
import mongoose from 'mongoose';

/**
 * [service is a object ]
 * @type {Object}
 */

const service = {};


let projectMapDb = {
    "Project_Code": "projectCode",
    "Operator": "operator",
    "Activity_Description": "activity",
    "Item_Description_Band": "itemDescription_Band",
    "Site_Id": "siteId",
    "Site_Count": "siteCount",
    "Pre_Done_Month": "preDoneMonth",
    "Pre_Done_Date": "preDoneDate",
    "Post_Activity_Done_Month": "post_ActivityDoneMonth",
    "Post_Activity_Done_Date": "post_ActivityDoneDate",
    "Activity_Status": "activityStatus",
    "Remarks": "remark",
    "Report_Status": "reportStatus",
    "Report_Acceptance_Status": "reportAcceptanceStatus",
    "Client_Remark": "clientRemark",
    "Concatenate": "concatenate",
    "Attempt_Cycle": "attemptCycle",
    "Employee_Id": "employeeId",
    "Employee_Name": "employeeName",
    "Po_Number": "poNumber",
    "Shippment_No": "shippmentNo",
    "L1_Approval": "l1Approval",
    "L2_Approval": "l2Approval",
    "Po_Value": "poValue",
    "Start_Time": "startTime",
    "End_Time": "endTime",
    "Advance": "advance",
    "Approved": "approved",
}

let projectDbHeader = [
    "projectCode",
    "operator",
    "activity",
    "itemDescription_Band",
    "siteId",
    "siteCount",
    "preDoneMonth",
    "preDoneDate",
    "post_ActivityDoneMonth",
    "post_ActivityDoneDate",
    "coordinatorStatus",
    "coordinatorRemark",
    "reportStatus",
    "reportAcceptanceStatus",
    "clientRemark",
    "concatenate",
    "attemptCycle",
    "employeeId",
    "employeeName",
    "poNumber",
    "shippmentNo",
    "l1Approval",
    "l2Approval",
    "poValue",
    "startTime",
    "endTime",
    "advance",
    "approved"
];
 
service.addProject = async (req,res) =>{

    const coOrdinatorData = req.user;

    const circleToFind = {
        query:{clientCircleCode: coOrdinatorData.projectCode},
        projection:{clientId:1}
    };
    const coOrdinatorCircle = await Circle.getOneCircle(circleToFind);

    const clientToFind = {
        query:{_id: coOrdinatorCircle.clientId},
        projection:{name:1}
    };
    const coOrdinatorClient = await Client.getOneClient(clientToFind);


    let excelFile = req.files.excelFile;

    let fileExt = excelFile.name.split('.').pop();

    if(fileExt == 'xlx' || fileExt == 'xlsx'){
        let fileName = (String (new Date()))+"_"+(Math.random())+"."+fileExt;
        
        let path = 'public/uploads/csv/'+fileName;
        let outFile = 'public/uploads/csv/'+(String (new Date()))+"_"+(Math.random())+'.csv';
        
        const obj = xlsx.parse(excelFile.data);
        const sheet = obj[0]; 
        let data = sheet['data'];
        
        let header = data.splice(0,1)[0];
        
        let rowHeaders = {};
        
        header.forEach(function(value,index){
            if(projectMapDb[value.trim()]){
                rowHeaders[index] = projectMapDb[value.trim()];
            }
        });
        
        let rows = [];
        let goodData = true;
        let errorList = [];
        let k = 0;
        
        for(k in data){
            let goodRow = true;
            let errorRow = [];

            let rst = data[k];
            let index = k;
            
            let row = {};


            for(index in rowHeaders){
                if(rst[index]){
                    row[rowHeaders[index]] = (rst[index]+"").trim();
                }
                else{
                    row[rowHeaders[index]] = '';
                }
            }
            
            row['projectStatus'] = "active";
            row['createAt'] = new Date();
            row['updatedAt'] = new Date();
            row['userId'] = coOrdinatorData._id;
            row['userName'] = coOrdinatorData.fullname;
            if(row['preDoneDate'])
                row['preDoneDate'] = getJsDateFromExcel(row['preDoneDate']);
            if(row['post_ActivityDoneDate'])
                row['post_ActivityDoneDate'] = getJsDateFromExcel(row['post_ActivityDoneDate']);
            
            row['departmentId'] = coOrdinatorData.departmentId;
            row['departmentName'] = coOrdinatorData.departmentName;
            row['projectTypeId'] = coOrdinatorData.projectTypeId;
            row['projectTypeName'] = coOrdinatorData.projectTypeName;
            row['projectCode'] = coOrdinatorData.projectCode;
            row['operator'] = coOrdinatorClient.name;

            /* Activity check */
            const activityToFind = {
                query:{description: row['activity']},
                projection:{}
            };
            const activityDescription = await Activity.getOneActivity(activityToFind);
            
            if(!activityDescription){
                goodRow = false;
                errorList.push({
                    index:(parseInt(k))+1,
                    key:"Activity_Description",
                    error:"Not found in activity list in database."
                });
                
            }
            
            /* /Activity check */

            /* Employee check */
            const employeeToFind = {employeeId: row['employeeId']};

            const userData = await User.getOne(employeeToFind);
            
            if(!userData){
                goodRow = false;
                errorList.push({
                    index:(parseInt(k))+1,
                    key:"Employee_Id",
                    error:"Not found in user list in database."
                });
                // errorRow.push('employeeId');
            }
            /* /Employee check */
            
            if(!goodRow){
                goodData = false;
                // errorList.push(
                //     {
                //         errors:errorRow,
                //         data:row
                //     }
                // );
            }


            if(goodData){
                row['activityId'] = activityDescription._id;
                row['activity'] = activityDescription.name;
                row['itemDescription_Band'] = activityDescription.description;
                row['employeeName'] = userData.fullname;

                row['concatenate'] = row['siteId']+"-"+row['itemDescription_Band']+"-"+row['activity'];
                let projectToFind = {
                    query:{status:{$ne:'deleted'},concatenate:row['concatenate']}
                }
                const allProjectCount = await Project.allProjectCount(projectToFind);
    
                row['attemptCycle'] = "C"+(allProjectCount+1);

                rows.push(row);
            }
        }
        if(goodData){
            let x = 0;
            for(x in rows){

                let projectToFind = {
                    query:{$and:[{status:{$ne:'deleted'}},{concatenate:rows[x]['concatenate']}]},
                }
                const allProjectCount = await Project.allProjectCount(projectToFind);
    
                rows[x]['attemptCycle'] = "C"+(allProjectCount+1);
                if(!rows[x]['post_ActivityDoneDate']){
                    rows[x]['activityStatus'] = "Partial Done";
                }
                else{
                    rows[x]['activityStatus'] = "Done";
                }
                
                if(allProjectCount > 0){
                    const editToProject = {
                        query:{$and:[{status:{$ne:'deleted'}},{concatenate:rows[x]['concatenate']}]},
                        set:rows[x]
                    }
                    const updateProject = await Project.editProject(editToProject);
                }
                else{
                    const addToProject = Project(rows[x]);
                    await Project.addProject(addToProject);
                }

                
            }
            res.send({"success":true, "code":"200", "msg":successMsg.addProject});
        }
        else{
            res.send({"success":false, "code":"200", "msg":msg.addProject,data:errorList});
        }
        
    }
    else{
        res.send({"success":false, "code":"200", "msg":msg.addProject});
    }
}

// service.editProject = async (req,res) => {
//     let editProjectData = {
//         name:req.body.name,
//         poNumber:req.body.poNumber,
//         shipmentNo:req.body.shipmentNo,
//         projectCode:req.body.projectCode,
//         contactPerson:req.body.contactPerson,
//         contactPersonNo:req.body.contactPersonNo,
//         contactAddress:req.body.contactAddress,
//         updatedAt: new Date()
//     }

//     let editToProject = {
//         query:{_id:req.query.projectId},
//         set:{"$set":editProjectData}
//     }
    
//     const editProject = await project.editProject(editToProject);

//     try{
//         res.send({"success":true, "code":"200", "msg":successMsg.editProject,"data":editProject});
//     }
//     catch(err) {
//         res.send({"success":false, "code":"500", "msg":msg.editProject,"err":err});
//     }
// }

service.oneProject = async (req,res) => {
    let projectToFind = {
        query: {_id:req.query.projectId},
        projection:{}
    }

    const oneProject = await Project.getOneproject(projectToFind);
    res.send({"success":true,"code":200,"msg":successMsg.getOneProject,"data":oneProject});
}

service.allProject = async (req,res) => {
    var toDate = new Date(req.body.toDate);
    toDate.setDate(toDate.getDate() + 1);

    let query = [
                {status:{$ne:'deleted'}},
                {
                    createAt: {
                        $gte: new Date(req.body.fromDate),
                        $lte: toDate
                    }
                }
            ]

    if(req.body.filter){
        let x = '';
        for(x in req.body.filter){
            let rowQuery = {};
            if(x == 'preDoneDate' || x=='post_ActivityDoneDate'){
                var searchDate = new Date(req.body.filter[x]);
                searchDate.setDate(searchDate.getDate() + 1);

                rowQuery[x] = {
                    $gte:new Date(req.body.filter[x]),
                    $lte:searchDate,
                };
            }
            else{
                rowQuery[x] = new RegExp(req.body.filter[x],'i');
            }
            
            query.push(rowQuery);
        }
    }

    
    const userDecoded = jwt.verify(req.headers.authorization, 'shhhhh');
    if(userDecoded.userType != 'admin'){
        let rowQuery = {userId:mongoose.Types.ObjectId(userDecoded._id)};
        query.push(rowQuery);
    }

    let projectToFind = {
        query:{$and:query},
        limit:req.body.pageCount,
        skip:(req.query.page-1)*req.body.pageCount
    }

    // console.log(projectToFind);

    let listType = 'list';
    if(req.query.type || req.query.type == 'count'){
        listType = 'count';
    }

    const allProject = await Project.projectPagination(projectToFind,listType);

    res.send({"success":true,"code":200,"msg":successMsg.allProject,"data":allProject});
}

service.allProjectCount = async(req,res) => {
    let projectToFind = {
        query:{status:{$ne:'deleted'}},
        projection:{}
    }

    const allProjectCount = await Project.allProjectCount(projectToFind);
    res.send({"success":true,"code":200,"msg":successMsg.allProject,"data":allProjectCount});
}

service.deleteProject = async(req,res) => {
    let projectEdit={
        status: 'deleted',
        updatedAt: new Date()
    }
    let projectToEdit={
        query:{"_id":req.body.projectId},
        set:{"$set":projectEdit}
    };
    try{
        const editProject= await Project.editProject(projectToEdit);
        res.send({"success":true,"code":200,"msg":successMsg.deleteProject,"data":editProject});

    }
    catch(err){
        res.send({"success":false, "code":"500", "msg":msg.deleteProject,"err":err});
    }
}

service.changeStatusRemark = async(req,res) => {
    let type = req.body.type;
    let set = {};
    set[type] = req.body.value;
    let projectScatusRemarkUpdate = {
        query:{_id:req.body.id},
        set:{"$set":set}
    };
    try{
        await projectModel.editProject(projectScatusRemarkUpdate);
        res.send({"success":true,"code":200,"msg":successMsg.editStatusRemark,"data":""});
    }
    catch(err){
        res.send({"success":false, "code":"500", "msg":msg.editStatusRemark,"err":err});
    }
}

export default service;