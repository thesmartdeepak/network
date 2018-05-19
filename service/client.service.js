/**
 * @file(client.service.js) All service realted to client  
 * @author Shakshi Pandey <shakshi.kumari@limitlessmobile.com>
 * @version 1.0.0
 * @lastModifed 5-Feb-2018
 * @lastModifedBy Shakshi
 */

import client from '../models/client.model'
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

service.addclient = async (req,res) =>{
    let clientToAdd = client({
        name:req.body.name,
        ponumber:req.body.ponumber,
        shipmentno:req.body.shipmentno,
        // clientcode:req.body.clientcode,
        contactperson:req.body.contactperson,
        contactpersonNo:req.body.contactpersonNo,
        contactaddress:req.body.contactaddress,
        status: 'active',
        createAt:new Date()
    });
    const savedclient = await client.addclient(clientToAdd);
    try{
        res.send({"success":true, "code":"200", "msg":successMsg.addclient,"data":savedclient});
    }
    catch(err) {
        res.send({"success":false, "code":"500", "msg":msg.addclient,"err":err});
    }
}

service.editclient = async (req,res) => {
    let editclientData = {
        name:req.body.name,
        ponumber:req.body.ponumber,
        shipmentno:req.body.shipmentno,
        clientcode:req.body.clientcode,
        contactperson:req.body.contactperson,
        contactpersonNo:req.body.contactpersonNo,
        contactaddress:req.body.contactaddress,
        updatedAt: new Date()
    }

    let editToclient = {
        query:{_id:req.query.clientId},
        set:{"$set":editclientData}
    }
    
    const editclient = await client.editclient(editToclient);

    try{
        res.send({"success":true, "code":"200", "msg":successMsg.editclient,"data":editclient});
    }
    catch(err) {
        res.send({"success":false, "code":"500", "msg":msg.editclient,"err":err});
    }
}

service.oneclient = async (req,res) => {
    let clientToFind = {
        query: {_id:req.query.clientId},
        projection:{}
    }

    const oneclient = await client.getOneclient(clientToFind);
    res.send({"success":true,"code":200,"msg":successMsg.getOneclient,"data":oneclient});
}

service.allclient = async (req,res) => {
    let clientToFind = {
        query:{status:{$ne:'deleted'}},
        projection:{},
        limit:10,
        skip:(req.query.page-1)*10
    }

    const allclient = await client.clientPagination(clientToFind);
    res.send({"success":true,"code":200,"msg":successMsg.allclient,"data":allclient});
}

service.allclientCount = async(req,res) => {
    let clientToFind = {
        query:{status:{$ne:'deleted'}},
        projection:{}
    }

    const allclientCount = await client.allclientCount(clientToFind);
    res.send({"success":true,"code":200,"msg":successMsg.allclient,"data":allclientCount});
}

service.deleteclient = async(req,res) => {
    let clientEdit={
        status: 'deleted',
        updatedAt: new Date()
    }
    let clientToEdit={
        query:{"_id":req.body.clientId},
        set:{"$set":clientEdit}
    };
    try{
        const editclient= await client.editclient(clientToEdit);
        res.send({"success":true,"code":200,"msg":successMsg.deleteclient,"data":editclient});

    }
    catch(err){
        res.send({"success":false, "code":"500", "msg":msg.deleteclient,"err":err});
    }
}

export default service;