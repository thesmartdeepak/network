/**
 * @file(user.service.js) All service realted to user  
 * @author Shakshi Pandey <shakshi.kumari@limitlessmobile.com>
 * @version 1.0.0
 * @lastModifed 5-Feb-2018
 * @lastModifedBy Shakshi
 */

import department from '../models/department.model'
import logger from '../core/logger/app.logger'
import successMsg from '../core/message/success.msg'
import msg from '../core/message/error.msg.js'
import utility from '../core/utility.js' 
import  crypto from 'crypto'
import jwt from 'jsonwebtoken'
import nm from 'nodemailer'
import rand from 'csprng'


/**
 * [service is a object ]
 * @type {Object}
 */

const service = {};

/**
 * @description [with all the calculation before getAll function of model and after getAll]
 * @param  {[object]}
 * @param  {[object]}
 * @return {[object]}
 */
service.totaldepartmentList = async(req,res)=>{
    let dataFind = {};

    dataFind.query = {};
    if(req.query.term){
        let query = "^"+req.query.term;
        dataFind.query = {"name":new RegExp(query)};
    }

    dataFind.projection = {};
    dataFind.limit = 10;
    dataFind.page = 0;
    if(req.query.page){
        dataFind.skip = (req.query.page-1)*10;
    }
    
    let data = await department.totaldepartmentList(dataFind);

    let results = [];

    data.forEach(function(val,index) { 
        results.push( {"id": val._id,"text": val.name});
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
service.adddepartment = async (req,res) =>{
    let departmentToAdd = department({
        name:req.body.name,
        status: 'active',
        createAt:new Date()
    });
    const saveddepartment = await department.adddepartment(departmentToAdd);
    try{
        res.send({"success":true, "code":"200", "msg":successMsg.adddepartment,"data":saveddepartment});
    }
    catch(err) {
        res.send({"success":false, "code":"500", "msg":msg.adddepartment,"err":err});
    }
}

service.editdepartment = async (req,res) => {
    let departmentEdit={
        name:req.body.name,
        updatedAt: new Date()
    }
    let departmentToEdit={
        query:{"_id":req.query.departmentId},
        set:{"$set":departmentEdit}
    };
    try{
        const editdepartment= await department.updatedepartment(departmentToEdit);
        res.send({"success":true,"code":200,"msg":successMsg.editdepartment,"data":editdepartment});

    }
    catch(err){
        res.send({"success":false, "code":"500", "msg":msg.editdepartment,"err":err});
    }
}

service.onedepartment = async (req,res) => {
    let departmentToFind = {
        query: {_id:req.query.departmentId},
        projection:{}
    }

    const onedepartment = await department.getOnedepartment(departmentToFind);
    res.send({"success":true,"code":200,"msg":successMsg.getOnedepartment,"data":onedepartment});
}

service.alldepartment = async(req,res) => {
    let departmentToFind = {
        query:{"status":{$ne:"deleted"}},
        projection:{}
    }

    const alldepartment = await department.getAlldepartment(departmentToFind);

    res.send({"success":true,"code":200,"msg":successMsg.alldepartment,"data":alldepartment});
}

service.deletedepartment = async(req,res) => {
    let departmentEdit={
        status: 'deleted',
        updatedAt: new Date()
    }
    let departmentToEdit={
        query:{"_id":req.body.departmentId},
        set:{"$set":departmentEdit}
    };
    try{
        const editdepartment= await department.updatedepartment(departmentToEdit);
        res.send({"success":true,"code":200,"msg":successMsg.deletedepartment,"data":editdepartment});

    }
    catch(err){
        res.send({"success":false, "code":"500", "msg":msg.deletedepartment,"err":err});
    }
}

export default service;
