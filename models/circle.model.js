import mongoose from 'mongoose';
import AutoIncrement from "mongoose-auto-increment";
AutoIncrement.initialize(mongoose);

let ObjectId = mongoose.Schema.ObjectId;

const CircleSchema = mongoose.Schema({
    circleId: {type: Number },
    regionId: {type:ObjectId},
    clientId:{type: ObjectId},
    name: {type:String},
    description: {type: String},
    code: {type: String},
    clientCircleCode:{type:String},
    status:{type: String },
    createAt:{type: Date, default: new Date()},
    updatedAt:{type: Date, default: new Date()}
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
  return CircleModel.findOne(circleToFind.query,circleToFind.projection);
}

CircleModel.getAllCircle = (circleToFind) => {
  // return CircleModel.find(circleToFind.query,circleToFind.projection).sort({_id:-1}).limit(circleToFind.limit).skip(circleToFind.skip);
  let aggregate = [
    { 
      $lookup:{
          from: "client",
          localField: "clientId",
          foreignField: "_id",
          as: "client"
        }  
    },
    {
      $lookup:{
        from: "region",
        localField: "regionId",
        foreignField: "_id",
        as: "region"
      }
    },
    { $match: { status: {$ne:"deleted"} } },
    { $sort: { _id:-1} },
    { $limit: circleToFind.limit },
    { $skip: circleToFind.skip }
  ];
  return CircleModel.aggregate(aggregate);
}

CircleModel.getAllCount = (circleToFind) => {
  return CircleModel.find(circleToFind.query).count();
}

CircleModel.totalProjectCodeList = (circleToFind) => {
  return CircleModel.find(circleToFind.query,circleToFind.projection).skip(circleToFind.skip).limit(circleToFind.limit);
}

CircleModel.getSimpleCircle = (circleTOFind) => {
  return CircleModel.find(circleTOFind.query,circleTOFind.projection);
}

export default CircleModel;
