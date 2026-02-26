import mongoose from "mongoose";

const threeDModelSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    location: { type: String, required: true },
    yearBuilt: { type: Number, required: true },
    architecture: { type: String, required: true },
    significance: { type: String, required: true },
    imageUrl: { type: String, required: true },
    sketchfabUid: { type: String, required: true },
    arlink: { type: String, required: true },
    vrHTMLPath : {type : String , required : true}
  },
  {
    timestamps: true,
  }
);

const ThreeDModel = mongoose.model("ThreeDModel", threeDModelSchema);

export default ThreeDModel;
