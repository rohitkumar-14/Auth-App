// app/models/Todo.ts
import mongoose, { Document, Schema } from 'mongoose';

export interface ITodo extends Document {
    todo: string;
    status: boolean;
    priority: number;
    description: string;
}

const TodoSchema: Schema = new Schema({
    todo: {
        type: String,
        required: true,
    },
    status: {
        type: Boolean,
        default: false,
    },
    priority: {
        type: Number,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
});

const Todo = mongoose.models.Todo || mongoose.model<ITodo>('Todo', TodoSchema);
export default Todo;
