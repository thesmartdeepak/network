/**
 * @file(user.service.js) All service realted to user  
 * @author Shakshi Pandey <shakshi.kumari@limitlessmobile.com>
 * @version 1.0.0
 * @lastModifed 5-Feb-2018
 * @lastModifedBy Shakshi
 */

import operator from '../models/operator.model'
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

service.addoperator = async (req,res) =>{
    let operatorToAdd = operator({
        name:req.body.name,
        status: 'active',
        createAt:new Date()
    });
    const savedoperator = await operator.addoperator(operatorToAdd);
    try{
        res.send({"success":true, "code":"200", "msg":successMsg.addoperator,"data":savedoperator});
    }
    catch(err) {
        res.send({"success":false, "code":"500", "msg":msg.addoperator,"err":err});
    }
}

service.editoperator = async (req,res) => {
    let operatorEdit={
        name:req.body.name,
        updatedAt: new Date()
    }
    let operatorToEdit={
        query:{"_id":req.query.operatorId},
        set:{"$set":operatorEdit}
    };
    try{
        const editoperator= await operator.updateoperator(operatorToEdit);
        res.send({"success":true,"code":200,"msg":successMsg.editoperator,"data":editoperator});

    }
    catch(err){
        res.send({"success":false, "code":"500", "msg":msg.editoperator,"err":err});
    }
}

service.oneoperator = async (req,res) => {
    let operatorToFind = {
        query: {_id:req.query.operatorId},
        projection:{}
    }

    const oneoperator = await operator.getOneoperator(operatorToFind);
    res.send({"success":true,"code":200,"msg":successMsg.getOneoperator,"data":oneoperator});
}

service.alloperator = async(req,res) => {
    let operatorToFind = {
        query:{"status":{$ne:"deleted"}},
        projection:{}
    }

    const alloperator = await operator.getAlloperator(operatorToFind);

    res.send({"success":true,"code":200,"msg":successMsg.alloperator,"data":alloperator});
}

service.deleteoperator = async(req,res) => {
    let operatorEdit={
        status: 'deleted',
        updatedAt: new Date()
    }
    let operatorToEdit={
        query:{"_id":req.body.operatorId},
        set:{"$set":operatorEdit}
    };
    try{
        const editoperator= await operator.updateoperator(operatorToEdit);
        res.send({"success":true,"code":200,"msg":successMsg.deleteoperator,"data":editoperator});

    }
    catch(err){
        res.send({"success":false, "code":"500", "msg":msg.deleteoperator,"err":err});
    }
}

export default service;
