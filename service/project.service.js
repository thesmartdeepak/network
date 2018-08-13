/**
 * @file(project.service.js) All service realted to project  
 * @author Shakshi Pandey <shakshi.kumari@limitlessmobile.com>
 * @version 1.0.0
 * @lastModifed 5-Feb-2018
 * @lastModifedBy Shakshi
 */

import Project from '../models/project.model';
import ProjectHistory from '../models/projectHistory.model';
import Activity from '../models/activity.model';
import User from '../models/user.model';
import Circle from '../models/circle.model';
import Client from '../models/client.model';
import successMsg from '../core/message/success.msg';
import msg from '../core/message/error.msg.js';
import xlsx from 'node-xlsx';
const { getJsDateFromExcel } = require('excel-date-to-js');
import mongoose from 'mongoose';
var Excel = require('exceljs');

/**
 * [service is a object ]
 * @type {Object}
 */

const service = {};


let projectMapDb = {
    "Project_Code": "projectCode",
    "Client_Name": "clientName",
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
    "PO_Number": "poNumber",
    "PO_Amount": "poAmount",
    "Shippment_No": "shippmentNo",
    "ESAR_On_SCS": "esarOnScs",
    "PAC_On_SCS": "pacOnScs",
    "WCC_Status": "wccStatus",
    "GRN_IA_Status": "grn_iaStatus",
    "Invoice_Status": "invoiceStatus",
    "L1_Approval": "l1Approval",
    "L2_Approval": "l2Approval",
    "Start_Time": "startTime",
    "End_Time": "endTime",
    "Advance": "advance",
    "Approved": "approved",
    "Operator_Id": "operatorId",
    "Operator_Name": "operatorName",
    "Co_ordinator": "userName",
}

service.addProject = async (req, res) => {

    const coOrdinatorData = req.user;

    const circleToFind = {
        query: { clientCircleCode: coOrdinatorData.projectCode },
        projection: { clientId: 1, code: 1, regionId: 1 }
    };
    const coOrdinatorCircle = await Circle.getOneCircle(circleToFind);

    const clientToFind = {
        query: { _id: coOrdinatorCircle.clientId },
        projection: { name: 1 }
    };
    const coOrdinatorClient = await Client.getOneClient(clientToFind);


    let excelFile = req.files.excelFile;

    let fileExt = excelFile.name.split('.').pop();

    if (fileExt == 'xlx' || fileExt == 'xlsx') {

        const obj = xlsx.parse(excelFile.data);
        const sheet = obj[0];
        let data = sheet['data'];

        let header = data.splice(0, 1)[0];

        let rowHeaders = {};

        header.forEach(function (value, index) {
            if (projectMapDb[value.trim()]) {
                rowHeaders[index] = projectMapDb[value.trim()];
            }
        });

        let rows = [];
        let goodData = true;
        let errorList = [];
        let k = 0;

        for (k in data) {
            let goodRow = true;

            let rst = data[k];
            let index = k;

            let row = {};


            for (index in rowHeaders) {
                if (rst[index]) {
                    row[rowHeaders[index]] = (rst[index] + "").trim();
                }
                else {
                    row[rowHeaders[index]] = '';
                }
            }

            row['projectStatus'] = "active";

            row['updatedAt'] = new Date();
            row['userId'] = coOrdinatorData._id;
            row['userName'] = coOrdinatorData.fullname;
            if (row['preDoneDate'])
                row['preDoneDate'] = getJsDateFromExcel(row['preDoneDate']);
            if (row['post_ActivityDoneDate'])
                row['post_ActivityDoneDate'] = getJsDateFromExcel(row['post_ActivityDoneDate']);

            row['departmentId'] = coOrdinatorData.departmentId;
            row['departmentName'] = coOrdinatorData.departmentName;
            row['projectTypeId'] = coOrdinatorData.projectTypeId;
            row['projectTypeName'] = coOrdinatorData.projectTypeName;
            row['projectCode'] = coOrdinatorData.projectCode;
            row['clientName'] = coOrdinatorClient.name;
            row['circleId'] = coOrdinatorCircle._id;
            row['circleCode'] = coOrdinatorCircle.code;
            row['regionId'] = coOrdinatorCircle.regionId;
            row['clientId'] = coOrdinatorCircle.clientId;
            row['operatorId'] = req.body.operatorId;
            row['operatorName'] = req.body.operatorName;


            /* Activity check */
            const activityToFind = {
                query: { description: row['activity'] },
                projection: {}
            };
            const activityDescription = await Activity.getOneActivity(activityToFind);

            if (!activityDescription) {
                goodRow = false;
                errorList.push({
                    index: (parseInt(k)) + 1,
                    key: "Activity_Description",
                    error: "Not found in activity list in database."
                });

            }

            /* /Activity check */

            /* Employee check */
            const employeeToFind = { employeeId: row['employeeId'] };

            const userData = await User.getOne(employeeToFind);

            if (!userData) {
                goodRow = false;
                errorList.push({
                    index: (parseInt(k)) + 1,
                    key: "Employee_Id",
                    error: "Not found in user list in database."
                });
                // errorRow.push('employeeId');
            }
            /* /Employee check */

            if (!goodRow) {
                goodData = false;
                // errorList.push(
                //     {
                //         errors:errorRow,
                //         data:row
                //     }
                // );
            }


            if (goodData) {
                row['activityId'] = activityDescription._id;
                row['activity'] = activityDescription.name;
                row['itemDescription_Band'] = activityDescription.description;
                row['employeeName'] = userData.fullname;

                row['concatenate'] = row['siteId'] + "-" + row['itemDescription_Band'] + "-" + row['activity'];
                row['managerId'] = coOrdinatorData.parentUserId;
                // let projectToFind = {
                //     query:{status:{$ne:'deleted'},concatenate:row['concatenate']}
                // }
                // const allProjectCount = await Project.allProjectCount(projectToFind);

                // row['attemptCycle'] = "C"+(allProjectCount+1);

                rows.push(row);
            }
        }
        if (goodData) {
            let x = 0;
            for (x in rows) {

                let projectToFind = {
                    query: { $and: [{ status: { $ne: 'deleted' } }, { concatenate: rows[x]['concatenate'] }] },
                }
                const allProjectCount = await Project.allProjectCount(projectToFind);

                rows[x]['attemptCycle'] = "C" + (allProjectCount + 1);
                if (!rows[x]['post_ActivityDoneDate']) {
                    rows[x]['activityStatus'] = "Partial Done";
                    rows[x]['percentage'] = req.body.percentage;
                }
                else {
                    rows[x]['activityStatus'] = "Done";
                    rows[x]['percentage'] = 100;
                }

                if (allProjectCount > 0) {
                    const editToProject = {
                        query: { $and: [{ status: { $ne: 'deleted' } }, { concatenate: rows[x]['concatenate'] }] },
                        set: rows[x]
                    }
                    await Project.editProject(editToProject);
                }
                else {
                    rows[x]['createdAt'] = new Date();
                    const addToProject = Project(rows[x]);
                    await Project.addProject(addToProject);
                }
            }

            res.send({ "success": true, "code": "200", "msg": successMsg.addProject });
        }
        else {
            res.send({ "success": false, "code": "200", "msg": msg.addProject, data: errorList });
        }

    }
    else {
        res.send({ "success": false, "code": "200", "msg": msg.addProject });
    }
}

service.addProjectGeneral = async (req, res) => {

    let userToFind = {
        '_id': req.body.coordinatorId
    };
    const coOrdinatorData = await User.getOne(userToFind);


    const circleToFind = {
        query: { clientCircleCode: coOrdinatorData.projectCode },
        projection: { clientId: 1, code: 1, regionId: 1 }
    };
    const coOrdinatorCircle = await Circle.getOneCircle(circleToFind);

    const clientToFind = {
        query: { _id: coOrdinatorCircle.clientId },
        projection: { name: 1 }
    };
    const coOrdinatorClient = await Client.getOneClient(clientToFind);

    let excelFile = req.files.excelFile;

    let fileExt = excelFile.name.split('.').pop();

    if (fileExt == 'xlx' || fileExt == 'xlsx') {

        const obj = xlsx.parse(excelFile.data);
        const sheet = obj[0];
        let data = sheet['data'];

        let header = data.splice(0, 1)[0];

        let rowHeaders = {};

        header.forEach(function (value, index) {
            if (projectMapDb[value.trim()]) {
                rowHeaders[index] = projectMapDb[value.trim()];
            }
        });

        let rows = [];
        let goodData = true;
        let errorList = [];
        let k = 0;

        for (k in data) {
            let goodRow = true;

            let rst = data[k];
            let index = k;

            let row = {};


            for (index in rowHeaders) {
                if (rst[index]) {
                    row[rowHeaders[index]] = (rst[index] + "").trim();
                }
                else {
                    row[rowHeaders[index]] = '';
                }
            }

            row['projectStatus'] = "active";

            row['updatedAt'] = new Date();
            row['userId'] = coOrdinatorData._id;
            row['userName'] = coOrdinatorData.fullname;
            if (row['preDoneDate'])
                row['preDoneDate'] = getJsDateFromExcel(row['preDoneDate']);
            if (row['post_ActivityDoneDate'])
                row['post_ActivityDoneDate'] = getJsDateFromExcel(row['post_ActivityDoneDate']);

            row['departmentId'] = coOrdinatorData.departmentId;
            row['departmentName'] = coOrdinatorData.departmentName;
            row['projectTypeId'] = coOrdinatorData.projectTypeId;
            row['projectTypeName'] = coOrdinatorData.projectTypeName;
            row['projectCode'] = coOrdinatorData.projectCode;
            row['clientName'] = coOrdinatorClient.name;
            row['circleId'] = coOrdinatorCircle._id;
            row['circleCode'] = coOrdinatorCircle.code;
            row['regionId'] = coOrdinatorCircle.regionId;
            row['clientId'] = coOrdinatorCircle.clientId;
            row['operatorId'] = req.body.operatorId;
            row['operatorName'] = req.body.operatorName;
            row['selectedPercentage'] = req.body.percentage;


            /* Activity check */
            const activityToFind = {
                query: { description: row['activity'] },
                projection: {}
            };
            const activityDescription = await Activity.getOneActivity(activityToFind);

            if (!activityDescription) {
                goodRow = false;
                errorList.push({
                    index: (parseInt(k)) + 1,
                    key: "Activity_Description",
                    error: "Not found in activity list in database."
                });

            }

            /* /Activity check */

            /* Employee check */
            const employeeToFind = { employeeId: row['employeeId'] };

            const userData = await User.getOne(employeeToFind);

            if (!userData) {
                goodRow = false;
                errorList.push({
                    index: (parseInt(k)) + 1,
                    key: "Employee_Id",
                    error: "Not found in user list in database."
                });
                // errorRow.push('employeeId');
            }
            /* /Employee check */

            if (!goodRow) {
                goodData = false;
                // errorList.push(
                //     {
                //         errors:errorRow,
                //         data:row
                //     }
                // );
            }


            if (goodData) {
                row['activityId'] = activityDescription._id;
                row['activity'] = activityDescription.name;
                row['itemDescription_Band'] = activityDescription.description;
                row['employeeName'] = userData.fullname;

                row['concatenate'] = row['siteId'] + "-" + row['itemDescription_Band'] + "-" + row['activity'];
                row['managerId'] = coOrdinatorData.parentUserId;
                // let projectToFind = {
                //     query:{status:{$ne:'deleted'},concatenate:row['concatenate']}
                // }
                // const allProjectCount = await Project.allProjectCount(projectToFind);

                // row['attemptCycle'] = "C"+(allProjectCount+1);

                rows.push(row);
            }
        }
        if (goodData) {
            let x = 0;
            for (x in rows) {

                let projectToFind = {
                    query: { $and: [{ status: { $ne: 'deleted' } }, { concatenate: rows[x]['concatenate'] }] },
                }
                const allProjectCount = await Project.allProjectCount(projectToFind);

                rows[x]['attemptCycle'] = "C" + (allProjectCount + 1);
                if (!rows[x]['post_ActivityDoneDate']) {
                    rows[x]['activityStatus'] = "Partial Done";
                    rows[x]['percentage'] = req.body.percentage;
                }
                else {
                    rows[x]['activityStatus'] = "Done";
                    rows[x]['percentage'] = 100;
                }

                let inserted_project = {};
                if (allProjectCount > 0) {
                    const editToProject = {
                        query: { $and: [{ status: { $ne: 'deleted' } }, { concatenate: rows[x]['concatenate'] }] },
                        set: rows[x]
                    }
                    await Project.editProject(editToProject);
                    let findProjectToLog = {
                        query: {}, projection: {}
                    };
                    // inserted_project = await Project.getOneProject(findProjectToLog);
                }
                else {
                    rows[x]['createdAt'] = new Date();
                    const addToProject = Project(rows[x]);
                    inserted_project = await Project.addProject(addToProject);
                }
                // let inserted_project1 = Object(inserted_project);
                // inserted_project1['refProjectId'] = inserted_project['_id'];
                // inserted_project1['createdAt'] = new Date();
                // delete inserted_project1['_id'];
                // console.log(inserted_project1);
                // // console.log(inserted_project);
                // const projectHistoryData = inserted_project;

                // let dd = await ProjectHistory.addProject(projectHistoryData);

            }
            res.send({ "success": true, "code": "200", "msg": successMsg.addProject });
        }
        else {
            res.send({ "success": false, "code": "200", "msg": msg.addProject, data: errorList });
        }

    }
    else {
        res.send({ "success": false, "code": "200", "msg": msg.addProject });
    }
}


service.oneProject = async (req, res) => {
    let projectToFind = {
        query: { _id: req.query.projectId },
        projection: {}
    }

    const oneProject = await Project.getOneproject(projectToFind);
    res.send({ "success": true, "code": 200, "msg": successMsg.getOneProject, "data": oneProject });
}


service.allProject = async (req, res) => {
    var toDate = new Date(req.body.toDate);
    toDate.setDate(toDate.getDate() + 1);

    // let query = [
    //                 {status:{$ne:'deleted'}},
    //                 {
    //                     createdAt: {
    //                         $gte: new Date(req.body.fromDate),
    //                         $lte: toDate
    //                     }
    //                 }
    //         ]

   // db.inventory.find( { $or: [ { quantity: { $lt: 20 } }, { price: 10 } ] } )
    let query = [
        { status: { $ne: 'deleted' } },
        {$or:[
        
           { preDoneDate: {
                $gte: new Date(req.body.fromDate),
                $lte: toDate
            }},
           { post_ActivityDoneDate: {
                $gte: new Date(req.body.fromDate),
                $lte: toDate
            }}
        ]},
    ]

    if (req.body.filter) {
        let x = '';
        for (x in req.body.filter) {
            let rowQuery = {};
            if (x == 'preDoneDate' || x == 'post_ActivityDoneDate') {
                var searchDate = new Date(req.body.filter[x]);
                searchDate.setDate(searchDate.getDate() + 1);

                rowQuery[x] = {
                    $gte: new Date(req.body.filter[x]),
                    $lte: searchDate,
                };
            }
            else if (x == 'poAmount') {
                rowQuery[x] = req.body.filter[x];
            }
            else if (x == 'operatorId') {
                rowQuery[x] = req.body.filter[x];
            }
            else {
                rowQuery[x] = new RegExp(req.body.filter[x], 'i');
            }

            query.push(rowQuery);
        }
    }


    const userDecoded = req.user;
    if (userDecoded.userType != 'admin' && userDecoded.userType != 'billing-admin') {
        if (userDecoded.userType == 'manager') {
            let rowQuery = { managerId: mongoose.Types.ObjectId(userDecoded._id) };
            query.push(rowQuery);
        }
        else {
            let rowQuery = { userId: mongoose.Types.ObjectId(userDecoded._id) };
            query.push(rowQuery);
        }
    }

    if (req.query.pageType == 'billing') {
        let rowQuery = { reportAcceptanceStatus: "Accepted" };
        query.push(rowQuery);

        if (req.body.showBillType == 'blank') {
            query.push({ poNumber: null });
            query.push({ shippmentNo: null });
            query.push({ esarOnScs: null });
            query.push({ pacOnScs: null });
            query.push({ wccStatus: null });
            query.push({ grn_iaStatus: null });
            query.push({ invoiceStatus: null });
        }
    }

    let projectToFind = {
        query: { $and: query },
        limit: req.body.pageCount,
        skip: (req.query.page - 1) * req.body.pageCount
    }

    let listType = 'list';
    if (req.query.type && req.query.type == 'count') {
        listType = 'count';
    }
    else if (req.query.type && req.query.type == 'download') {
        listType = 'download';
    }

    const allProject = await Project.projectPagination(projectToFind, listType);

    if (req.query.type && req.query.type == 'download') {

        var workbook = new Excel.Workbook();
        var worksheet = workbook.addWorksheet('Input');

        if (req.query.pageType == 'billing') {
            worksheet.columns = [
                { header: 'Sr. No.', key: 'srNo', width: 10 },
                { header: 'Project_Code', key: 'projectCode', width: 10 },
                { header: 'Client_Name', key: 'clientName', width: 10 },
                { header: 'Activity', key: 'activity', width: 10 },
                { header: 'Site_Id', key: 'siteId', width: 10 },
                { header: 'Client_Remark', key: 'clientRemark', width: 10 },
                { header: 'PO_Amount', key: 'poAmount', width: 10 },
                { header: 'Concatenate', key: 'concatenate', width: 50 },
                { header: 'PO_Number', key: 'poNumber', width: 10 },
                { header: 'Shippment_No', key: 'shippmentNo', width: 10 },
                { header: 'ESAR_On_SCS', key: 'esarOnScs', width: 10 },
                { header: 'PAC_On_SCS', key: 'pacOnScs', width: 10 },
                { header: 'WCC_Status', key: 'wccStatus', width: 10 },
                { header: 'GRN_IA_Status', key: 'grn_iaStatus', width: 10 },
                { header: 'Invoice_Status', key: 'invoiceStatus', width: 10 },
            ];
        }
        else {
            worksheet.columns = [
                { header: 'Sr. No.', key: 'srNo', width: 10 },
                { header: 'Project_Code', key: 'projectCode', width: 10 },
                { header: 'Client_Name', key: 'clientName', width: 10 },
                { header: 'Activity', key: 'activity', width: 10 },
                { header: 'Item_Description_Band', key: 'itemDescription_Band', width: 25 },
                { header: 'Site_Id', key: 'siteId', width: 10 },
                { header: 'Site_Count', key: 'siteCount', width: 10 },
                { header: 'Pre_Done_Date', key: 'preDoneDate', width: 15 },
                { header: 'Post_Activity_Done_Date', key: 'post_ActivityDoneDate', width: 15 },
                { header: 'Activity_Status', key: 'activityStatus', width: 10 },
                { header: 'Remark', key: 'remark', width: 10 },
                { header: 'Report_Status', key: 'reportStatus', width: 10 },
                { header: 'Report_Acceptance_Status', key: 'reportAcceptanceStatus', width: 10 },
                { header: 'Client_Remark', key: 'clientRemark', width: 10 },
                { header: 'Concatenate', key: 'concatenate', width: 50 },
                { header: 'Attempt_Cycle', key: 'attemptCycle', width: 10 },
                { header: 'Employee_Id', key: 'employeeId', width: 10 },
                { header: 'Employee_Name', key: 'employeeName', width: 20 },
                { header: 'PO_Amount', key: 'poAmount', width: 10 },
                { header: 'Co_Ordinator', key: 'userName', width: 20 },
                { header: 'Operator', key: 'operatorName', width: 20 }
            ];
        }

        let x = null;
        for (x in allProject) {
            let rowDownloadData = allProject[x];
            rowDownloadData['srNo'] = parseInt(x) + 1;
            worksheet.addRow(rowDownloadData);
        }

        var filePath = "public/uploads/excel/" + userDecoded._id + ".xlsx"
        workbook.xlsx.writeFile(filePath).then(function () {
            res.send(filePath);
        });
    }
    else {
        res.send({ "success": true, "code": 200, "msg": successMsg.allProject, "data": allProject });
    }


}

service.allProjectCount = async (req, res) => {
    let projectToFind = {
        query: { status: { $ne: 'deleted' } },
        projection: {}
    }

    const allProjectCount = await Project.allProjectCount(projectToFind);
    res.send({ "success": true, "code": 200, "msg": successMsg.allProject, "data": allProjectCount });
}

service.deleteProject = async (req, res) => {
    let projectEdit = {
        status: 'deleted',
        updatedAt: new Date()
    }
    let projectToEdit = {
        query: { "_id": req.body.projectId },
        set: { "$set": projectEdit }
    };
    try {
        const editProject = await Project.editProject(projectToEdit);
        res.send({ "success": true, "code": 200, "msg": successMsg.deleteProject, "data": editProject });

    }
    catch (err) {
        res.send({ "success": false, "code": "500", "msg": msg.deleteProject, "err": err });
    }
}

service.changeStatusRemark = async (req, res) => {
    let set = {};
    let projectToFind = {
        query: { _id: req.body.id },
        projection: {}
    }

    const oneProject = await Project.getOneProject(projectToFind);
    if(req.body.type == "activityStatus"){
        if(req.body.value == "Done"){
            set = {  post_ActivityDoneDate:  new Date()};
        }
    }
    if(req.body.type == "reportAcceptanceStatus")
    if (req.body.value == "Accepted") {
        set = { percentage: 100,
         };
    }
    else if (req.body.value == "Rejected") {
        set = { percentage: oneProject.selectedPercentage };
    }
    let type = req.body.type;
    set[type] = req.body.value;
    let projectScatusRemarkUpdate = {
        query: { _id: req.body.id },
        set: { "$set": set }
    };
    try {
        await Project.editProject(projectScatusRemarkUpdate);
        res.send({ "success": true, "code": 200, "msg": successMsg.editStatusRemark, "data": "" });
    }
    catch (err) {
        res.send({ "success": false, "code": "500", "msg": msg.editStatusRemark, "err": err });
    }
}

service.updateBilling = async (req, res) => {
    let excelFile = req.files.excelFile;

    let fileExt = excelFile.name.split('.').pop();

    if (fileExt == 'xlx' || fileExt == 'xlsx') {

        const obj = xlsx.parse(excelFile.data);
        const sheet = obj[0];
        let data = sheet['data'];

        let header = data.splice(0, 1)[0];

        let rowHeaders = {};

        header.forEach(function (value, index) {
            if (projectMapDb[value.trim()]) {
                rowHeaders[projectMapDb[value.trim()]] = index;
            }
        });

        var x = null;
        for (x in data) {
            let row = {
                poNumber: data[x][rowHeaders["poNumber"]],
                shippmentNo: data[x][rowHeaders["shippmentNo"]],
                esarOnScs: data[x][rowHeaders["esarOnScs"]],
                pacOnScs: data[x][rowHeaders["pacOnScs"]],
                wccStatus: data[x][rowHeaders["wccStatus"]],
                grn_iaStatus: data[x][rowHeaders["grn_iaStatus"]],
                invoiceStatus: data[x][rowHeaders["invoiceStatus"]],
            };

            let projectToUpdate = {
                query: { "concatenate": data[x][rowHeaders["concatenate"]] },
                set: { "$set": row }
            };
            await Project.editProject(projectToUpdate);
        }

        res.send({ "success": true, "code": 200, "msg": successMsg.updateBilling, "data": "" });

    }
}

export default service;