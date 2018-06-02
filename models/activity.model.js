import mongoose from 'mongoose';
import AutoIncrement from "mongoose-auto-increment";
AutoIncrement.initialize(mongoose);

const ActivitySchema = mongoose.Schema({
    activityId: {type: Number },
    name: {type:String  },
    description: {type: String},
    status:{type: String },
    createAt:{type: Date},
    updatedAt:{type: Date}
}, {collection : 'activity'});

ActivitySchema.plugin(AutoIncrement.plugin,{model:'activity',field:'activityId',startAt:1,incrementBy:1});

let ActivityModel = mongoose.model('activity',ActivitySchema);

ActivityModel.addActivity = (addToActivity)=> {
    return addToActivity.save();
}

ActivityModel.editActivity = (editToActivity) => {
    return ActivityModel.update(editToActivity.query,editToActivity.set);
}

ActivityModel.getOneActivity = (editToActivity) => {
    return ActivityModel.findOne(editToActivity.query,editToActivity.projection)
}
ActivityModel.getAllActivity = (activityToFind) => {
    return ActivityModel.find(activityToFind.query,activityToFind.projection).sort({_id:-1}).limit(activityToFind.limit).skip(activityToFind.skip);
    // let aggregate = [
    //   { 
    //     $lookup:{
    //         from: "client",
    //         localField: "clientId",
    //         foreignField: "_id",
    //         as: "client"
    //       }  
    //   },
    //   { 
    //     $lookup:{
    //         from: "projecttype",
    //         localField: "projectTypeId",
    //         foreignField: "_id",
    //         as: "projecttype"
    //       }  
    //   },
    //   { $match: { status: {$ne:"deleted"} } },
    //   { $sort: { _id:-1} },
    //   { $limit: circleToFind.limit },
    //   { $skip: circleToFind.skip }
    // ];
    // return ActivityModel.aggregate(aggregate);
  }
ActivityModel.ActivityPagination = (ActivityToFind) => {
    return ActivityModel.find(ActivityToFind.query,ActivityToFind.projection).sort({_id:-1}).skip(ActivityToFind.skip).limit(ActivityToFind.limit);
}

ActivityModel.allActivityCount = (ActivityToFind) => {
    return ActivityModel.find(ActivityToFind.query,ActivityToFind.projection).count();
}

export default ActivityModel;