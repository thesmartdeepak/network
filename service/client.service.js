/**
 * @file(client.service.js) All service realted to client  
 * @author Shakshi Pandey <shakshi.kumari@limitlessmobile.com>
 * @version 1.0.0
 * @lastModifed 5-Feb-2018
 * @lastModifedBy Shakshi
 */

import Client from '../models/client.model'
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

service.addClient = async (req,res) =>{
    let clientToAdd = Client({
        name:req.body.name,
        poNumber:req.body.poNumber,
        shipmentNo:req.body.shipmentNo,
        // clientcode:req.body.clientcode,
        contactPerson:req.body.contactPerson,
        contactPersonNo:req.body.contactPersonNo,
        contactAddress:req.body.contactAddress,
        status: 'active',
        createAt:new Date()
    });
    const savedClient = await Client.addClient(clientToAdd);
    try{
        res.send({"success":true, "code":"200", "msg":successMsg.addClient,"data":savedClient});
    }
    catch(err) {
        res.send({"success":false, "code":"500", "msg":msg.addClient,"err":err});
    }
}

service.editClient = async (req,res) => {
    let editClientData = {
        name:req.body.name,
        poNumber:req.body.poNumber,
        shipmentNo:req.body.shipmentNo,
        clientCode:req.body.clientCode,
        contactPerson:req.body.contactPerson,
        contactPersonNo:req.body.contactPersonNo,
        contactAddress:req.body.contactAddress,
        updatedAt: new Date()
    }

    let editToClient = {
        query:{_id:req.query.clientId},
        set:{"$set":editClientData}
    }
    
    const editClient = await client.editClient(editToClient);

    try{
        res.send({"success":true, "code":"200", "msg":successMsg.editClient,"data":editClient});
    }
    catch(err) {
        res.send({"success":false, "code":"500", "msg":msg.editClient,"err":err});
    }
}

service.oneClient = async (req,res) => {
    let clientToFind = {
        query: {_id:req.query.clientId},
        projection:{}
    }

    const oneClient = await Client.getOneclient(clientToFind);
    res.send({"success":true,"code":200,"msg":successMsg.getOneClient,"data":oneClient});
}

service.allClient = async (req,res) => {
    let clientToFind = {
        query:{status:{$ne:'deleted'}},
        projection:{},
        limit:10,
        skip:(req.query.page-1)*10
    }

    const allClient = await Client.clientPagination(clientToFind);
    res.send({"success":true,"code":200,"msg":successMsg.allClient,"data":allClient});
}

service.allClientCount = async(req,res) => {
    let clientToFind = {
        query:{status:{$ne:'deleted'}},
        projection:{}
    }

    const allClientCount = await Client.allClientCount(clientToFind);
    res.send({"success":true,"code":200,"msg":successMsg.allClient,"data":allClientCount});
}

service.deleteClient = async(req,res) => {
    let clientEdit={
        status: 'deleted',
        updatedAt: new Date()
    }
    let clientToEdit={
        query:{"_id":req.body.clientId},
        set:{"$set":clientEdit}
    };
    try{
        const editClient= await Client.editClient(clientToEdit);
        res.send({"success":true,"code":200,"msg":successMsg.deleteClient,"data":editClient});

    }
    catch(err){
        res.send({"success":false, "code":"500", "msg":msg.deleteClient,"err":err});
    }
}

export default service;