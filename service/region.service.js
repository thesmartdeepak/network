/**
 * @file(user.service.js) All service realted to user  
 * @author Shakshi Pandey <shakshi.kumari@limitlessmobile.com>
 * @version 1.0.0
 * @lastModifed 5-Feb-2018
 * @lastModifedBy Shakshi
 */

import Region from '../models/region.model'
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

service.addRegion = async (req,res) =>{
    let regionToAdd = Region({
        name:req.body.name,
        description:req.body.description,
        code:req.body.code,
        status: 'active',
        createAt:new Date()
    });
    const savedRegion = await Region.addRegion(regionToAdd);
    try{
        res.send({"success":true, "code":"200", "msg":successMsg.addRegion,"data":savedRegion});
    }
    catch(err) {
        res.send({"success":false, "code":"500", "msg":msg.addRegion,"err":err});
    }
}

service.editRegion = async (req,res) => {
    let regionEdit={
        name:req.body.name,
        description:req.body.description,
        code:req.body.code,
        updatedAt: new Date()
    }
    let regionToEdit={
        query:{"_id":req.query.regionId},
        set:{"$set":regionEdit}
    };
    try{
        const editRegion= await Region.updateRegion(regionToEdit);
        res.send({"success":true,"code":200,"msg":successMsg.editRegion,"data":editRegion});

    }
    catch(err){
        res.send({"success":false, "code":"500", "msg":msg.editRegion,"err":err});
    }
}

service.oneRegion = async (req,res) => {
    let regionToFind = {
        query: {_id:req.query.regionId},
        projection:{}
    }

    const oneRegion = await Region.getOneRegion(regionToFind);
    res.send({"success":true,"code":200,"msg":successMsg.getOneRegion,"data":oneRegion});
}

service.allRegion = async(req,res) => {
    let regionToFind = {
        query:{"status":{$ne:"deleted"}},
        projection:{}
    }

    const allRegion = await Region.getAllRegion(regionToFind);

    res.send({"success":true,"code":200,"msg":successMsg.allRegion,"data":allRegion});
}

service.deleteRegion = async(req,res) => {
    let regionEdit={
        status: 'deleted',
        updatedAt: new Date()
    }
    let regionToEdit={
        query:{"_id":req.body.regionId},
        set:{"$set":regionEdit}
    };
    try{
        const editRegion= await Region.updateRegion(regionToEdit);
        res.send({"success":true,"code":200,"msg":successMsg.deleteRegion,"data":editRegion});

    }
    catch(err){
        res.send({"success":false, "code":"500", "msg":msg.deleteRegion,"err":err});
    }
}

export default service;
