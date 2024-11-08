import mongoose, { Schema } from 'mongoose';

const reportSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    attendanceData:[{
        type: Schema.Types.ObjectId,
        ref: 'Attandance',
        required: true,

    }],
  
}, { timestamps: true });

export const Report = mongoose.model('Report', reportSchema);
