import mongoose, { mongo } from 'mongoose';
import AutoIncrement from "mongoose-auto-increment";
AutoIncrement.initialize(mongoose);

const cabSchema = mongoose.Schema({
    cabId:{type:Number},
    vendorName :{type:String},
    vendorType :{type:String},
    projectId :{type:mongoose.Schema.ObjectId},
    projectCode :{type:String},
    amount :{type:Number},
    totalAmount :{type:Number},
    clientName:{type:String},
    circleName:{type:String},
    numberOfDays :{type:Number},
    createAt:{type: Date},
    updatedAt:{type: Date}
    
}, {collection : 'cab'});

cabSchema.plugin(AutoIncrement.plugin,{model:'cab',field:'cabId',startAt:1,incrementBy:1});

let cabModel = mongoose.model('cab',cabSchema);

cabModel.addCab = (addToCab) => {
    return addToCab.save();
}

cabModel.CabPagination = (cabToFind,type) => {
   if(type == 'count'){
        return cabModel.find(cabToFind.query).count();
    }
    else if(type=='download'){
       return cabModel.find(cabToFind.query);
    }
    else{
        return cabModel.find(cabToFind.query).sort({ _id:-1}).skip(cabToFind.skip).limit(cabToFind.limit);
    }
}

// KitModel.allKitCount = (kitToFind) => {
//     return KitModel.find(kitToFind.query,kitToFind.projection).count();
// }
export default cabModel;