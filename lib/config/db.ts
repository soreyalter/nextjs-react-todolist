import mongoose from "mongoose"

/**
 * 连接到 mongodb atlas 数据库
 */
export const ConnectDB = async () => {
  await mongoose.connect('mongodb+srv://admin:Mongo122128@cluster0.cdmv9.mongodb.net/todo-app')
  console.log("db connected...")
}