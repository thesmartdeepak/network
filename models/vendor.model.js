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
    circleName :{type:String},
    siteCount : {type:Number},
    poAmount : {type:Number},
    totalAmount:{type:Number},
    clientName:{type:String},
    createAt:{type: Date},
    updatedAt:{type: Date},
    year:{type: Number},
    month:{type: String},
    
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
vendorModel.vendorMis = (aggregate) =>{
    return vendorModel.aggregate(aggregate);
}
export default vendorModel;