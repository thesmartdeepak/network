/**
 * @file(user.service.js) All service realted to user  
 * @author Shakshi Pandey <shakshi.kumari@limitlessmobile.com>
 * @version 1.0.0
 * @lastModifed 5-Feb-2018
 * @lastModifedBy Shakshi
 */

import Circle from '../models/circle.model'
import Region from '../models/region.model'
import Client from '../models/client.model'
import successMsg from '../core/message/success.msg'
import msg from '../core/message/error.msg.js'
import mongoose from 'mongoose'


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
service.totalProjectCodeList = async(req,res)=>{
    let dataFind = {};

    dataFind.query = {};
    if(req.query.term){
        let query = "^"+req.query.term;
        dataFind.query = {"clientCircleCode":new RegExp(query)};
    }

    dataFind.projection = {};
    dataFind.limit = 10;
    dataFind.page = 0;
    if(req.query.page){
        dataFind.skip = (req.query.page-1)*10;
    }
    
    let data = await Circle.totalProjectCodeList(dataFind);

    let results = [];

    data.forEach(function(val,index) { 
        results.push( {"id": val.clientCircleCode,"text": val.clientCircleCode});
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

service.addCircleRequiredData = async(req,res)=>{
    let dataFind = {};
    dataFind.query = {};
    dataFind.projection = {};
    let data = {};
    data.regions = await Region.getAllRegion(dataFind);

    return res.send({success:true,code:200,msg:data});
}

service.addCircle = async (req,res) =>{
    let getOneClient = {
        query:{_id:mongoose.Types.ObjectId(req.body.clientId)},
        projection:{}
    };

    let clientOne = await Client.getOneClient(getOneClient);
     
    const clientCircleCode = clientOne.code+req.body.code;
    let circleToAdd = Circle({
        name:req.body.name,
        description:req.body.description,
        code:req.body.code,
        clientId:clientOne._id,
        regionId:req.body.regionId,
        clientCircleCode:clientCircleCode,
        status: 'active',
        createAt:new Date()
    });
    
    try{
        const savedCircle = await Circle.addCircle(circleToAdd);
        res.send({"success":true, "code":"200", "msg":successMsg.addCircle,"data":savedCircle});
    }
    catch(err) {
        res.send({"success":false, "code":"500", "msg":msg.addCircle,"err":err});
    }
}

service.editCircle = async (req,res) => {

    let getOneClient = {
        query:{_id:mongoose.Types.ObjectId(req.body.clientId)},
        projection:{}
    };
    
    let clientOne = await Client.getOneClient(getOneClient);
    
    const clientCircleCode = clientOne.code+req.body.code;
    
    let circleEdit={
        name:req.body.name,
        description:req.body.description,
        code:req.body.code,
        clientId:clientOne._id,
        regionId:req.body.regionId,
        clientCircleCode:clientCircleCode,
        updatedAt: new Date()
    }
    let circleToEdit={
        query:{"_id":req.query.circleId},
        set:{"$set":circleEdit}
    };
    try{
        const editCircle= await Circle.updateCircle(circleToEdit);
        res.send({"success":true,"code":200,"msg":successMsg.editCircle,"data":editCircle});

    }
    catch(err){
        res.send({"success":false, "code":"500", "msg":msg.editCircle,"err":err});
    }
}

service.oneCircle = async (req,res) => {
    let circleToFind = {
        query: {_id:req.query.circleId},
        projection:{}
    }

    let oneCircle = await Circle.getOneCircle(circleToFind);

    let getOneClient = {
        query:{_id:oneCircle.clientId},
        projection:{}
    };

    const clientOne = await Client.getOneClient(getOneClient);
    let data = {
        oneCircle:oneCircle,
        clientOne:clientOne
    };
    res.send({"success":true,"code":200,"msg":successMsg.getOneCircle,"data":data});
}

service.allCircle = async(req,res) => {
    let circleToFind = {
        query:{"status":{$ne:"deleted"}},
        projection:{},
        limit:10,
        skip:(req.query.page-1)*10
    }

    const allCircle = await Circle.getAllCircle(circleToFind);

    res.send({"success":true,"code":200,"msg":successMsg.allCircle,"data":allCircle});
}

service.allCircleCount = async(req,res) => {
    let dataToFind = {
        // query:{_id:req.query._id}
        query: {'status' : { $not : {$eq:"deleted"}}},
        projection:{},
    };
    var count = await Circle.getAllCount(dataToFind);

    res.send({success:true, code:200, msg:'', data:count});
}

service.deleteCircle = async(req,res) => {
    let circleEdit={
        status: 'deleted',
        updatedAt: new Date()
    }
    let circleToEdit={
        query:{"_id":req.body.circleId},
        set:{"$set":circleEdit}
    };
    try{
        const editCircle= await Circle.updateCircle(circleToEdit);
        res.send({"success":true,"code":200,"msg":successMsg.deleteCircle,"data":editCircle});

    }
    catch(err){
        res.send({"success":false, "code":"500", "msg":msg.deleteCircle,"err":err});
    }
}

export default service;
