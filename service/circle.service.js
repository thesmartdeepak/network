/**
 * @file(user.service.js) All service realted to user  
 * @author Shakshi Pandey <shakshi.kumari@limitlessmobile.com>
 * @version 1.0.0
 * @lastModifed 5-Feb-2018
 * @lastModifedBy Shakshi
 */

import Circle from '../models/circle.model'
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

service.addCircleRequiredData = async(req,res)=>{
    let dataFind = {};
    dataFind.query = {};
    dataFind.projection = {"_id":0};
    let data = await Circle.getAllCircle(dataFind);
    // console.log('----------------');
    console.log(data);
    return res.send({success:true,code:200,msg:data});
}

service.addCircle = async (req,res) =>{
    let circleToAdd = Circle({
        name:req.body.name,
        description:req.body.description,
        code:req.body.code,
        status: 'active',
        createAt:new Date()
    });
    const savedCircle = await Circle.addCircle(circleToAdd);
    try{
        res.send({"success":true, "code":"200", "msg":successMsg.addCircle,"data":savedCircle});
    }
    catch(err) {
        res.send({"success":false, "code":"500", "msg":msg.addCircle,"err":err});
    }
}

service.editCircle = async (req,res) => {
    let circleEdit={
        name:req.body.name,
        description:req.body.description,
        code:req.body.code,
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

    const oneCircle = await Circle.getOneCircle(circleToFind);
    res.send({"success":true,"code":200,"msg":successMsg.getOneCircle,"data":oneCircle});
}

service.allCircle = async(req,res) => {
    let circleToFind = {
        query:{"status":{$ne:"deleted"}},
        projection:{}
    }

    const allCircle = await Circle.getAllCircle(circleToFind);

    res.send({"success":true,"code":200,"msg":successMsg.allCircle,"data":allCircle});
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
