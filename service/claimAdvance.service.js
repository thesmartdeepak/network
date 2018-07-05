/**
 * @file(kit.service.js) All service realted to kit  
 * @author Shakshi Pandey <shakshi.kumari@limitlessmobile.com>
 * @version 1.0.0
 * @lastModifed 5-Feb-2018
 * @lastModifedBy Shakshi
 */

import claimAdvance from '../models/claimAdvance.model';
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


let claimAdvanceMapDb = {
    "Date": "date",
    "Emp_Id":"empId",
    "Project_Code":"projectCode",
    "Total_Transfer": "totalTransfer",
}

service.addclaimAdvance = async (req,res) =>{
  let excelFile = req.files.excelFile;

    let fileExt = excelFile.name.split('.').pop();

    if(fileExt == 'xlx' || fileExt == 'xlsx'){
        
        const obj = xlsx.parse(excelFile.data);
        const sheet = obj[0]; 
        let data = sheet['data'];
        
        let header = data.splice(0,1)[0];
        
        let rowHeaders = {};
        
        header.forEach(function(value,index){
            if(claimAdvanceMapDb[value.trim()]){
                rowHeaders[index] = claimAdvanceMapDb[value.trim()];
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
                const monthNames = ["January", "February", "March", "April", "May", "June",
                 "July", "August", "September", "October", "November", "December"
                                ];
                let clientToFind = {
                    query:{_id:circle.clientId},
                    projection:{_id:1,name:1}
                };
                let client = await Client.getOneClient(clientToFind);
                row['status'] = "active";
                row['updatedAt'] = new Date();
                row['date'] = getJsDateFromExcel(row["date"]);
                row['empId'] = userData.employeeId
                row['empUserId'] = userData._id;
                row['empName']=userData.fullname;
                row['projectId']=circle._id;
                row['projectCode']=row['projectCode'];//circle.clientCircleCode;
                row['circleName']=circle.name;
                row['circleId']=circle._id;
                row['totalTransfer']=row["totalTransfer"];
                row['month']= monthNames[(new Date(row["date"])).getMonth()];//new Date().getUTCMonth() + 1;//row["month"];
                row['clientName']=client.name;
                row['clientId']=client._id;
                row['empUserId']=userData._id;
                
            }

            rows.push(row);
        }

        if(goodData){
            let x = 0;
            for(x in rows){
                rows[x]['createAt'] = new Date();
                const addToclaimAdvance = claimAdvance(rows[x]);
                await claimAdvance.addclaimAdvance(addToclaimAdvance);
            }
            res.send({"success":true, "code":"200", "msg":successMsg.addclaimAdvance});
        }
        else{
            res.send({"success":false, "code":"500", "msg":msg.addclaimAdvance,"err":errorList}); 
        }
    }
}

service.allclaimAdvance = async (req,res)=>{
   var toDate = new Date(req.body.toDate);
   toDate.setDate(toDate.getDate()+1);
   let query = [
       {status:{$ne:'deleted'}},
       {
           createAt :{
                $gte : new Date(req.body.fromDate),
                $lte : toDate 
           }
       }
   ];

   if (req.body.filter){
        let x = '';
       for(x in req.body.filter){
        let rowQuery = {};
        if(x == 'dateSearch'){
           var searchDate = new Date(req.body.filter[x]);
            searchDate.setDate(searchDate.getDate() + 1);

            rowQuery['date'] = {
                $gte:new Date(req.body.filter[x]),
                $lte:searchDate,
            };
        }
        else if(x=='totalTransfer'){
            rowQuery[x] = req.body.filter[x];
        }
        else
        {
            rowQuery[x] = new RegExp(req.body.filter[x],'i');

        }
        query.push(rowQuery);
       }
   }
   let claimAdvanceToFind = {
       query:{$and:query},
       limit:req.body.pageCount,
       skip:(req.body.page-1)*req.body.pageCount
   }
   let listType = 'list';
   if(req.query.type && req.query.type == 'count'){
       listType = 'count';
   }
   else if(req.query.type && req.query.type == 'download'){
       listType = 'download';
   }
   const allclaimAdvance = await claimAdvance.claimAdvancePagination(claimAdvanceToFind,listType);
   if(req.query.type && req.query.type == 'download'){
       var workbook = new Excel.Workbook();
       var worksheet = workbook.addWorksheet('Input');
       worksheet.columns = [
           { header : 'Sr. No.', key:'srNo', width:10 },
           { header : 'Date', key:'date', width:10 },
           { header : 'Month', key:'month', width:10 },
           { header : 'Emp_Name', key:'empName', width:10 },
           { header : 'Circle', key:'circleName', width:10 },
           { header : 'Project_Code', key:'projectCode', width:10 },
           { header : 'Total_Transfer', key:'totalTransfer', width:10 },
       ];
       let x = null;
       for(x in allclaimAdvance){
           let rowDownloadData = allclaimAdvance[x];
           rowDownloadData['srNo'] = parseInt(x)+1;
           worksheet.addRow(rowDownloadData);
       }
       var filePath = "public/uploads/excel/"+req.user._id+"_claimAdvance.xlsx";
       workbook.xlsx.writeFile(filePath).then(function(){
        res.send(filePath);
    });
   }
   else{
       res.send({"success":true,"code":200,"msg":successMsg.allclaimAdvance,"data":allclaimAdvance});
   }
}

// service.allProjectCount = async(req,res) => {
//     let projectToFind = {
//         query:{status:{$ne:'deleted'}},
//         projection:{}
//     }

//     const allKitCount = await Kit.allKitCount(kitToFind);
//     res.send({"success":true,"code":200,"msg":successMsg.allProject,"data":allProjectCount});
// }
export default service;