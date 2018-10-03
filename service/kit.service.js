/**
 * @file(kit.service.js) All service realted to kit  
 * @author Shakshi Pandey <shakshi.kumari@limitlessmobile.com>
 * @version 1.0.0
 * @lastModifed 5-Feb-2018
 * @lastModifedBy Shakshi
 */

import Kit from '../models/kit.model';
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


let kitMapDb = {
    "Operator": "operator", //add operator
    "Employee_Id": "employeeId",//File
    "Project_code":"projectCode",//File
    "Kit_Rent": "kitRent",//File
    "Kit_Name": "kitName",//File
    "Date":"date",
}

service.addKit = async (req, res) => {

//     let clientName = "";
//     let clientId = null;
//     let circleName = "";
//     let circleId = null;
//     let projectCode = "";

//     var dateObj = new Date();//getJsDateFromExcel(new Date());
//     var month = dateObj.getUTCMonth() + 1; //months from 1-12
//     // var day = dateObj.getUTCDate();
//     var year = dateObj.getUTCFullYear();

//     var getDaysInMonth = function (month, year) {
//         return new Date(year, month, 0).getDate();
//     };

//     const monthNames = ["January", "February", "March", "April", "May", "June",
//         "July", "August", "September", "October", "November", "December"
//     ];

//    // let userToFind = { "employeeId": row['employeeId'] };
//     let userToFind ={
//         query: {employeeId:row['employeeId']},
//         projection: {}
//     }
//     let userData = await User.getOne(userToFind);

//     projectCode = userData.projectCode;

//     let circleToFind = {
//         query: { clientCircleCode: projectCode },
//         projection: { _id: 1, clientId: 1, name: 1 }
//     };
//     let circle = await Circle.getOneCircle(circleToFind);

//     let clientToFind = {
//         query: { _id: circle.clientId },
//         projection: { _id: 1, name: 1 }
//     };
//     let client = await Client.getOneClient(clientToFind);

//     clientId = client._id;
//     clientName = client.name;

//     circleName = circle.name;
//     circleId = circle._id;

/////////////////////////////////////////////


    let excelFile = req.files.excelFile;
    // console.log("excelFile data",excelFile);

    let fileExt = excelFile.name.split('.').pop();

    if(fileExt == 'xlx' || fileExt == 'xlsx'){

        const obj = xlsx.parse(excelFile.data);
        const sheet = obj[0]; 
        let data = sheet['data'];

    // console.log("data data",data);
        let header = data.splice(0,1)[0];

        let rowHeaders = {};

        header.forEach(function(value,index){
            if(kitMapDb[value.trim()]){
                rowHeaders[index] = kitMapDb[value.trim()];
            }
        });

        let rows = [];
        let goodData = true;
        let errorList = [];
        let k = 0;

        for(k in data){
            let goodRow = true;

            let rst = data[k];
            let index = k;

            let row = {};

            for(index in rowHeaders){
                if(rst[index]){
                    row[rowHeaders[index]] = (String(rst[index])).trim();
                }
                else{
                    row[rowHeaders[index]] = '';
                }
            }

            let userToFind = {"employeeId":row['employeeId']};
            let userData = await User.getOne(userToFind);

            let circle = null;
            
            if(!userData){
               goodRow = false;
                errorList.push({
                    index:(parseInt(k))+1,
                    key:"employeeId",
                    error:"Not found in user list in database."
                });
            }
            else{
                let circleToFind = {
                query:{clientCircleCode:row["projectCode"]},
                projection:{_id:1,clientId:1,name:1,}
            };
            circle = await Circle.getOneCircle(circleToFind);
            
            if(!circle){
                goodRow = false;
                errorList.push({
                    index:(parseInt(k))+1,
                    key:"Project_Code",
                    error:"Not found in circle list in database."
                });
            }
            }

            // if(!circle){
            //     goodRow = false;
            //     errorList.push({
            //         index:(parseInt(k))+1,
            //         key:"Project_Code",
            //         error:"Not found in circle list in database."
            //     });
            // }

            if(!goodRow){
                goodData = false;
            }
            else{
                 var dateObj = getJsDateFromExcel(row["date"]);
                // var dateObj = new Date();//getJsDateFromExcel(new Date());
                var month = dateObj.getUTCMonth() + 1; //months from 1-12
                // var day = dateObj.getUTCDate();
                var year = dateObj.getUTCFullYear();
                console.log(" var year",  year);
            
                var getDaysInMonth = function (month, year) {
                    return new Date(year, month, 0).getDate();
                };
            
                const monthNames = ["January", "February", "March", "April", "May", "June",
                    "July", "August", "September", "October", "November", "December"
                ];
                console.log("row month",monthNames[month-1]);
                let clientToFind = {
                    query:{_id:circle.clientId},
                    projection:{_id:1,name:1}
                };
                let client = await Client.getOneClient(clientToFind);

                row['empUserId']= userData._id;
                row['employeeId']= row['employeeId'];
                row['empName'] = userData.fullname;
                row['designation'] = userData.userType;
                row['projectCode'] = row['projectCode'];
                row['clientName'] = client.name;
                row['clientId'] = client._id;
                row['circleName']= circle.name;
                row['circleId'] = circle._id;
                row['kitRent']= row['kitRent'];
                row['kitName'] = row['kitName'];
                row['month']= monthNames[month-1];
                row['perDayAmount'] = Math.round(row['kitRent'] / getDaysInMonth(month, year));
                row['status'] = "active";
                row['year']=year;
                row['createAt']= getJsDateFromExcel(row['date']);
                row['updatedAt'] = new Date();

            }

            rows.push(row);
        }

        if(goodData){
            let x = 0;
            for(x in rows){
               // rows[x]['createAt'] = new Date();
                const addToKit = Kit(rows[x]);
                await Kit.addKit(addToKit);
            }
            res.send({"success":true, "code":"200", "msg":successMsg.addKit});
        }
        else{
            res.send({"success":false, "code":"500", "msg":msg.addKit,"err":errorList}); 
        }
    }
}
service.oneKit = async (req, res) => {

    let kitToFind = {
        query: { empId: req.body.empId },
        projection: {}
    }
    const kit = await Kit.oneKit(kitToFind);
    res.send({ "success": true, "code": 200, "msg": successMsg.kit, "data": kit });
};

service.kitReturn = async (req, res) => {
    let kitToReturn = {
        query: { _id: req.body.kitId },
        set: { "$set": { status: "return" } }
    };
    await Kit.kitRetrun(kitToReturn);
    return res.send({ "success": true, "msg": "Kit return succesfully" });
};

service.allKit = async (req, res) => {
    var toDate = new Date(req.body.toDate);
    toDate.setDate(toDate.getDate() + 1);

    let query = [
        { status: { $ne: 'deleted' } },
        {
            createAt: {
                $gte: new Date(req.body.fromDate),
                $lte: toDate
            }
        }
    ]

    if (req.body.filter) {
        // console.log("req.body.filter",req.body.filter);
        let x = '';
        for (x in req.body.filter) {  
            let rowQuery = {};
            if (x == 'amount') {
                let ltAmount = parseInt(req.body.filter[x]);
                if (!isNaN(ltAmount)) {
                    rowQuery[x] = {
                        $gte: ltAmount,
                        $lt: ltAmount + 1
                    };
                }
                else {
                    rowQuery[x] = 0;
                }
            }
            else if (x == 'kitRent') {
                rowQuery[x] = req.body.filter[x];
            }
            else {
                rowQuery[x] = new RegExp(req.body.filter[x], 'i');

            }
            query.push(rowQuery);
        }
    }


    const userDecoded = req.user;
    // if(userDecoded.userType != 'admin' && userDecoded.userType != 'billing-admin'){
    //     if(userDecoded.userType == 'manager'){
    //         let rowQuery = {managerId:mongoose.Types.ObjectId(userDecoded._id)};
    //         query.push(rowQuery);
    //     }
    //     else{
    //         let rowQuery = {userId:mongoose.Types.ObjectId(userDecoded._id)};
    //         query.push(rowQuery);
    //     }
    // }

    let kitToFind = {
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

    const allKit = await Kit.kitPagination(kitToFind, listType);

    if (req.query.type && req.query.type == 'download') {

        var workbook = new Excel.Workbook();
        var worksheet = workbook.addWorksheet('Input');

        worksheet.columns = [
            { header: 'Sr. No.', key: 'srNo', width: 10 },
            { header: 'Employee_Id', key: 'employeeId', width: 15 },
            { header: 'Employee_Name', key: 'empName', width: 20 },
            { header: 'Designation', key: 'designation', width: 15 },
            { header: 'Project', key: 'projectCode', width: 10 },
            { header: 'Kit_Rent', key: 'kitRent', width: 10 },
            { header: 'Month', key: 'month', width: 10 },
            { header: 'Circle', key: 'circleName', width: 15 },
            { header: 'Kit_Name', key: 'kitName', width: 10 },
        ];

        let x = null;
        for (x in allKit) {
            let rowDownloadData = allKit[x];
            rowDownloadData['srNo'] = parseInt(x) + 1;
            worksheet.addRow(rowDownloadData);
        }

        var filePath = "public/uploads/excel/" + userDecoded._id + "_kit.xlsx"
        workbook.xlsx.writeFile(filePath).then(function () {
            res.send(filePath);
        });
    }
    else {
        res.send({ "success": true, "code": 200, "msg": successMsg.allKit, "data": allKit });
    }


}

service.allProjectCount = async (req, res) => {
    let projectToFind = {
        query: { status: { $ne: 'deleted' } },
        projection: {}
    }

    const allKitCount = await Kit.allKitCount(kitToFind);
    res.send({ "success": true, "code": 200, "msg": successMsg.allProject, "data": allProjectCount });
}
export default service;