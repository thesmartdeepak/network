import mongoose from 'mongoose';
import AutoIncrement from "mongoose-auto-increment";
AutoIncrement.initialize(mongoose);

const RegionSchema = mongoose.Schema({
    regionId: {type: Number },
    name: {type:String , index:{unique:true} },
    description: {type: String},
    code: {type: String , index:{unique:true}  },
    status:{type: String },
    createAt:{type: Date},
    updatedAt:{type: Date}
  }, {collection : 'region'});

  RegionSchema.plugin(AutoIncrement.plugin,{model:'region',field:'regionId',startAt:1,incrementBy:1});

let RegionModel = mongoose.model('region',RegionSchema);


RegionModel.addRegion = (addToRegion)=> {
  return addToRegion.save();
}

RegionModel.updateRegion = (EditRegion) => {
  return RegionModel.update(EditRegion.query,EditRegion.set);
}

RegionModel.getOneRegion = (regionToFind) => {
  return RegionModel.findOne(regionToFind.query,regionToFind.projection)
}

RegionModel.getAllRegion = (regionToFind) => {
  return RegionModel.find(regionToFind.query,regionToFind.projection).sort({_id:-1});
}

export default RegionModel;
