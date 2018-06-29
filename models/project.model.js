import mongoose, { mongo } from 'mongoose';
import AutoIncrement from "mongoose-auto-increment";
AutoIncrement.initialize(mongoose);

const projectSchema = mongoose.Schema({
    projectId:{type:Number},
    userId:{type: mongoose.Schema.ObjectId},
    operatorId:{type: mongoose.Schema.ObjectId},
    operatorName:{type:String},
    userName:{type:String},
    departmentId:{type: mongoose.Schema.ObjectId},
    departmentName:{type:String},
    projectTypeId:{type: mongoose.Schema.ObjectId},
    projectTypeName:{type: String},
    managerId:{type:mongoose.Schema.ObjectId},
    projectCode: {type:String},
    circleId:{type:mongoose.Schema.ObjectId},
    circleCode:{type:String},
    regionId:{type:mongoose.Schema.ObjectId},
    clientId:{type:mongoose.Schema.ObjectId},
    clientName:{type:String},
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
    poAmount :{type: Number },
    shippmentNo:{type: String },
    esarOnScs:{type:String},
    pacOnScs:{type:String},
    wccStatus:{type:String},
    grn_iaStatus:{type:String},
    invoiceStatus:{type:String},
    l1Approval :{type: String },
    l2Approval :{type: String },
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

projectModel.projectPagination = (projectToFind,type) => {
    // let aggregate = [
    //     { 
    //       $lookup:{
    //           from: "user",
    //           localField: "userId",
    //           foreignField: "_id",
    //           as: "user"
    //         }
    //     },
    //     { $match: projectToFind.query }
    // ];
    if(type == 'count'){
        return projectModel.find(projectToFind.query).count();
    }
    else if(type=='download'){
        // let projection = {
        //     "projectCode":1,
        //     "activity":1,
        //     "itemDescription_Band":1,
        //     "siteId":1,
        //     "siteCount":1,
        //     "preDoneDate":1,
        //     "post_ActivityDoneDate":1,
        //     "activityStatus":1,
        //     "remark":1,
        //     "reportStatus":1,
        //     "reportAcceptanceStatus":1,
        //     "clientRemark":1,
        //     "concatenate":1,
        //     "attemptCycle":1,
        //     "employeeId":1,
        //     "employeeName":1,
        //     "userName":1
        // };
        return projectModel.find(projectToFind.query);
    }
    else{
        // aggregate.push({ $sort: { _id:-1} });
        // aggregate.push({ $skip: projectToFind.skip });
        // aggregate.push({ $limit: projectToFind.limit });
        // return projectModel.aggregate(aggregate);
        return projectModel.find(projectToFind.query).sort({ _id:-1}).skip(projectToFind.skip).limit(projectToFind.limit);
    }
}

projectModel.allProjectCount = (projectToFind) => {
    return projectModel.find(projectToFind.query,projectToFind.projection).count();
}

projectModel.getReport = (projectToFind) => {
    let aggregate = [];
    if(projectToFind.query){
        aggregate.push({
            "$match":projectToFind.query
        });
    }

    if(projectToFind.sort){
        aggregate.push({ $sort : projectToFind.sort });
    }

    aggregate.push({"$group" : {_id:projectToFind.group, count:{$sum:1}}});

    return projectModel.aggregate(aggregate);
}

projectModel.getAggregate = (aggregate) => {
    return projectModel.aggregate(aggregate);
}

export default projectModel;