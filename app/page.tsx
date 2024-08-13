"use client"
import Todo from "@/components/Todo"
import Image from "next/image"
import { ReactEventHandler, useEffect, useMemo, useRef, useState } from "react"
import { ToastContainer, toast, useToast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import axios, { AxiosResponse } from "axios"
import Button from "react-bootstrap/Button"
import Modal from "react-bootstrap/Modal"
import 'bootstrap/dist/css/bootstrap.min.css'

/**
 * 主页面 Home
 */
export default function Home() {
  const [formData, setFormdata] = useState({
    title: "",
    description: "",
  })

  // refresh the value of formData when user's content changes
  const onChangeHandler: React.ChangeEventHandler = (e: React.ChangeEvent) => {
    const name = e.target.name
    const value = e.target.value
    setFormdata((form) => ({ ...form, [name]: value }))
    console.log(value)
  }

  type PostNewTodoResult = {
    msg: string
  }
  type TodoItem = {
    _id: string
    title: string
    description: string
    isCompleted: boolean
  }
  type GetTodoListResult = {
    msg: string
    todos: TodoItem[]
  }

  // get data showed in the table
  const [todolist, setTodolist] = useState([] as TodoItem[])
  const getTodolist = function () {
    axios.get("/api").then((res: AxiosResponse<GetTodoListResult>) => {
      setTodolist(res.data.todos)
    })
  }
  // execute getTodolist at every render process and todoList change
  useEffect(() => {
    getTodolist()
  }, [])

  // add todo item
  const onSubmitHandler: React.FormEventHandler = async (e) => {
    // prevent default submit event's action
    e.preventDefault()

    // send request to add a todo item
    axios
      .post("/api", formData)
      .then(async (res: AxiosResponse<PostNewTodoResult>) => {
        console.log(res.data)
        toast.success(res.data.msg)
        // refresh the data showed in table
        getTodolist()
        // clear the content in form
        setFormdata({
          title: "",
          description: "",
        })
      })
      .catch((error) => {
        toast.error(error)
      })

    // 发送请求添加 todo 项目
    // try {
    //   const response: AxiosResponse<PostNewTodoResult> = await axios.post(
    //     "/api",
    //     formData
    //   )
    //   toast.success(response.data.msg)
    //   setFormdata({
    //     title: "",
    //     description: "",
    //   })
    // } catch (error) {
    //   toast.error(error)
    // }
  }

  // 搜索 input DOM
  const searchinputRef = useRef<HTMLInputElement>(null)
  // 输入搜索框内的值，用于搜索
  const [keywords, setKeywords] = useState()
  // 改变 keywords 的状态触发渲染，但是 useMemo 会缓存计算出来的结果跨越渲染留下
  const showlist: TodoItem[] = useMemo(() => {
    if (!keywords) {
      return [...todolist].sort((a, b) => a.isCompleted - b.isCompleted)
    }
    // 去除头尾空格和不换行空白符
    const str: string = keywords.replace(/^(\s|\xA0)+|(\s|\xA0)+$/g, "")
    // 用户输入空格隔开的多个关键字
    const keyArr = str.split(" ")
    const regexList = keyArr.map((word) => new RegExp(word, "gmi"))

    return todolist.filter((todo) => {
      return regexList.some(
        (re) => re.test(todo.title) || re.test(todo.description)
      )
    })
  }, [keywords, todolist])

  // onchange 改变 keywords 的值
  const onSearchHandler: React.ChangeEventHandler = (e) => {
    setKeywords(searchinputRef.current.value)
    console.log(keywords)
  }

  // 删除 todo 项目
  const onDeleteHandler = (mongoId: string) => {
    axios
      .delete("/api", {
        params: {
          mongoId,
        },
      })
      .then((res: AxiosResponse<PostNewTodoResult>) => {
        setShow(false)
        toast.success(res.data.msg)
        getTodolist()
      })
      .catch((error) => toast.error(error))
  }

  // 完成 todo 项目
  const onDoneHandler = (mongoId: string) => {
    axios
      .put(
        "/api",
        {},
        {
          params: {
            mongoId,
          },
        }
      )
      .then((res: AxiosResponse<PostNewTodoResult>) => {
        setTodolist((list) => {
          return list.map((todo) =>
            todo._id == mongoId ? { ...todo, isCompleted: true } : todo
          )
        })
        toast.success(res.data.msg)
      })
      .catch((error) => toast.error(error))
  }

  const [show, setShow] = useState(false);
  const selectedData = useRef<string>()

  const handleClose = () => setShow(false);
  const handleShow = (mongoId: string) => {
    setShow(true);
    selectedData.current = mongoId
  }

  const handleConfirm = async () => {
    await onDeleteHandler(selectedData.current)
    setShow(false)
  }

  return (
    <>
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Modal heading</Modal.Title>
        </Modal.Header>
        <Modal.Body>确认要删除吗？</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            取消
          </Button>
          <Button variant="primary" onClick={handleConfirm}>
            确认
          </Button>
        </Modal.Footer>
      </Modal>
      <ToastContainer
        position="top-right"
        autoClose={2000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
      <form
        onSubmit={onSubmitHandler}
        className="flex items-start flex-wrap gap-2 w-[80%] max-w-[600px] mt-24 px-2 mx-auto"
      >
        <input
          value={formData.title}
          onChange={onChangeHandler}
          type="text"
          name="title"
          placeholder="Enter Title"
          className="px-3 py-2 border-2 w-[80%]"
        />
        <button
          type="submit"
          className="bg-green-400 text-white py-2 px-3 border-2 flex-1 md:text-base sm:text-xs rounded"
        >
          Add Todo
        </button>
        <textarea
          value={formData.description}
          onChange={onChangeHandler}
          name="description"
          placeholder="Enter Brief Description"
          className="max-h-[100px] min-h-[60px] w-[100%] border-2 py-2 px-3"
        ></textarea>
      </form>

      {/* table */}
      <div className="relative overflow-x-auto sm:rounded-lg w-[60%] mx-auto mt-24">
        {/* search box */}
        <div className="pb-4 bg-white dark:bg-gray-900 mx-2 ">
          <div className="relative mt-1">
            <div className="absolute inset-y-0 rtl:inset-r-0 start-0 flex items-center ps-3 pointer-events-none">
              <svg
                className="w-4 h-4 text-gray-500 dark:text-gray-400"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 20 20"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
                />
              </svg>
            </div>
            <input
              onChange={onSearchHandler}
              ref={searchinputRef}
              type="text"
              id="table-search"
              className="block py-2 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg w-80 bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              placeholder="Search for your Todo items"
            />
          </div>
        </div>
        <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400 shadow-md ">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th scope="col" className="px-6 py-3">
                ID
              </th>
              <th scope="col" className="px-6 py-3">
                Title
              </th>
              <th scope="col" className="px-6 py-3">
                Description
              </th>
              <th scope="col" className="px-6 py-3">
                Status
              </th>
              <th scope="col" className="px-6 py-3">
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {showlist.map((item, index) => (
              <Todo
                key={index}
                id={index + 1}
                mongoId={item._id}
                status={item.isCompleted}
                title={item.title}
                description={item.description}
                deleteTodo={handleShow}
                doneTodo={onDoneHandler}
              ></Todo>
            ))}
          </tbody>
        </table>
      </div>
      <div className="h-10"></div>
    </>
  )
}
