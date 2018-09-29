/**
 * @file(kit.service.js) All service realted to kit  
 * @author Shakshi Pandey <shakshi.kumari@limitlessmobile.com>
 * @version 1.0.0
 * @lastModifed 5-Feb-2018
 * @lastModifedBy Shakshi
 */

import claimMonthly from '../models/claimMonthly.model';
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


let claimMonthlyeMapDb = { 
    "Date": "date",
    "Month":"month",
    "Year":"year",
    "Emp_Id":"empId",
    "Project_Code":"projectCode",
    "Transfer_Amount": "transferAmount", 
    "Pass_Amount": "passAmount",
} 

service.addclaimMonthly = async (req,res) =>{
  // console.log("req.files.excelFile",req.files.excelFile);
  let excelFile = req.files.excelFile;
    let fileExt = excelFile.name.split('.').pop();

    if(fileExt == 'xlx' || fileExt == 'xlsx'){
        
        const obj = xlsx.parse(excelFile.data);
        const sheet = obj[0]; 
        let data = sheet['data'];
        // console.log("data",data);
        
        let header = data.splice(0,1)[0];
        
        let rowHeaders = {};
        
        header.forEach(function(value,index){
            if(claimMonthlyeMapDb[value.trim()]){
                rowHeaders[index] = claimMonthlyeMapDb[value.trim()];
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
            let circle = null;
            if(!userData){
                goodRow = false;
                errorList.push({
                    index:(parseInt(k))+1,
                    key:"Emp_Id",
                    error:"Not found in user list in database."
                });
            }else{
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
         if(!goodRow){
                goodData = false;
            }
            else{
               const monthNames = ["January", "February", "March", "April", "May", "June",
                 "July", "August", "September", "October", "November", "December"
                                ];
                   let m_name =row['month'].charAt(0).toUpperCase()+row['month'].slice(1).toLowerCase();

                 var month_name=monthNames.includes(m_name);
                 if (month_name==false) {
                   goodData = false;
                errorList.push({
                      index:(parseInt(k))+1,
                      key:"Month Name",
                      error:"Not a Valid Month Name."
                  });
                 }else{

                // var dateObj = getJsDateFromExcel(row["date"]);
                // var year = dateObj.getUTCFullYear();
                // const monthNames = ["January", "February", "March", "April", "May", "June",
                //  "July", "August", "September", "October", "November", "December"
                //                 ];
                let clientToFind = {
                    query:{_id:circle.clientId},
                    projection:{_id:2,name:1}
                };
          
                let client = await Client.getOneClient(clientToFind);
                row['status'] = "active";
                row['updatedAt'] = new Date(); 
               // row['date'] = getJsDateFromExcel(row["date"]);
                row['empId'] = userData.employeeId;
                row['empUserId'] = userData._id;
                row['empName']=userData.fullname;
                row['projectId']=circle._id;
                row['projectCode']=row["projectCode"];//upload by exel;
                row['circleName']=circle.name;
                row['circleId']=circle._id;
                row['transferAmount']=row["transferAmount"];
                row['passAmount']=row["passAmount"];
                row['month']= m_name;
                // console.log(" row['month']", row['month']);
                row['year'] = row['year'];
                row['clientName']=client.name;
                row['clientId']=client._id;
                row['empUserId']=userData._id;
                row['createAt']=new Date();

                
                 }  
            }
 
            rows.push(row);
        }

        if(goodData){
            let x = 0;
            for(x in rows){
               // rows[x]['createAt'] = new Date(); 
                const addToclaimMonthly = claimMonthly(rows[x]);
                await claimMonthly.addclaimMonthly(addToclaimMonthly);
            }
            res.send({"success":true, "code":"200", "msg":successMsg.addclaimMonthly});
        }
        else{
            res.send({"success":false, "code":"500", "msg":msg.addclaimMonthly,"err":errorList});

        }
    }
}

service.allclaimMonthly = async (req,res)=>{
  // console.log("req",req.body);
   // var toDate = new Date(req.body.month);
  
   let query = [
       {status:{$ne:'deleted'}}, 
       {
        $and:[{
            month:req.body.month,
            year:req.body.year
          }]
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
        else if(x=='transferAmount' ||x=='passAmount'){
            rowQuery[x] = req.body.filter[x];
        }
        else
        {
            rowQuery[x] = new RegExp(req.body.filter[x],'i');

        }
        query.push(rowQuery);
       }
   }
   let claimMonthlyToFind = {
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
   const allclaimMonthly = await claimMonthly.claimMonthlyPagination(claimMonthlyToFind,listType);
   if(req.query.type && req.query.type == 'download'){
       var workbook = new Excel.Workbook();
       var worksheet = workbook.addWorksheet('Input');
       worksheet.columns = [
           { header : 'Sr. No.', key:'srNo', width:10 },
           { header : 'Month', key:'month', width:10 },
           { header : 'Year', key:'year', width:10 },
           { header : 'Emp_Name', key:'empName', width:10 },
           { header : 'Circle', key:'circleName', width:10 },
           { header : 'Project_Code', key:'projectCode', width:10 },
           { header : 'Transfer_Amount', key:'transferAmount', width:10 },
           { header : 'Pass_Amount', key:'passAmount', width:10 },
       ];
       let x = null;
       for(x in allclaimMonthly){
           let rowDownloadData = allclaimMonthly[x];
           rowDownloadData['srNo'] = parseInt(x)+1;
           worksheet.addRow(rowDownloadData);
       }
       var filePath = "public/uploads/excel/"+req.user._id+"_claimMonthly.xlsx";
       workbook.xlsx.writeFile(filePath).then(function(){
        res.send(filePath);
    });
   }
   else{
    // console.log("allclaimMonthly",allclaimMonthly);
       res.send({"success":true,"code":200,"msg":successMsg.allclaimMonthly,"data":allclaimMonthly});

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