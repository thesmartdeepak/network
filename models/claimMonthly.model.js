import mongoose, { mongo } from 'mongoose';
import AutoIncrement from "mongoose-auto-increment";
AutoIncrement.initialize(mongoose);

const claimMonthlySchema = mongoose.Schema({
    date:{type:Date},
    claimMonthlyId:{type:Number},
    month:{type:String},
    year:{type:Number},
    empId:{type:String},
    empUserId:{type:mongoose.Schema.ObjectId},
    empName:{type:String},
    projectId:{type:mongoose.Schema.ObjectId},
    projectCode:{type:String},
    circleId:{type:mongoose.Schema.ObjectId},
    circleName:{type:String},
    circleCode:{type:mongoose.Schema.ObjectId},
    transferAmount:{type:Number},
    passAmount:{type:Number},
    status :{type:String},
    createAt:{type: Date},
    updatedAt:{type: Date}
    
}, {collection : 'claimMonthly'});

claimMonthlySchema.plugin(AutoIncrement.plugin,{model:'claimMonthly',field:'claimMonthlyId',startAt:1,incrementBy:1});

let claimMonthlyModel = mongoose.model('claimMonthly',claimMonthlySchema);

claimMonthlyModel.addclaimMonthly = (addToclaimMonthly)=> {
    return addToclaimMonthly.save();
}
claimMonthlyModel.claimMonthlyPagination = (claimMonthlyToFind,type) => {
   if(type == 'count'){
        return claimMonthlyModel.find(claimMonthlyToFind.query).count();
    }
    else if(type=='download'){
       return claimMonthlyModel.find(claimMonthlyToFind.query);
    }
    else{
        return claimMonthlyModel.find(claimMonthlyToFind.query).sort({ _id:-1}).skip(claimMonthlyToFind.skip).limit(claimMonthlyToFind.limit);
    }
}

claimMonthlyModel.alladdclaimMonthlyCount = (addclaimMonthlyToFind) => {
    return claimMonthlyModel.find(addclaimMonthlyToFind.query,addclaimMonthlyToFind.projection).count();
}

claimMonthlyModel.claimMonthlyMis = (aggregate) =>{
    // console.log("aggregate",aggregate);
    return claimMonthlyModel.aggregate(aggregate);
}
// claimAdvanceModel.claimAdvanceMis = (aggregate) =>{
//     return claimAdvanceModel.aggregate(aggregate);
// } 
export default claimMonthlyModel;