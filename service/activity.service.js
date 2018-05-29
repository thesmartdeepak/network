/**
 * @file(activity.service.js) All service realted to activity  
 * @author Shakshi Pandey <shakshi.kumari@limitlessmobile.com>
 * @version 1.0.0
 * @lastModifed 5-Feb-2018
 * @lastModifedBy Shakshi
 */

import Activity from '../models/activity.model'
import Client from '../models/client.model'
import ProjectType from '../models/projecttype.model'
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

service.addActivity = async (req,res) =>{
    let activityToAdd = Activity({
        clientId: req.body.clientId,
        projectTypeId: req.body.projectTypeId,
        name:req.body.name,
        description:req.body.description,
        status: 'active',
        createAt:new Date()
    });
    const savedActivity = await Activity.addActivity(activityToAdd);
    try{
        res.send({"success":true, "code":"200", "msg":successMsg.addActivity,"data":savedActivity});
    }
    catch(err) {
        res.send({"success":false, "code":"500", "msg":msg.addActivity,"err":err});
    }
}
 
service.editActivity = async (req,res) => {
    let getOneprojectType = {
        query:{_id:req.body.projectTypeId},
        projection:{}
    };

    let projectType = await ProjectType.getOneprojecttype(getOneprojectType);
    
    // const clientCircleCode = clientOne.code+req.body.code;



    let getOneClient = {
        query:{_id:req.body.clientId},
        projection:{}
    };

    let clientOne = await Client.getOneClient(getOneClient);
    
    const clientCircleCode = clientOne.code+req.body.code;
    let editActivityData = {
        clientId: clientOne._id,
        // ProjectTypeId: projectType._id,
        name: req.body.name,
        description: req.body.description,
        clientCircleCode:clientCircleCode,
        updatedAt: new Date()
    }

    let editToActivity = {
        query:{_id:req.query.activityId},
        set:{"$set":editActivityData}
    }
    
    const editActivity = await Activity.editActivity(editToActivity);

    try{
        res.send({"success":true, "code":"200", "msg":successMsg.editActivity,"data":editActivity});
    }
    catch(err) {
        res.send({"success":false, "code":"500", "msg":msg.editActivity,"err":err});
    }
}

service.oneActivity = async (req,res) => {
    let activityToFind = {
        query: {_id:req.query.activityId},
        projection:{}
    }
    const oneActivity = await Activity.getOneActivity(activityToFind);

    let getOneClient = {
        query:{_id:oneActivity.clientId},
        projection:{}
    };
    const clientOne = await Client.getOneClient(getOneClient);

    let data = {
        oneActivity:oneActivity,
        clientOne:clientOne
    };
    res.send({"success":true,"code":200,"msg":successMsg.getOneActivity,"data":data});
}

service.allActivity = async (req,res) => {
    let activityToFind = {
        query:{status:{$ne:'deleted'}},
        projection:{},
        limit:10,
        skip:(req.query.page-1)*10
    }
    const allActivity = await Activity.getAllActivity(activityToFind);
     //const allActivity = await Activity.ActivityPagination(activityToFind);

    res.send({"success":true,"code":200,"msg":successMsg.allActivity,"data":allActivity});
}

service.allActivityCount = async(req,res) => {
    let activityToFind = {
        query:{status:{$ne:'deleted'}},
        projection:{}
    }

    const allActivityCount = await Activity.allActivityCount(activityToFind);
    res.send({"success":true,"code":200,"msg":successMsg.allActivity,"data":allActivityCount});
}

service.deleteActivity = async(req,res) => {
    let activityEdit={
        status: 'deleted',
        updatedAt: new Date()
    }
    let activityToEdit={
        query:{"_id":req.body.activityId},
        set:{"$set":activityEdit}
    };
    try{
        const editActivity= await Activity.editActivity(activityToEdit);
        res.send({"success":true,"code":200,"msg":successMsg.deleteActivity,"data":editActivity});

    }
    catch(err){
        res.send({"success":false, "code":"500", "msg":msg.deleteActivity,"err":err});
    }
}

export default service;