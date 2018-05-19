import mongoose from 'mongoose';
import AutoIncrement from "mongoose-auto-increment";
AutoIncrement.initialize(mongoose);

const clientSchema = mongoose.Schema({
    clientId:{type:Number},
    name: {type:String , index:{unique:true} },
    poNumber:{type:String},
    shipmentNo: {type: String},
    clientCode: {type:String},
    contactPerson: {type:String},
    contactPersonNo: {type:String},
    contactAddress: {type:String},
    billingAddress: {type:String},
    shippingAddress: {type:String},
    pan:{type:String},
    gstin:{type:String},
    status:{type: String },
    createAt:{type: Date},
    updatedAt:{type: Date}
}, {collection : 'client'});

clientSchema.plugin(AutoIncrement.plugin,{model:'client',field:'clientId',startAt:1,incrementBy:1});

let clientModel = mongoose.model('client',clientSchema);

clientModel.addClient = (addToClient)=> {
    return addToClient.save();
}

clientModel.editClient = (editToClient) => {
    return clientModel.update(editToClient.query,editToClient.set);
}

clientModel.getOneClient = (editToClient) => {
    return clientModel.findOne(editToClient.query,editToClient.projection)
}

clientModel.clientPagination = (clientToFind) => {
    return clientModel.find(clientToFind.query,clientToFind.projection).sort({_id:-1}).skip(clientToFind.skip).limit(clientToFind.limit);
}

clientModel.allClientCount = (clientToFind) => {
    return clientModel.find(clientToFind.query,clientToFind.projection).count();
}

export default clientModel;