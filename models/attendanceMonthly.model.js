import mongoose, { mongo } from 'mongoose';
import AutoIncrement from "mongoose-auto-increment";
AutoIncrement.initialize(mongoose);

const attendanceMonthlySchema = mongoose.Schema({
    attendanceId:{type:Number},
    month :{type:String},
    year:{type:Number},
    // date:{type:Date},
    employeeUserId:{type:mongoose.Schema.ObjectId},
    employeeId:{type:String},
    employeeName:{type:String},
    salary:{type:Number},
    presentdays:{type:Number},
    designation:{type:String},
    clientName:{type:String},
    clientId:{type:mongoose.Schema.ObjectId},
    circleId:{type:mongoose.Schema.ObjectId},
    circleName:{type:String},
    projectCode:{type:String},
    empStatus:{type:String},
    netsalary :{type:Number},
    operator:{type:String},
    perDaySalary:{type:Number},
    year:{type:Number},
    status:{type:String},
    createAt:{type: Date},
    updatedAt:{type: Date}
    
}, {collection : 'attendanceMonthly'});

attendanceMonthlySchema.plugin(AutoIncrement.plugin,{model:'attendanceMonthly',field:'attendanceMonthlyId',startAt:1,incrementBy:1});

let attendanceModel = mongoose.model('attendanceMonthly',attendanceMonthlySchema);

attendanceModel.addAttendance = (addToattendance) => {
    return addToattendance.save();
}

attendanceModel.attendancePagination = (attendanceToFind,type) => {
   if(type == 'count'){
        return attendanceModel.find(attendanceToFind.query).count();
    }
    else if(type=='download'){
       return attendanceModel.find(attendanceToFind.query);
    }
    else{
        return attendanceModel.find(attendanceToFind.query).sort({ _id:-1}).skip(attendanceToFind.skip).limit(attendanceToFind.limit);
    }
}

attendanceModel.salaryMis = (aggregate) => {
    // console.log("aggregate",aggregate);
    return attendanceModel.aggregate(aggregate); 
}

attendanceModel.allAttendanceCount = (attendanceToFind) =>{
    return attendanceModel.find(attendanceToFind.query,attendanceToFind.projection).count();
}

attendanceModel.editAttendance = (editToAttendance) => {
    return attendanceModel.update(editToAttendance.query,editToAttendance.set);
}

attendanceModel.getAggregate = (aggregate) => {
    return attendanceModel.aggregate(aggregate);
}

export default attendanceModel;