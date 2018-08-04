import mongoose, { mongo } from 'mongoose';
import AutoIncrement from "mongoose-auto-increment";
AutoIncrement.initialize(mongoose);

const KitSchema = mongoose.Schema({
    kitId:{type:Number},
    empUserId:{type: mongoose.Schema.ObjectId},
    employeeId:{type:String},
    empName:{type:String},
    designation:{type:String},
    projectCode:{type:String},
    clientName:{type:String},
    clientId:{type:String},
    circleName:{type:String},
    circleId:{type:mongoose.Schema.ObjectId},
    kitRent:{type:Number},
    month:{type:String},
    paidDays:{type:String},
    perDayAmount:{type:Number},
    year: {type:Number},
    kitName:{type:String},
    operator:{type:String},
   status :{type:String},
    createAt:{type: Date},
    updatedAt:{type: Date}
    
}, {collection : 'kit'});

KitSchema.plugin(AutoIncrement.plugin,{model:'kit',field:'kitId',startAt:1,incrementBy:1});

let KitModel = mongoose.model('kit',KitSchema);

KitModel.addKit = (addToKit)=> {
    return addToKit.save();
}
KitModel.kitPagination = (kitToFind,type) => {
   if(type == 'count'){
        return KitModel.find(kitToFind.query).count();
    }
    else if(type=='download'){
       return KitModel.find(kitToFind.query);
    }
    else{
        return KitModel.find(kitToFind.query).sort({ _id:-1}).skip(kitToFind.skip).limit(kitToFind.limit);
    }
}

KitModel.allKitCount = (kitToFind) => {
    return KitModel.find(kitToFind.query,kitToFind.projection).count();
};

KitModel.oneKit = (kitToFind) =>{
  return KitModel.find(kitToFind.query,kitToFind.projection);
};

KitModel.kitRetrun=(kitToEdit)=>{
    return KitModel.update(kitToEdit.query,kitToEdit.set);
};
KitModel.kitMis = (dataToFind) =>{
    return KitModel.find(dataToFind.query,dataToFind.projection);
}
export default KitModel;