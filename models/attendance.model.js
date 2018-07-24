import mongoose, { mongo } from 'mongoose';
import AutoIncrement from "mongoose-auto-increment";
AutoIncrement.initialize(mongoose);

const attendanceSchema = mongoose.Schema({
    attendanceId:{type:Number},
    month :{type:String},
    date:{type:Date},
    employeeUserId:{type:mongoose.Schema.ObjectId},
    employeeId:{type:String},
    employeeName:{type:String},
    salary:{type:Number},
    designation:{type:String},
    clientName:{type:String},
    clientId:{type:mongoose.Schema.ObjectId},
    projectCode:{type:String},
    empStatus:{type:String},
    operator:{type:String},
    perDaySalary:{type:Number},
    year:{type:Number},
    status:{type:String},
    createAt:{type: Date},
    updatedAt:{type: Date}
    
}, {collection : 'attendance'});

attendanceSchema.plugin(AutoIncrement.plugin,{model:'attendance',field:'attendanceId',startAt:1,incrementBy:1});

let attendanceModel = mongoose.model('attendance',attendanceSchema);

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
    return attendanceModel.aggregate(aggregate);
}

attendanceModel.allAttendanceCount = (attendanceToFind) =>{
    return attendanceModel.find(attendanceToFind.query,attendanceToFind.projection).count();
}

attendanceModel.editAttendance = (editToAttendance) => {
    return attendanceModel.update(editToAttendance.query,editToAttendance.set);
}

export default attendanceModel;