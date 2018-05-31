/**
 * @file(user.service.js) All service realted to user  
 * @author Shakshi Pandey <shakshi.kumari@limitlessmobile.com>
 * @version 1.0.0
 * @lastModifed 5-Feb-2018
 * @lastModifedBy Shakshi
 */

import projecttype from '../models/projectType.model'
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
service.totalProjecttypeList = async(req,res)=>{
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
    
    let data = await projecttype.totalProjecttypeList(dataFind);

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
service.addprojecttype = async (req,res) =>{
    let getOneDepartment = {
        query:{_id:(req.body.departmentId)},
        projection:{}
    };

    let departmentOne = await department.getOnedepartment(getOneDepartment);

    let projecttypeToAdd = projecttype({
        name:req.body.name,
        departmentId:departmentOne._id,
        status: 'active',
        createAt:new Date()
    });
    const savedprojecttype = await projecttype.addprojecttype(projecttypeToAdd);
    try{
        res.send({"success":true, "code":"200", "msg":successMsg.addprojecttype,"data":savedprojecttype});
    }
    catch(err) {
        res.send({"success":false, "code":"500", "msg":msg.addprojecttype,"err":err});
    }
}

service.editprojecttype = async (req,res) => {

    let getOneDepartment = {
        query:{_id:mongoose.Types.ObjectId(req.body.clientId)},
        projection:{}
    };

    let departmentOne = await department.getOnedepartment(getOneDepartment);

    let projecttypeEdit={
        name:req.body.name,
        departmentId:departmentOne._id,
        updatedAt: new Date()
    }
    let projecttypeToEdit={
        query:{"_id":req.query.projecttypeId},
        set:{"$set":projecttypeEdit}
    };
    try{
        const editprojecttype= await projecttype.updateprojecttype(projecttypeToEdit);
        res.send({"success":true,"code":200,"msg":successMsg.editprojecttype,"data":editprojecttype});

    }
    catch(err){
        res.send({"success":false, "code":"500", "msg":msg.editprojecttype,"err":err});
    }
}

service.oneprojecttype = async (req,res) => {
    let projecttypeToFind = {
        query: {_id:req.query.projecttypeId},
        projection:{}
    }

    const oneprojecttype = await projecttype.getOneprojecttype(projecttypeToFind);
    res.send({"success":true,"code":200,"msg":successMsg.getOneprojecttype,"data":oneprojecttype});
}

service.allprojecttype = async(req,res) => {
   
    let projecttypeToFind = {
        query:{"status":{$ne:"deleted"}},
        projection:{}, 
        limit: 10,
        skip: (req.query.page-1)*10
    }

    const allprojecttype = await projecttype.getAllprojecttype(projecttypeToFind);

    res.send({"success":true,"code":200,"msg":successMsg.allprojecttype,"data":allprojecttype});
}

service.allProjectTypeCount = async(req,res) => {
    let projectTypeToFind = {
        query:{"status":{$ne:"deleted"}}
    }
    const allProjectTypeCount = await projecttype.getAllProjectTypeCount(projectTypeToFind);

    res.send({"success":true,"code":200,"msg":successMsg.allprojecttype,"data":allProjectTypeCount});
}

service.deleteprojecttype = async(req,res) => {
    let projecttypeEdit={
        status: 'deleted',
        updatedAt: new Date()
    }
    let projecttypeToEdit={
        query:{"_id":req.body.projecttypeId},
        set:{"$set":projecttypeEdit}
    };
    try{
        const editprojecttype= await projecttype.updateprojecttype(projecttypeToEdit);
        res.send({"success":true,"code":200,"msg":successMsg.deleteprojecttype,"data":editprojecttype});

    }
    catch(err){
        res.send({"success":false, "code":"500", "msg":msg.deleteprojecttype,"err":err});
    }
}

export default service;
