/**
 * @file(statusRemark.service.js) All service realted to asset
 * @author Shakshi Pandey <shakshi.kumari@limitlessmobile.com>
 * @version 1.0.0
 * @lastModifed 15-Jan-2018
 * @lastModifedBy Deepak
 */


import statusRemark from '../models/statusRemark.model'
import logger from '../core/logger/app.logger'
import successMsg from '../core/message/success.msg'
import utility from '../core/utility.js'
import msg from '../core/message/error.msg'


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
service.getAll = async (req,res) =>{

    // if(!req.query.clientId){
    //     res.send({success:false, code:500, msg:msg.clientId});
    // }

	try{
        
        // let clientId = utility.removeQuotationMarks(req.query.clientId);

		let dataToFind = {
			query:{},
			projection:{}
		};

		// if(req.query.clientId){
		// 	dataToFind.projection = {
		// 		statusRemark:1,status:1,statusRemarkId:1
		// 	}
        //     dataToFind.query = {
        //         clientId:clientId
        //     }
		// }
        
        const statusRemarkData = await statusRemark.getAll(dataToFind);

		res.send({"success":true, "code":200, "msg":successMsg.allStatusRemark, "data":statusRemarkData});
	}catch(err){
		logger.error('Error in getting statusRemark- ' + err);
		res.send({"success":false, "code":500, "msg":msg.getStatusRemark, "err":err});

	}
}

service.countAll = async (req,res) => {
    let dataToFind = {
        query:{},
        projection:{}
    };
    let count = await statusRemark.countAll(dataToFind);
    res.send({success:true,code:200,data:count});
}
/**
 * @description [calculation before update Device to db ]
 * @param  {[object]}
 * @param  {[object]}
 * @return {[object]}
 */

service.editStatusRemark = async (req, res) => {
    if(req.query.statusRemarkId=='')
    {
        res.send({"success":false, "code":"500", "msg":msg._id});
    }
    if(req.body.statusRemark=='')
    {
        res.send({"success":false, "code":"500", "msg":msg.statusRemark});
    }

    let statusRemarkToUpdate = {
        query:{_id:req.query.statusRemarkId},
        data:{
            $set:{
                statusRemark: req.body.statusRemark,
                type:req.body.type,
                updatedAt: new Date()
            }
        }
    };
    try {
        const savedStatusRemark = await statusRemark.editStatusRemark(statusRemarkToUpdate);
        
        res.send({"success":true, "code":"200", "msg":"user Type update succesfully","data":savedStatusRemark});
    }
    catch(err) {
        res.send({"success":false, "code":"500", "msg":msg.editStatusRemark,"err":err});
    }
}

service.oneStatusRemark = async (req,res) => {
    let dataToFind = {
        query:{_id:req.query.statusRemarkId},
        projection:{}
    };
    
    let statusRemarkData = await statusRemark.getOne(dataToFind);
    
    res.send({"success":true, "code":200, "msg":successMsg.oneStatusRemark, "data":statusRemarkData});
}

/**
 * @description [calculation before add Device to db and after adding asset ]
 * @param  {[object]}
 * @param  {[object]}
 * @return {[object]}
 */
service.addStatusRemark = async (req, res) => {
    

    let statusRemarkToAdd = statusRemark({
        statusRemark: req.body.statusRemark,
        type:req.body.type,
        status:'active',
        createAt:new Date(),
        updatedAt:new Date()
    });
    try {
        const savedStatusRemark = await statusRemark.addStatusRemark(statusRemarkToAdd);
        logger.info('Adding user type ...');
        res.send({"success":true, "code":"200", "msg":successMsg.addStatusRemark,"data":savedStatusRemark});
    }
    catch(err) {
        res.send({"success":false, "code":"500", "msg":msg.addStatusRemark,"err":err});
    }
}


/**
 * @description [calculation before delete Device to db and after delete Device]
 * @param  {[type]}
 * @param  {[type]}
 * @return {[type]}
 */
service.deleteStatusRemark = async (req, res) => {

    if(!req.body.statusRemarkId)
    {
        res.send({"success":false, "code":"500", "msg":msg._id});
    }
    let statusRemarkToDelete = {
        query:{_id:req.body.statusRemarkId},
        data:{"$set":{status:"deleted"}}
    }
    
    try{
        const removedStatusRemark = await statusRemark.editStatusRemark(statusRemarkToDelete);
        
        res.send({"success":true, "code":"200", "msg":successMsg.deleteStatusRemark,"data":removedStatusRemark});
    }
    catch(err) {
        
        res.send({"success":false, "code":"500", "msg":msg.deleteStatusRemark,"err":err});
    }
}

export default service;
