import mongoose from "mongoose"

/**
 * 连接到 mongodb atlas 数据库
 */
export const ConnectDB = async () => {
  await mongoose.connect('mongodb+srv://<username>:<password>@cluster0.cdmv9.mongodb.net/<project-name>')
  console.log("db connected...")
}