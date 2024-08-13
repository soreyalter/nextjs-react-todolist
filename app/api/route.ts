/**
 * base url: /api
 */

import { ConnectDB } from "@/lib/config/db";
import TodoModel from "@/lib/models/TodoModel";
import exp from "constants";
import { NextRequest, NextResponse } from "next/server";

const loadDB = async () => {
  await ConnectDB()
}

loadDB()

// 处理 get 请求
export async function GET(request: NextRequest) {
  const todos = await TodoModel.find({})
  return NextResponse.json({msg: "success", todos})
}

// 处理 post 请求
export async function POST(request: NextRequest) {
  const { title, description } = await request.json()
  await TodoModel.create({
    title,
    description
  })
  
  return NextResponse.json({msg: "Todo Created Successfully."})
}

// 删除 todo 项目
export async function DELETE(request: NextRequest) {
  const mongoId = await request.nextUrl.searchParams.get('mongoId')
  await TodoModel.findByIdAndDelete(mongoId)
  return NextResponse.json({msg: "Delete Successfully."})
}

// 完成 todo 项目
export async function PUT(request: NextRequest) {
  const mongoId = await request.nextUrl.searchParams.get('mongoId')
  await TodoModel.findByIdAndUpdate(mongoId, {
    $set: {
      isCompleted: true,
    }
  })
  return NextResponse.json({msg: "Todo Completed.."})
}