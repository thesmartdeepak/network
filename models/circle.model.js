import mongoose from 'mongoose';
import AutoIncrement from "mongoose-auto-increment";
AutoIncrement.initialize(mongoose);

let ObjectId = mongoose.Schema.ObjectId;

const CircleSchema = mongoose.Schema({
    circleId: {type: Number },
    regionId: {type:ObjectId},
    clientId:{type: ObjectId},
    name: {type:String , index:{unique:true} },
    description: {type: String},
    code: {type: String , index:{unique:true}  },
    clientCircleCode:{type:String},
    status:{type: String },
    createAt:{type: Date},
    updatedAt:{type: Date}
  }, {collection : 'circle'});

CircleSchema.plugin(AutoIncrement.plugin,{model:'circle',field:'circleId',startAt:1,incrementBy:1});

let CircleModel = mongoose.model('circle',CircleSchema);

CircleModel.ObjectId = ObjectId;

CircleModel.addCircle = (addToCircle)=> {
  return addToCircle.save();
}

CircleModel.updateCircle = (EditCircle) => {
  return CircleModel.update(EditCircle.query,EditCircle.set);
}

CircleModel.getOneCircle = (circleToFind) => {
  return CircleModel.findOne(circleToFind.query,circleToFind.projection)
}

CircleModel.getAllCircle = (circleToFind) => {
  return CircleModel.find(circleToFind.query,circleToFind.projection).sort({_id:-1});
}

export default CircleModel;
