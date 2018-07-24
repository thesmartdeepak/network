import mongoose from 'mongoose';
import AutoIncrement from "mongoose-auto-increment";
AutoIncrement.initialize(mongoose);

const projectTypeSchema = mongoose.Schema({
    projectTypeId: {type: Number },
    name: {type:String , index:{unique:true} },
    departmentId:{type:mongoose.Schema.ObjectId},
    status:{type: String },
    createAt:{type: Date},
    updatedAt:{type: Date}
  }, {collection : 'projectType'});

  projectTypeSchema.plugin(AutoIncrement.plugin,{model:'projectType',field:'projectTypeId',startAt:1,incrementBy:1});

let projectTypeModel = mongoose.model('projectType',projectTypeSchema);


projectTypeModel.addProjectType = (addToProjectType)=> {
  return addToProjectType.save();
}

projectTypeModel.updateProjectType = (EditProjectType) => {
  return projectTypeModel.update(EditProjectType.query,EditProjectType.set);
}

projectTypeModel.getOneProjectType = (projectTypeToFind) => {
  return projectTypeModel.findOne(projectTypeToFind.query,projectTypeToFind.projection)
}
projectTypeModel.getAllprojectType = (projectTypeToFind) => {
  return projectTypeModel.find(projectTypeToFind.query,projectTypeToFind.projection)
}
// projectTypeModel.getAllProjectType = (projectTypeToFind) => {
//   return projectTypeModel.find(projectTypeToFind.query,projectTypeToFind.projection).sort({_id:-1});
// }

projectTypeModel.getAllProjectType = (projectTypeToFind) => {

  // return CircleModel.find(circleToFind.query,circleToFind.projection).sort({_id:-1}).limit(circleToFind.limit).skip(circleToFind.skip);
  let aggregate = [
    { 
      $lookup:{
          from: "department",
          localField: "departmentId",
          foreignField: "_id",
          as: "department"
        }  
    },
    
    { $match: { status: {$ne:"deleted"} } },
    { $sort: { _id:-1} },
    { $skip: projectTypeToFind.skip },
    { $limit: projectTypeToFind.limit },
  ];
  return projectTypeModel.aggregate(aggregate);
}
projectTypeModel.totalProjectTypeList = (projectTypeToFind) => {
  
  return projectTypeModel.find(projectTypeToFind.query,projectTypeToFind.projection);
}

projectTypeModel.getAllProjectTypeCount = (projectTypeToFind) => {
  
  return projectTypeModel.find(projectTypeToFind.query).count();
}
export default projectTypeModel;
