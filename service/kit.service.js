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
    "Emp_Id": "empId",
    "Emp_Name":"empName",
    "Designation":"designation",
    "Project_Code":"projectCode",
    "Client_Name":"clientName",
    "Circle_Name":"circleName",
    "Kit_Rent": "kitRent",
    "Month":"month",
    "Paid_Days":"paidDays",
    "Amount":"amount",
    "Kit_Name":"kitName",
    "Kit_Description":"kitDescription",
}

service.addKit = async (req,res) =>{
    let excelFile = req.files.excelFile;

    let fileExt = excelFile.name.split('.').pop();

    if(fileExt == 'xlx' || fileExt == 'xlsx'){
        
        const obj = xlsx.parse(excelFile.data);
        const sheet = obj[0]; 
        let data = sheet['data'];
        
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

            let userToFind = {"employeeId":row['empId']};
            let userData = await User.getOne(userToFind);

            if(!userData){
                goodRow = false;
                errorList.push({
                    index:(parseInt(k))+1,
                    key:"Emp_Id",
                    error:"Not found in user list in database."
                });
            }
            
            let circleToFind = {
                query:{clientCircleCode:row["projectCode"]},
                projection:{_id:1,clientId:1,name:1}
            };
            let circle = await Circle.getOneCircle(circleToFind);
            
            if(!circle){
                goodRow = false;
                errorList.push({
                    index:(parseInt(k))+1,
                    key:"Project_Code",
                    error:"Not found in circle list in database."
                });
            }

            if(!goodRow){
                goodData = false;
            }
            else{
                let clientToFind = {
                    query:{_id:circle.clientId},
                    projection:{_id:1,name:1}
                };
                let client = await Client.getOneClient(clientToFind);

                row['status'] = "active";
                row['updatedAt'] = new Date();
                row['userId'] = userData._id;
                row['designation']=userData.userType;
                row['clientName']=client.name;
                row['clientId']=client._id;
                row['circleName']=circle.name;
                row['circleId']=circle._id;
                row['empUserId']=userData._id;
                row['empName']=userData.fullname;
            }

            rows.push(row);
        }

        if(goodData){
            let x = 0;
            for(x in rows){
                rows[x]['createAt'] = new Date();
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

service.allKit = async (req,res) => {
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
            if(x=='amount'){
                let ltAmount = parseInt(req.body.filter[x]);
                if(!isNaN(ltAmount)){
                    rowQuery[x] = {
                        $gte:ltAmount,
                        $lt:ltAmount+1
                    };
                }
                else{
                    rowQuery[x] = 0;
                }
            }
            else if(x == 'kitRent')
            {
                rowQuery[x] = req.body.filter[x];
            }
            else
            {
                rowQuery[x] = new RegExp(req.body.filter[x],'i');

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
        query:{$and:query},
        limit:req.body.pageCount,
        skip:(req.query.page-1)*req.body.pageCount
    }

    let listType = 'list';
    if(req.query.type && req.query.type == 'count'){
        listType = 'count';
    }
    else if(req.query.type && req.query.type == 'download'){
        listType = 'download';
    }
    
    const allKit = await Kit.kitPagination(kitToFind,listType);

    if(req.query.type && req.query.type == 'download'){

        var workbook = new Excel.Workbook();
        var worksheet = workbook.addWorksheet('Input');

            worksheet.columns = [
                { header: 'Sr. No.', key: 'srNo', width: 10 },
                { header: 'emp_Id', key: 'empId', width: 10 },
                { header: 'emp_Name', key: 'empName', width: 10 },
                { header: 'Designation', key: 'designation', width: 10 },
                { header: 'Project', key: 'project', width: 10 },
                { header: 'Kit_Rent', key: 'kitRent', width: 10 },
                { header: 'Month', key: 'month', width: 10 },
                { header: 'Circle', key: 'circle', width: 15 },
                { header: 'Paid_Days', key: 'paidDays', width: 15 },
                { header: 'Amount', key: 'amount', width: 10 },
                { header: 'Kit_Name', key: 'kitName', width: 10 },
                { header: 'Kit_Description', key: 'kitDescription', width: 10 },
            ];

       let x=null;
        for(x in allKit){
            let rowDownloadData = allKit[x];
            rowDownloadData['srNo'] = parseInt(x)+1;
            worksheet.addRow(rowDownloadData);
        }

        var filePath = "public/uploads/excel/"+userDecoded._id+"_kit.xlsx"
        workbook.xlsx.writeFile(filePath).then(function(){
            res.send(filePath);
        });
    }
    else{
        res.send({"success":true,"code":200,"msg":successMsg.allKit,"data":allKit});
    }

    
}

service.allProjectCount = async(req,res) => {
    let projectToFind = {
        query:{status:{$ne:'deleted'}},
        projection:{}
    }

    const allKitCount = await Kit.allKitCount(kitToFind);
    res.send({"success":true,"code":200,"msg":successMsg.allProject,"data":allProjectCount});
}
export default service;