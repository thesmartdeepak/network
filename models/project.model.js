import mongoose from 'mongoose';
import AutoIncrement from "mongoose-auto-increment";
AutoIncrement.initialize(mongoose);

const projectSchema = mongoose.Schema({
    projectId:{type:Number},
    userId:{type: mongoose.Schema.ObjectId},
    departmentId:{type: mongoose.Schema.ObjectId},
    projectTypeId:{type: mongoose.Schema.ObjectId},
    projectCode: {type:String},
    operator:{type:String},
    activity: {type: String},
    activityId: {type: mongoose.Schema.ObjectId},
    itemDescription_Band: {type:String},
    siteId: {type:String},
    siteCount: {type:String},
    preDoneMonth: {type:String},
    preDoneDate: {type:Date},
    post_ActivityDoneMonth: {type:String},
    post_ActivityDoneDate:{type:Date},
    activityStatus :{type: String },
    remark:{type:String},
    reportStatus:{type: String},
    reportAcceptanceStatus:{type: String },
    clientRemark:{type: String },
    concatenate:{type: String },
    attemptCycle:{type: String },
    employeeId:{type: String },
    employeeName:{type: String },
    poNumber:{type: String },
    shippmentNo:{type: String },
    l1Approval :{type: String },
    l2Approval :{type: String },
    poValue :{type: String },
    startTime:{type: String },
    endTime:{type: String },
    advance:{type: String },
    approved:{type: String },
    projectStatus :{type:String},
    createAt:{type: Date},
    updatedAt:{type: Date}
}, {collection : 'project'});

projectSchema.plugin(AutoIncrement.plugin,{model:'project',field:'projectId',startAt:1,incrementBy:1});

let projectModel = mongoose.model('project',projectSchema);

projectModel.addProject = (addToProject)=> {
    return addToProject.save();
}

projectModel.addMultiProject = (addToProject)=> {
    return projectModel.insertMany(addToProject);
}

projectModel.editProject = (editToProject) => {
    return projectModel.update(editToProject.query,editToProject.set);
}

projectModel.getOneProject = (editToProject) => {
    return projectModel.findOne(editToProject.query,editToProject.projection)
}

projectModel.projectPagination = (projectToFind) => {
    let aggregate = [
        { 
          $lookup:{
              from: "user",
              localField: "userId",
              foreignField: "_id",
              as: "user"
            }
        },
        { $match: { status: {$ne:"deleted"} } },
        { $sort: { _id:-1} },
        // { $skip: projectToFind.skip },
        // { $limit: projectToFind.limit },
        
      ];
      return projectModel.aggregate(aggregate);
    // return projectModel.find(projectToFind.query,projectToFind.projection).sort({_id:-1}).skip(projectToFind.skip).limit(projectToFind.limit);
}

projectModel.allProjectCount = (projectToFind) => {
    return projectModel.find(projectToFind.query,projectToFind.projection).count();
}

export default projectModel;