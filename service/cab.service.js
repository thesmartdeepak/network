/**
 * @file(Cab.service.js) All service realted to Cab  
 * @author Shakshi Pandey <shakshi.kumari@limitlessmobile.com>
 * @version 1.0.0
 * @lastModifed 5-Feb-2018
 * @lastModifedBy Shakshi
 */

import Cab from '../models/cab.model';
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


let CabMapDb = {
    "Vendor_Name": "vendorName",
    "Vendor_Type":"vendorType",
    "Project_Code":"projectCode",
    "Amount":"amount",
    "Number_Of_Days":"numberOfDays",
    "Total_Amount":"totalAmount",
    "Date":"date"
}

service.addCab = async (req,res) =>{
   let excelFile = req.files.excelFile;

    let fileExt = excelFile.name.split('.').pop();

    if(fileExt == 'xlx' || fileExt == 'xlsx'){
        
        const obj = xlsx.parse(excelFile.data);
        const sheet = obj[0]; 
        let data = sheet['data'];
        
        let header = data.splice(0,1)[0];
        
        let rowHeaders = {};
        
        header.forEach(function(value,index){
            if(CabMapDb[value.trim()]){
                rowHeaders[index] = CabMapDb[value.trim()];
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

            let circleToFind = {
                query:{clientCircleCode:row["projectCode"]},
                projection:{_id:1,clientId:1,name:1,}
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

                var dateObj = new Date();//getJsDateFromExcel(new Date());
                var month = dateObj.getUTCMonth() + 1; //months from 1-12
                // var day = dateObj.getUTCDate();
                var year = dateObj.getUTCFullYear();
                const monthNames = ["January", "February", "March", "April", "May", "June",
                    "July", "August", "September", "October", "November", "December"
                ];
                console.log("hello"+ row['vendorName']);
    
                row['status'] = "active";
                row['updatedAt'] = new Date();
                row['vendorName'] = row['vendorName'];
                row['vendorType'] = row['vendorType'];
                row['projectCode'] = row['projectCode'];
                row['projectId'] = circle._id;
                row['clientName'] = client.name;
                row['circleName'] = circle.name;
                row['amount'] = row['amount'];
                row['numberOfDays'] = row['numberOfDays'];
                row['totalAmount'] = row['totalAmount'];
                row['month']= monthNames[ dateObj.getUTCMonth()];
                row['year'] = year;
                row['createAt'] = getJsDateFromExcel(row['date']);
            }

            rows.push(row);
        }

        if(goodData){
            let x = 0;
            for(x in rows){
                //rows[x]['createAt'] = new Date();
                const addToCab = Cab(rows[x]);
                await Cab.addCab(addToCab);
            }
            res.send({"success":true, "code":"200", "msg":successMsg.addCab});
        }
        else{
            res.send({"success":false, "code":"500", "msg":msg.addCab,"err":errorList}); 
        }
    }
}

service.allCab = async (req,res) => {
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
    
    let CabToFind = {
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
    
    const allCab = await Cab.CabPagination(CabToFind,listType);
    

    if(req.query.type && req.query.type == 'download'){

        var workbook = new Excel.Workbook();
        var worksheet = workbook.addWorksheet('Input');

            worksheet.columns = [
                { header: 'Sr. No.', key: 'srNo', width: 10 },
                { header: 'Vendor_Name', key: 'vendorName', width: 20 },
                { header: 'Vendor_Type', key: 'vendorType', width: 20 },
                { header: 'Project_Code', key: 'projectCode', width: 10 },
                { header: 'Client_Name', key: 'clientName', width: 20 },
                { header: 'Amount', key: 'amount', width: 10 },
                { header: 'Number_Of_Days', key: 'numberOfDays', width: 10 },
                { header: 'Total_Amount', key: 'totalAmount', width: 10 },
              ];

       let x=null;
        for(x in allCab){
            let rowDownloadData = allCab[x];
            rowDownloadData['srNo'] = parseInt(x)+1;
           // rowDownloadData['totalAmount'] = (rowDownloadData.amount * rowDownloadData.numberOfDays).toLocaleString('en')+".00";;
            worksheet.addRow(rowDownloadData);
        }

        var filePath = "public/uploads/excel/"+userDecoded._id+"_Cab.xlsx"
        workbook.xlsx.writeFile(filePath).then(function(){
            res.send(filePath);
        });
    }
    else{
        res.send({"success":true,"code":200,"msg":successMsg.allCab,"data":allCab});
    }

    
}

service.allProjectCount = async(req,res) => {
    let projectToFind = {
        query:{status:{$ne:'deleted'}},
        projection:{}
    }

    const allCabCount = await Cab.allCabCount(CabToFind);
    res.send({"success":true,"code":200,"msg":successMsg.allProject,"data":allProjectCount});
}
export default service;