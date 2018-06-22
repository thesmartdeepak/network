import mongoose from 'mongoose';
import AutoIncrement from "mongoose-auto-increment";
AutoIncrement.initialize(mongoose);

const operatorSchema = mongoose.Schema({
    operatorId: {type: Number },
    name: {type:String , index:{unique:true} },
    status:{type: String },
    createAt:{type: Date},
    updatedAt:{type: Date}
  }, {collection : 'operator'});

  operatorSchema.plugin(AutoIncrement.plugin,{model:'operator',field:'operatorId',startAt:1,incrementBy:1});

let operatorModel = mongoose.model('operator',operatorSchema);


operatorModel.addoperator = (addTooperator)=> {
  return addTooperator.save();
}

operatorModel.updateoperator = (Editoperator) => {
  return operatorModel.update(Editoperator.query,Editoperator.set);
}

operatorModel.getOneoperator = (operatorToFind) => {
  return operatorModel.findOne(operatorToFind.query,operatorToFind.projection)
}

operatorModel.getAlloperator = (operatorToFind) => {
  return operatorModel.find(operatorToFind.query,operatorToFind.projection).sort({_id:-1});
}
operatorModel.totaloperatorList = (operatorToFind) => {
  return operatorModel.find(operatorToFind.query,operatorToFind.projection).skip(operatorToFind.skip).limit(operatorToFind.limit);
}

export default operatorModel;
