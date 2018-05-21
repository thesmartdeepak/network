/**
 * @file(project.service.js) All service realted to project  
 * @author Shakshi Pandey <shakshi.kumari@limitlessmobile.com>
 * @version 1.0.0
 * @lastModifed 5-Feb-2018
 * @lastModifedBy Shakshi
 */

import Project from '../models/project.model'
import logger from '../core/logger/app.logger'
import successMsg from '../core/message/success.msg'
import msg from '../core/message/error.msg.js'


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
service.addCircleRequiredData = async(req,res)=>{
    let dataFind = {};
    dataFind.query = {};
    dataFind.projection = {"_id":0};
    let data = await UserType.getAll(dataFind);
    // console.log('----------------');
    console.log(data);
    return res.send({success:true,code:200,msg:data});
}

service.addProject = async (req,res) =>{
    let projectToAdd = Project({
        name:req.body.name,
        poNumber:req.body.poNumber,
        shipmentNo:req.body.shipmentNo,
        // projectcode:req.body.projectcode,
        contactPerson:req.body.contactPerson,
        contactPersonNo:req.body.contactPersonNo,
        contactAddress:req.body.contactAddress,
        status: 'active',
        createAt:new Date()
    });
    const savedProject = await Project.addProject(projectToAdd);
    try{
        res.send({"success":true, "code":"200", "msg":successMsg.addProject,"data":savedProject});
    }
    catch(err) {
        res.send({"success":false, "code":"500", "msg":msg.addProject,"err":err});
    }
}

service.editProject = async (req,res) => {
    let editProjectData = {
        name:req.body.name,
        poNumber:req.body.poNumber,
        shipmentNo:req.body.shipmentNo,
        projectCode:req.body.projectCode,
        contactPerson:req.body.contactPerson,
        contactPersonNo:req.body.contactPersonNo,
        contactAddress:req.body.contactAddress,
        updatedAt: new Date()
    }

    let editToProject = {
        query:{_id:req.query.projectId},
        set:{"$set":editProjectData}
    }
    
    const editProject = await project.editProject(editToProject);

    try{
        res.send({"success":true, "code":"200", "msg":successMsg.editProject,"data":editProject});
    }
    catch(err) {
        res.send({"success":false, "code":"500", "msg":msg.editProject,"err":err});
    }
}

service.oneProject = async (req,res) => {
    let projectToFind = {
        query: {_id:req.query.projectId},
        projection:{}
    }

    const oneProject = await Project.getOneproject(projectToFind);
    res.send({"success":true,"code":200,"msg":successMsg.getOneProject,"data":oneProject});
}

service.allProject = async (req,res) => {
    let projectToFind = {
        query:{status:{$ne:'deleted'}},
        projection:{},
        limit:10,
        skip:(req.query.page-1)*10
    }

    const allProject = await Project.projectPagination(projectToFind);
    res.send({"success":true,"code":200,"msg":successMsg.allProject,"data":allProject});
}

service.allProjectCount = async(req,res) => {
    let projectToFind = {
        query:{status:{$ne:'deleted'}},
        projection:{}
    }

    const allProjectCount = await Project.allProjectCount(projectToFind);
    res.send({"success":true,"code":200,"msg":successMsg.allProject,"data":allProjectCount});
}

service.deleteProject = async(req,res) => {
    let projectEdit={
        status: 'deleted',
        updatedAt: new Date()
    }
    let projectToEdit={
        query:{"_id":req.body.projectId},
        set:{"$set":projectEdit}
    };
    try{
        const editProject= await Project.editProject(projectToEdit);
        res.send({"success":true,"code":200,"msg":successMsg.deleteProject,"data":editProject});

    }
    catch(err){
        res.send({"success":false, "code":"500", "msg":msg.deleteProject,"err":err});
    }
}

export default service;