
    import mongoose,{Schema} from "mongoose";

    const leaveSchema=new Schema({
        userId:{
            type:Schema.Types.ObjectId,
            ref:"User"
        },
        startDate:{
            type:Date,
            required:true
        },
        endDate:{
            type:Date,
            required:true
        },
        reason:{
            type:String,
            required:true
        },
        status:{
            type:String,
            enum:['pending','approved','rejected'],default:'pending'
        }
    },{timestamps:true})

    export const Leave=mongoose.model("Leave",leaveSchema);