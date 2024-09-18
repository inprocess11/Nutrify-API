const mongoose = require('mongoose');
const DateOnly = require('mongoose-dateonly')(mongoose);

const trackingSchema = mongoose.Schema({

  userID:{
    type:mongoose.Schema.Types.ObjectId,
    ref:'Users',
    required:true,
  },
  foodID:{
    type:mongoose.Schema.Types.ObjectId,
    ref:'foods',
    required:true,
  },
  eatenDate:{
    type:Date,
    default:new Date().toLocaleDateString()
  },
  quantity:{
    type:Number,
    min:1,
    required:true,

  }
},{timestamps:true})

const trackingModel = mongoose.model("trackings",trackingSchema); 

module.exports = trackingModel;