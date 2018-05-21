import mongoose from 'mongoose';
import AutoIncrement from "mongoose-auto-increment";
AutoIncrement.initialize(mongoose);

const projectSchema = mongoose.Schema({
    projectId:{type:Number},
    projectCode: {type:String , index:{unique:true} },
    operator:{type:String},
    activity: {type: String},
    itemDescription_Band: {type:String},
    siteId: {type:String},
    siteCount: {type:String},
    preDoneMonth: {type:String},
    preDoneDate: {type:Date},
    post_ActivityDoneMonth: {type:String},
    post_ActivityDoneDate:{type:Date},
    coordinatorRemark:{type:String},
    coordinatorStatus:{type: String },
    reportAcceptanceStatus:{type: String },
    clientRemark:{type: String },
    concaeenate:{type: String },
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
    employeeId:{type: String },
    employeeId:{type: String },
    projectStatus :{type:String},
    createAt:{type: Date},
    updatedAt:{type: Date}
}, {collection : 'project'});

projectSchema.plugin(AutoIncrement.plugin,{model:'project',field:'projectId',startAt:1,incrementBy:1});

let projectModel = mongoose.model('project',projectSchema);

projectModel.addProject = (addToProject)=> {
    return addToProject.save();
}

projectModel.editProject = (editToProject) => {
    return projectModel.update(editToProject.query,editToProject.set);
}

projectModel.getOneProject = (editToProject) => {
    return projectModel.findOne(editToProject.query,editToProject.projection)
}

projectModel.projectPagination = (projectToFind) => {
    return projectModel.find(projectToFind.query,projectToFind.projection).sort({_id:-1}).skip(projectToFind.skip).limit(projectToFind.limit);
}

projectModel.allProjectCount = (projectToFind) => {
    return projectModel.find(projectToFind.query,projectToFind.projection).count();
}

export default projectModel;