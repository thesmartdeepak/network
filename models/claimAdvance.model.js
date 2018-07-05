import mongoose, { mongo } from 'mongoose';
import AutoIncrement from "mongoose-auto-increment";
AutoIncrement.initialize(mongoose);

const claimAdvanceSchema = mongoose.Schema({
    date:{type:Date},
    claimAdvanceId:{type:Number},
    month:{type:String},
    empId:{type:String},
    empUserId:{type:mongoose.Schema.ObjectId},
    empName:{type:String},
    projectId:{type:mongoose.Schema.ObjectId},
    projectCode:{type:String},
    circleId:{type:mongoose.Schema.ObjectId},
    circleName:{type:String},
    circleCode:{type:mongoose.Schema.ObjectId},
    totalTransfer:{type:Number},
    status :{type:String},
    createAt:{type: Date},
    updatedAt:{type: Date}
    
}, {collection : 'claimAdvance'});

claimAdvanceSchema.plugin(AutoIncrement.plugin,{model:'claimAdvance',field:'claimAdvanceId',startAt:1,incrementBy:1});

let claimAdvanceModel = mongoose.model('claimAdvance',claimAdvanceSchema);

claimAdvanceModel.addclaimAdvance = (addToclaimAdvance)=> {
    return addToclaimAdvance.save();
}
claimAdvanceModel.claimAdvancePagination = (claimAdvanceToFind,type) => {
   if(type == 'count'){
        return claimAdvanceModel.find(claimAdvanceToFind.query).count();
    }
    else if(type=='download'){
       return claimAdvanceModel.find(claimAdvanceToFind.query);
    }
    else{
        return claimAdvanceModel.find(claimAdvanceToFind.query).sort({ _id:-1}).skip(claimAdvanceToFind.skip).limit(claimAdvanceToFind.limit);
    }
}

claimAdvanceModel.alladdclaimAdvanceCount = (addclaimAdvanceToFind) => {
    return claimAdvanceModel.find(addclaimAdvanceToFind.query,addclaimAdvanceToFind.projection).count();
}
export default claimAdvanceModel;