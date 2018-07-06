import mongoose, { mongo } from 'mongoose';
import AutoIncrement from "mongoose-auto-increment";
AutoIncrement.initialize(mongoose);

const vendorSchema = mongoose.Schema({
    vendorId:{type:Number},
    vendorName :{type:String},
    vendorType :{type:String},
    activityName : {type:String},
    projectId :{type:mongoose.Schema.ObjectId},
    projectCode :{type:String},
    siteCount : {type:Number},
    poAmount : {type:Number},
    clientName:{type:String},
    createAt:{type: Date},
    updatedAt:{type: Date}
    
}, {collection : 'vendor'});

vendorSchema.plugin(AutoIncrement.plugin,{model:'vendor',field:'vendorId',startAt:1,incrementBy:1});

let vendorModel = mongoose.model('vendor',vendorSchema);

vendorModel.addVendor = (addToVendor) => {
    return addToVendor.save();
}

vendorModel.VendorPagination = (vendorToFind,type) => {
   if(type == 'count'){
        return vendorModel.find(vendorToFind.query).count();
    }
    else if(type=='download'){
       return vendorModel.find(vendorToFind.query);
    }
    else{
        return vendorModel.find(vendorToFind.query).sort({ _id:-1}).skip(vendorToFind.skip).limit(vendorToFind.limit);
    }
}

// KitModel.allKitCount = (kitToFind) => {
//     return KitModel.find(kitToFind.query,kitToFind.projection).count();
// }
export default vendorModel;