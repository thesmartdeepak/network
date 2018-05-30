import mongoose from 'mongoose';
import AutoIncrement from "mongoose-auto-increment";
AutoIncrement.initialize(mongoose);

const departmentSchema = mongoose.Schema({
    departmentId: {type: Number },
    name: {type:String , index:{unique:true} },
    status:{type: String },
    createAt:{type: Date},
    updatedAt:{type: Date}
  }, {collection : 'department'});

  departmentSchema.plugin(AutoIncrement.plugin,{model:'department',field:'departmentId',startAt:1,incrementBy:1});

let departmentModel = mongoose.model('department',departmentSchema);


departmentModel.adddepartment = (addTodepartment)=> {
  return addTodepartment.save();
}

departmentModel.updatedepartment = (Editdepartment) => {
  return departmentModel.update(Editdepartment.query,Editdepartment.set);
}

departmentModel.getOnedepartment = (departmentToFind) => {
  return departmentModel.findOne(departmentToFind.query,departmentToFind.projection)
}

departmentModel.getAlldepartment = (departmentToFind) => {
  return departmentModel.find(departmentToFind.query,departmentToFind.projection).sort({_id:-1});
}
departmentModel.totaldepartmentList = (departmentToFind) => {
  return departmentModel.find(departmentToFind.query,departmentToFind.projection).skip(departmentToFind.skip).limit(departmentToFind.limit);
}
export default departmentModel;
