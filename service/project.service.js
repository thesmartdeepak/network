/**
 * @file(project.service.js) All service realted to project  
 * @author Shakshi Pandey <shakshi.kumari@limitlessmobile.com>
 * @version 1.0.0
 * @lastModifed 5-Feb-2018
 * @lastModifedBy Shakshi
 */

import Project from '../models/project.model'
import logger from '../core/logger/app.logger'
import successMsg from '../core/message/success.msg'
import msg from '../core/message/error.msg.js'
import path from 'path';
import xlsx from 'node-xlsx';
import fs from 'fs';
/**
 * [service is a object ]
 * @type {Object}
 */

const service = {};


let projectMapDb = {
    "Project_Code": "projectCode",
    "Operator": "operator",
    "Activity": "activity",
    "Item_Description_Band": "itemDescription_Band",
    "Site_Id": "siteId",
    "Site_Count": "siteCount",
    "Pre_Done_Month": "preDoneMonth",
    "Pre_Done_Date": "preDoneDate",
    "Post_Activity_Done_Month": "post_ActivityDoneMonth",
    "Post_Activity_Done_Date": "post_ActivityDoneDate",
    "Coordinator_Remark": "coordinatorRemark",
    "Coordinator_Status": "coordinatorStatus",
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
    "Project_Status": "projectStatus"
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
    "concaeenate",
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

    let excelFile = req.files.excelFile;

    let fileExt = excelFile.name.split('.').pop();

    if(fileExt == 'xlx' || fileExt == 'xlsx'){
        let fileName = (String (new Date()))+"_"+(Math.random())+"."+fileExt;
        
        let path = 'public/uploads/csv/'+fileName;
        let outFile = 'public/uploads/csv/'+(String (new Date()))+"_"+(Math.random())+'.csv';

        await excelFile.mv(path, function(err) {
            const obj = xlsx.parse(path);
            const sheet = obj[0]; 
            let data = sheet['data'];
            // var header = sheet['data'][0];
            data.splice(0,1);
            let rows = [];
            data.forEach(function(rst,indx){
                if(rst[1]){
                    let row = {};
                    projectDbHeader.forEach(function(result,index){
                        if(rst[index+1]){
                            row[result] = rst[index+1];
                        }
                        else{
                            row[result] = '';
                        }
                    });
                    row['projectStatus'] = "active";
                    row['createAt'] = new Date();
                    row['updatedAt'] = new Date();
                    rows.push(row);
                }
            });

            
            const addProject = Project.addMultiProject(rows);
            
            res.send({"success":true, "code":"200", "msg":successMsg.addProject});
        });
        
    }
    else{
        res.send({"success":false, "code":"200", "msg":msg.addProject});
    }
}

service.editProject = async (req,res) => {
    let editProjectData = {
        name:req.body.name,
        poNumber:req.body.poNumber,
        shipmentNo:req.body.shipmentNo,
        projectCode:req.body.projectCode,
        contactPerson:req.body.contactPerson,
        contactPersonNo:req.body.contactPersonNo,
        contactAddress:req.body.contactAddress,
        updatedAt: new Date()
    }

    let editToProject = {
        query:{_id:req.query.projectId},
        set:{"$set":editProjectData}
    }
    
    const editProject = await project.editProject(editToProject);

    try{
        res.send({"success":true, "code":"200", "msg":successMsg.editProject,"data":editProject});
    }
    catch(err) {
        res.send({"success":false, "code":"500", "msg":msg.editProject,"err":err});
    }
}

service.oneProject = async (req,res) => {
    let projectToFind = {
        query: {_id:req.query.projectId},
        projection:{}
    }

    const oneProject = await Project.getOneproject(projectToFind);
    res.send({"success":true,"code":200,"msg":successMsg.getOneProject,"data":oneProject});
}

service.allProject = async (req,res) => {
    let projectToFind = {
        query:{status:{$ne:'deleted'}},
        projection:{},
        limit:10,
        skip:(req.query.page-1)*10
    }

    const allProject = await Project.projectPagination(projectToFind);
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


export default service;