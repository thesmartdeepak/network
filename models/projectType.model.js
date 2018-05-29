import mongoose from 'mongoose';
import AutoIncrement from "mongoose-auto-increment";
AutoIncrement.initialize(mongoose);

const projecttypeSchema = mongoose.Schema({
    projecttypeId: {type: Number },
    name: {type:String , index:{unique:true} },
    status:{type: String },
    createAt:{type: Date},
    updatedAt:{type: Date}
  }, {collection : 'projecttype'});

  projecttypeSchema.plugin(AutoIncrement.plugin,{model:'projecttype',field:'projecttypeId',startAt:1,incrementBy:1});

let projecttypeModel = mongoose.model('projecttype',projecttypeSchema);


projecttypeModel.addprojecttype = (addToprojecttype)=> {
  return addToprojecttype.save();
}

projecttypeModel.updateprojecttype = (Editprojecttype) => {
  return projecttypeModel.update(Editprojecttype.query,Editprojecttype.set);
}

projecttypeModel.getOneprojecttype = (projecttypeToFind) => {
  return projecttypeModel.findOne(projecttypeToFind.query,projecttypeToFind.projection)
}

projecttypeModel.getAllprojecttype = (projecttypeToFind) => {
  return projecttypeModel.find(projecttypeToFind.query,projecttypeToFind.projection).sort({_id:-1});
}
projecttypeModel.totalProjecttypeList = (projecttypeToFind) => {
  return projecttypeModel.find(projecttypeToFind.query,projecttypeToFind.projection).skip(projecttypeToFind.skip).limit(projecttypeToFind.limit);
}
export default projecttypeModel;
