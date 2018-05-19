import mongoose from 'mongoose';
import AutoIncrement from "mongoose-auto-increment";
AutoIncrement.initialize(mongoose);

ObjectId = mongoose.Schema.ObjectId;

const ProjectTypeSchema = mongoose.Schema({
    projectTypeId: {type: Number },
    clientId: {type:ObjectId},
    circleId: {type:ObjectId},
    name: {type:String , index:{unique:true} },
    description: {type: String},
    code: {type: String , index:{unique:true}  },
    status:{type: String },
    createAt:{type: Date},
    updatedAt:{type: Date}
  }, {collection : 'projectType'});

ProjectTypeSchema.plugin(AutoIncrement.plugin,{model:'projectType',field:'projectTypeId',startAt:1,incrementBy:1});

let ProjectTypeModel = mongoose.model('projectType',ProjectTypeSchema);
