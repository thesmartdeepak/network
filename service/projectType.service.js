/**
 * @file(user.service.js) All service realted to user  
 * @author Shakshi Pandey <shakshi.kumari@limitlessmobile.com>
 * @version 1.0.0
 * @lastModifed 5-Feb-2018
 * @lastModifedBy Shakshi
 */

import projectType from '../models/projectType.model'
import Department from '../models/department.model'
import successMsg from '../core/message/success.msg'
import msg from '../core/message/error.msg.js'
import projectTypeModel from '../models/projectType.model';


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
service.totalProjectTypeList = async(req,res)=>{
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
    
    let data = await projectType.totalProjectTypeList(dataFind);

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
service.addProjectType = async (req,res) =>{

    let projectTypeToAdd = projectType({
        name:req.body.name,
        departmentId:req.body.departmentId,
        status: 'active',
        createAt:new Date()
    });
    const savedProjectType = await projectType.addProjectType(projectTypeToAdd);
    try{
        res.send({"success":true, "code":"200", "msg":successMsg.addProjectType,"data":savedProjectType});
    }
    catch(err) {
        res.send({"success":false, "code":"500", "msg":msg.addProjectType,"err":err});
    }
}

service.editProjectType = async (req,res) => {

    let projectTypeEdit={
        name:req.body.name,
        departmentId:req.body.departmentId,
        updatedAt: new Date()
    }
    let projectTypeToEdit={
        query:{"_id":req.query.projectTypeId},
        set:{"$set":projectTypeEdit}
    };
    try{
        const editProjectType= await projectType.updateProjectType(projectTypeToEdit);
        res.send({"success":true,"code":200,"msg":successMsg.editProjectType,"data":editProjectType});

    }
    catch(err){
        res.send({"success":false, "code":"500", "msg":msg.editProjectType,"err":err});
    }
}

service.oneProjectType = async (req,res) => {
    let projectTypeToFind = {
        query: {_id:req.query.projectTypeId},
        projection:{}
    }

    const oneProjectType = await projectType.getOneProjectType(projectTypeToFind);

    let departmentToFind = {
        query: {_id:oneProjectType.departmentId},
        projection:{}
    }
    const oneDepartment = await Department.getOnedepartment(departmentToFind);

    const data = {
        oneProjectType:oneProjectType,
        oneDepartment:oneDepartment
    }
    res.send({"success":true,"code":200,"msg":successMsg.getOneProjectType,"data":data});
}

service.allProjectType = async(req,res) => {
   
    let projectTypeToFind = {
        query:{"status":{$ne:"deleted"}},
        projection:{}, 
        limit: 10,
        skip: (req.query.page-1)*10
    }

    const allProjectType = await projectType.getAllProjectType(projectTypeToFind);

    res.send({"success":true,"code":200,"msg":successMsg.allProjectType,"data":allProjectType});
}

service.allProjectTypeCount = async(req,res) => {
    let projectTypeToFind = {
        query:{"status":{$ne:"deleted"}}
    }
    const allProjectTypeCount = await projectType.getAllProjectTypeCount(projectTypeToFind);

    res.send({"success":true,"code":200,"msg":successMsg.allProjectType,"data":allProjectTypeCount});
}

service.deleteProjectType = async(req,res) => {
    let projectTypeEdit={
        status: 'deleted',
        updatedAt: new Date()
    }
    let projectTypeToEdit={
        query:{"_id":req.body.projectTypeId},
        set:{"$set":projectTypeEdit}
    };
    try{
        const editProjectType= await projectType.updateProjectType(projectTypeToEdit);
        res.send({"success":true,"code":200,"msg":successMsg.deleteProjectType,"data":editProjectType});

    }
    catch(err){
        res.send({"success":false, "code":"500", "msg":msg.deleteProjectType,"err":err});
    }
}

service.projectTypeByDepartment = async(req,res) => {
   
    let projectTypeToFind = {
        query:{departmentId:req.body.departmentId},
        projection:{}
    }
    const projectTypeData = await projectTypeModel.totalProjectTypeList(projectTypeToFind);
    res.send({"success":true,"code":200,"msg":successMsg.allProjectType,"data":projectTypeData});
}

service.getProjectType = async(req,res) => {
    let projectTypeToFind = {
        query:{"status":{$ne:"deleted"}},
        projection:{}
    }

    const allprojectType = await projectTypeModel.getAllprojectType(projectTypeToFind);

    res.send({"success":true,"code":200,"msg":successMsg.allprojectType,"data":allprojectType});
}

export default service;
