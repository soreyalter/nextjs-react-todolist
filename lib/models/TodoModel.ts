/**
 * 操作 mongodb atlas 远程数据库 api
 */

import mongoose, { Model, Schema } from "mongoose";

type TodoItem = {
  title: string
  description: string
  isCompleted: boolean
}

const TodoSchema: Schema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  isCompleted: {
    type: Boolean,
    default: false
  }
}, {
  timeStamps: true
})

const TodoModel: Model<TodoItem> = mongoose.models.todo || mongoose.model('todo', TodoSchema)

export default TodoModel