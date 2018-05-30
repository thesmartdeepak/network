/**
 * @file(device.model.js) With Schema for device model and all the db query function 
 * @author Shakshi Pandey <shakshi.kumari@limitlessmobile.com>
 * @version 1.0.0
 * @lastModifed 11-Jan-2018
 * @lastModifedBy Shakshi
 */

import mongoose from 'mongoose';
import AutoIncrement from "mongoose-auto-increment";
AutoIncrement.initialize(mongoose);

/**
 * [DeviceSchema is used for device data validating aginst schema]
 * @type {[type]}
 */
const StatusRemarkSchema = mongoose.Schema({
    statusRemarkId:{type:Number},
    statusRemark: {type: String },
    type:{type:String},
    status:{type: String },
    createAt:{type: Date},
    updatedAt:{type: Date}
}, {collection : 'statusRemark'});

StatusRemarkSchema.plugin(AutoIncrement.plugin,{model:'statusRemark',field:'statusRemarkId',startAt:1,incrementBy:1});

let StatusRemarkModel = mongoose.model('statusRemark', StatusRemarkSchema);

/**
 *@description [is used for getting all data of devices from db]
 * @return {object}
 */
StatusRemarkModel.getAll = (dataToFind) => {
    return StatusRemarkModel.find(dataToFind.query,dataToFind.projection);
}

StatusRemarkModel.countAll = (dataToFind) => {
    return StatusRemarkModel.find(dataToFind.query,dataToFind.projection).count();
}

/**
 *@description [is used for getting one data of devices from db]
 * @return {object}
 */
StatusRemarkModel.getOne = (dataToFind) => {
    return StatusRemarkModel.findOne(dataToFind.query);
}

/**
 * @description [add one device to db]
 * @param  {object}
 * @return {[object]}
 */
StatusRemarkModel.addStatusRemark = (statusRemarkToAdd) => {
    return statusRemarkToAdd.save();
}

/**
 * @description [update one device to db]
 * @param  {object}
 * @return {[object]}
 */
StatusRemarkModel.editStatusRemark = (statusRemarkToEdit) =>{
    return StatusRemarkModel.update(statusRemarkToEdit.query,statusRemarkToEdit.data)
}

/**
 * @description [responsible for remove devices from db based on condition]
 * @param  {object}
 * @return {[object]}
 */
StatusRemarkModel.removeStatusRemark = (_id) => {
    return StatusRemarkModel.remove({_id: _id});
}

/**
 * @description [make used by other module]
 */
export default StatusRemarkModel;
