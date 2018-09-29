/**
 * @file(attendance.service.js) All service realted to attendance  
 * @author Shakshi Pandey <shakshi.kumari@limitlessmobile.com>
 * @version 1.0.0
 * @lastModifed 5-Feb-2018
 * @lastModifedBy Shakshi
 */

import attendance from '../models/attendanceMonthly.model';
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


let attendanceMapDb = {
    "Year": "year",
    "Month": "month",
    "Employee_ID":"employeeId",
    "Project_Code":"projectCode",
    "Days_Present":"presentdays",
    "Net_Salary" :"netsalary",
    "Status":"empStatus",
    "Operator":"operator",
}

service.addAttendanceMonthly = async (req,res) =>{
    // console.log("req",req.files);
    let excelFile = req.files.excelFile;
    // console.log("excelFile",excelFile);

    let fileExt = excelFile.name.split('.').pop();

    if(fileExt == 'xlx' || fileExt == 'xlsx'){
        
        const obj = xlsx.parse(excelFile.data);
        const sheet = obj[0]; 
        let data = sheet['data'];
        
        let header = data.splice(0,1)[0];
        
        let rowHeaders = {};
        
        header.forEach(function(value,index){
            if(attendanceMapDb[value.trim()]){
                rowHeaders[index] = attendanceMapDb[value.trim()];
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

            let circle = null;
            let userToFind = {"employeeId":row['employeeId']};
            let userData = await User.getOne(userToFind);
            
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
            if(!goodRow){ 
                goodData = false;
            }
            else{

                const monthNames = ["January", "February", "March", "April", "May", "June",
                "July", "August", "September", "October", "November", "December"
                               ];
                 let m_name =row['month'].charAt(0).toUpperCase()+row['month'].slice(1).toLowerCase();

                 var month_name=monthNames.includes(m_name);
                 console.log("month_name",month_name);
                
                    if (month_name==false) {
                        goodData = false;
                        errorList.push({
                        index:(parseInt(k))+1,
                        key:"Month Name",
                        error:"Not a Valid Month Name."
                  });
                 }else{

                var getDaysInMonth = function(month,year) {
                  return new Date(year, month, 0).getDate();
                  };

                let clientToFind = {
                    query:{_id:circle.clientId},
                    projection:{_id:1,name:1,clientId:1}
                };
                let client = await Client.getOneClient(clientToFind);
                row['status'] = "active"; 
                row['updatedAt'] = new Date();
                row['month'] =row['month'] ;
                row['year']=row['year']; 
                row['netsalary']=row['netsalary']; 
                row['presentdays'] =row['presentdays'] ;
                // row['date'] = getJsDateFromExcel(row['date']);
                row['employeeUserId'] = userData._id;
                row['employeeId'] = row['employeeId'];
                row['employeeName'] = userData.fullname;
                row['salary'] = userData.salary;
                row['designation'] = userData.userType;
                row['clientName'] = client.name;
                row['clientId'] = circle.clientId;
                row['circleId'] = circle._id;
                row['circleName'] =circle.name; 
                row['projectCode'] = row['projectCode'];
                row['empStatus'] = row['empStatus']; 
                row['operator'] = row['operator'];
                row['perDaySalary'] = 0;
                // let empStatus_lower = row['empStatus'].toLowerCase();
                let when_salary = ["working","ideal","movement","week off"];
                
                // if(when_salary.indexOf(empStatus_lower) != -1){
                //     row['perDaySalary'] = Math.round(userData.salary/getDaysInMonth(month,year));
                // }
                
                // row['year'] = year;
                 }
                // var dateObj = getJsDateFromExcel(row['date']);
                // var month = dateObj.getUTCMonth() + 1;
                // var year = dateObj.getUTCFullYear();

             }

            rows.push(row);
        }

        if(goodData){
            // console.log("goodData",goodData)
            let x = 0;
            for(x in rows){
                rows[x]['createAt'] = new Date();
                    const addToattendance = attendance(rows[x]);
                    await attendance.addAttendance(addToattendance);

                
            }
            res.send({"success":true, "code":"200", "msg":successMsg.addAttendance});
        }
        else{
            res.send({"success":false, "code":"500", "msg":msg.addAttendance,"err":errorList}); 
        }
    }
}

service.allAttendanceMonthly = async (req,res) => {
   // var toDate = new Date(req.body.toDate);
   //  toDate.setDate(toDate.getDate() + 1);

    let query = [
                {status:{$ne:'deleted'}}, 
                {
                    $and:[{
            month:req.body.month,
            year:req.body.year
          }]                }
            ]

    if(req.body.filter){
        let x = '';
        for(x in req.body.filter){
            let rowQuery = {};
            if(x=='poAmount' || x == 'siteCount' || x =='month' || x =='year' || x=='presentdays'){
                rowQuery[x] = req.body.filter[x];
            }
            else if(x == 'date'){
                var searchDate = new Date(req.body.filter[x]);
            searchDate.setDate(searchDate.getDate() + 1);

            rowQuery['date'] = {
                $gte:new Date(req.body.filter[x]),
                $lte:searchDate,
            };
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
    
    let attendanceToFind = {
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
    
    const allAttendance = await attendance.attendancePagination(attendanceToFind,listType);
    

    if(req.query.type && req.query.type == 'download'){

        var workbook = new Excel.Workbook();
        var worksheet = workbook.addWorksheet('Input');

            worksheet.columns = [
                { header: 'Sr. No.', key: 'srNo', width: 5 },
                { header: 'Month', key: 'month', width: 20 },
                { header: 'Year', key: 'year', width: 15 },
                { header: 'Employee_Id', key: 'employeeId', width: 15 },
                { header: 'Employee_Name', key: 'employeeName', width: 20 },
                { header: 'Designation', key: 'designation', width: 20 },
                { header: 'Client_Name', key: 'clientName', width: 20 },
                { header: 'Project_Code', key: 'projectCode', width: 15 },
                { header: 'Status', key: 'status', width: 15 },
                // { header: 'Operator', key: 'operator', width: 15 },
              ];

       let x=null;
        for(x in allAttendance){
            let rowDownloadData = allAttendance[x];
            rowDownloadData['srNo'] = parseInt(x)+1;
            worksheet.addRow(rowDownloadData);
        }
       var filePath = "public/uploads/excel/"+userDecoded._id+"_attendanceMonthly.xlsx"
        workbook.xlsx.writeFile(filePath).then(function(){
            res.send(filePath);
        });
    }
    else{
        res.send({"success":true,"code":200,"msg":successMsg.allAttendance,"data":allAttendance});
    }

    
}

service.allProjectCount = async(req,res) => {
    let projectToFind = {
        query:{status:{$ne:'deleted'}},
        projection:{}
    }

    const allAttendanceCount = await attendance.allAttendanceCount(attendanceToFind);
    res.send({"success":true,"code":200,"msg":successMsg.allProject,"data":allProjectCount});
}

service.getAllUser = async(req,res) => {
    let dataFind = [];

    if(req.query.term){
        let query = req.query.term;
        let match = {$match:{"employeeName":new RegExp(query,"i")}};

        dataFind.push(match);
    }

    let projection = {
        $project:{"name":"$employeeName"}
    };

    dataFind.push(projection);

    dataFind.push({"$group":{
                    _id:"$name",
                    "name":{$last:"$name"}
                }});
    
    let skip = 0;
    if(req.query.page){
        skip = (req.query.page-1)*10;
    }

    dataFind.push({"$limit":skip+10});
    dataFind.push({"$skip":skip});
    
    let data = await attendance.getAggregate(dataFind);

    let results = [];

    data.forEach(function(val,index) { 
        results.push( {"id": val.name,"text": val.name});
    });

    let response = {
        results:results,
        pagination: {
            more: (function(){
                if(data.length < 10){
                    return false;
                }
                else{
                    return true;
                }
            })()
        }
    };

    return res.send(response);
}
export default service;