/**
 * @file(userType.service.js) All service realted to asset
 * @author Shakshi Pandey <shakshi.kumari@limitlessmobile.com>
 * @version 1.0.0
 * @lastModifed 15-Jan-2018
 * @lastModifedBy Deepak
 */


import userTypeConfig from '../models/userType.model'
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
		// 		userType:1,status:1,userTypeId:1
		// 	}
        //     dataToFind.query = {
        //         clientId:clientId
        //     }
		// }
        
		const userType = await userTypeConfig.getAll(dataToFind);
        logger.info('sending all userType...');
		res.send({"success":true, "code":200, "msg":successMsg.allUserType, "data":userType});
	}catch(err){
		logger.error('Error in getting userType- ' + err);
		res.send({"success":false, "code":500, "msg":msg.getUserType, "err":err});

	}
}

service.countAll = async (req,res) => {
    let dataToFind = {
        query:{},
        projection:{}
    };
    let count = await userTypeConfig.countAll(dataToFind);
    res.send({success:true,code:200,data:count});
}
/**
 * @description [calculation before update Device to db ]
 * @param  {[object]}
 * @param  {[object]}
 * @return {[object]}
 */

service.editUserType = async (req, res) => {
    if(req.body.clientId=='')
    {
        res.send({"success":false, "code":"500", "msg":msg.clientId});
    }
    if(req.body.userType=='')
    {
        res.send({"success":false, "code":"500", "msg":msg.userType});
    }

    // if(!req.body._id)
    // {
    //     res.send({"success":false, "code":"500", "msg":msg._id});
    // }
    let userTypeToUpdate = {
        query:{_id:req.body.userTypeId},

        data:{
            $set:{
                userType: req.body.userType,
                status: req.body.status || "Active",
                updatedAt: new Date()
            }
        }
    };
    try {
        const savedUserType = await userTypeConfig.editUserType(userTypeToUpdate);
        logger.info('Updating user type ...');
        res.send({"success":true, "code":"200", "msg":"user Type update succesfully","data":savedUserType});
    }
    catch(err) {
        logger.error('Error in updating UserType- ' + err);
        res.send({"success":false, "code":"500", "msg":msg.editUserType,"err":err});
    }
}

/**
 * @description [calculation before add Device to db and after adding asset ]
 * @param  {[object]}
 * @param  {[object]}
 * @return {[object]}
 */
service.addUserType = async (req, res) => {
    if(!req.body.clientId)
    {
        res.send({"success":false, "code":"500", "msg":msg.clientId});
    }
    if(!req.body.userType)
    {
        res.send({"success":false, "code":"500", "msg":msg.userType});
    }
    let clientId = utility.removeQuotationMarks(req.body.clientId);

    let userTypeToAdd = userTypeConfig({
        clientId : clientId,
        userType: req.body.userType,
        status: req.body.status,
        createAt: new Date()
    });
    try {
        const savedUserType = await userTypeConfig.addUserType(userTypeToAdd);
        logger.info('Adding user type ...');
        res.send({"success":true, "code":"200", "msg":"user Type added successfully!!","data":savedUserType});
    }
    catch(err) {
        logger.error('Error in getting UserType- ' + err);
        res.send({"success":false, "code":"500", "msg":msg.addUserType,"err":err});
    }
}


/**
 * @description [calculation before delete Device to db and after delete Device]
 * @param  {[type]}
 * @param  {[type]}
 * @return {[type]}
 */
service.deleteUserType = async (req, res) => {

    if(!req.body._id)
    {
        res.send({"success":false, "code":"500", "msg":msg._id});
    }
    let userTypeToDelete = req.body._id;
    
    console.log(userTypeToDelete);
    try{
        const removedUserType = await userTypeConfig.removedUserType(userTypeToDelete);
        logger.info('Deleted user type- ' + removedUserType);
        res.send({"success":true, "code":"200", "msg":successMsg.deleteUserType,"data":removedUserType});
    }
    catch(err) {
        logger.error('Failed to delete userType- ' + err);
        res.send({"success":false, "code":"500", "msg":msg.deleteUserType,"err":err});
    }
}

export default service;
