import mongoose from 'mongoose';
import AutoIncrement from "mongoose-auto-increment";
AutoIncrement.initialize(mongoose);

const clientSchema = mongoose.Schema({
    clientId:{type:Number},
    name: {type:String , index:{unique:true} },
    ponumber:{type:String},
    shipmentno: {type: String},
    clientcode: {type:String},
    contactperson: {type:String},
    contactpersonNo: {type:String},
    contactaddress: {type:String},
    status:{type: String },
    createAt:{type: Date},
    updatedAt:{type: Date}
}, {collection : 'client'});

clientSchema.plugin(AutoIncrement.plugin,{model:'client',field:'clientId',startAt:1,incrementBy:1});

let clientModel = mongoose.model('client',clientSchema);

clientModel.addclient = (addToclient)=> {
    return addToclient.save();
}

clientModel.editclient = (editToclient) => {
    return clientModel.update(editToclient.query,editToclient.set);
}

clientModel.getOneclient = (editToclient) => {
    return clientModel.findOne(editToclient.query,editToclient.projection)
}

clientModel.clientPagination = (clientToFind) => {
    return clientModel.find(clientToFind.query,clientToFind.projection).sort({_id:-1}).skip(clientToFind.skip).limit(clientToFind.limit);
}

clientModel.allclientCount = (clientToFind) => {
    return clientModel.find(clientToFind.query,clientToFind.projection).count();
}

export default clientModel;