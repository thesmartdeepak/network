import mongoose from 'mongoose';
import AutoIncrement from "mongoose-auto-increment";
AutoIncrement.initialize(mongoose);

let ObjectId = mongoose.Schema.ObjectId;

const DprSchema = mongoose.Schema({
    dprId: {type: Number },
    projectCode:{type:String},
    operator:{type:String},
    activity: {type:String},
    itemDescription_Band:{type:String},
    siteId: {type:String},
    siteCount: {type:String},
    preDoneMonth: {type:String},
    preDoneDate: {type:Date},
    post_ActivityDoneMonth: {type:String},
    post_ActivityDoneDate: {type:Date},
    coordinatorRemark: {type:String},
    reportStatus: {type:String},
    reportAcceptanceStatus: {type:String},
    clientRemark: {type:String},
    Concaeenate:{type:String},
    AttemptCycle:{type:String},
    EmployeeId:{type:String},
    status:{type: String },
    createAt:{type: Date},
    updatedAt:{type: Date}
  }, {collection : 'dpr'});

DprSchema.plugin(AutoIncrement.plugin,{model:'dpr',field:'dprId',startAt:1,incrementBy:1});

let DprModel = mongoose.model('dpr',DprSchema);


DprModel.addDpr = (addToDpr)=> {
  return addToDpr.save();
}

DprModel.updateDpr = (EditDpr) => {
  return DprModel.update(EditDpr.query,EditDpr.set);
}

DprModel.getOneDpr = (dprToFind) => {
  return DprModel.findOne(dprToFind.query,dprToFind.projection)
}

DprModel.getAllDpr = (dprToFind) => {
  return DprModel.find(dprToFind.query,dprToFind.projection).sort({_id:-1});
}

export default DprModel;
