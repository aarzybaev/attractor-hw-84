import mongoose, { Types } from 'mongoose';
import config from "../config";
import {TaskFields} from "../types";
import User from "./User";

const Schema = mongoose.Schema;

const TaskSchema = new Schema<TaskFields>({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        validate: {
            validator: async (value: Types.ObjectId) => User.findById(value),
            message: 'User does not exist!',
        }
    },
    title: {
        type: String,
        required: true,
    },
    description: String,
    status: {
        type: String,
        enum: ['new', 'in_progress', 'complete'],
    }
}, config.mongoose.versionKey);




const Task = mongoose.model('Task', TaskSchema);

export default Task;