import axios from "axios"
import React from "react"

type TodoProps = {
  mongoId: string
  id: number
  status: boolean
  title: string
  description: string
  deleteTodo: (mongoId: string) => void
  doneTodo: (mongoId: string) => void
}

const Todo = (props: TodoProps) => {
  // 不能在子组件中修改 props 属性，他们都是只读的
  return (
    <tr className="odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700">
      <th
        scope="row"
        className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
      >
        {props.id}
      </th>
      <td className={`px-6 py-4 ${props.status ? 'line-through' : ''}`}>{props.title}</td>
      <td className={`px-6 py-4 ${props.status ? 'line-through' : ''}`}>{props.description}</td>
      <td
        className={`px-6 py-4 ${
          props.status ? "text-green-500" : "text-yellow-500"
        }`}
      >
        {props.status ? "Completed" : "Pending"}
      </td>
      <td className="px-6 py-4 flex gap-3">
        <button
          className="font-medium text-red-600 dark:red-blue-500 hover:underline"
          onClick={() => props.deleteTodo(props.mongoId)}
        >
          Delete
        </button>
        {props.status ? (
          ""
        ) : (
          <button
            className="font-medium text-blue-600 dark:text-blue-500 hover:underline"
            onClick={() => props.doneTodo(props.mongoId)}
          >
            Done
          </button>
        )}
      </td>
    </tr>
  )
}

export default Todo
