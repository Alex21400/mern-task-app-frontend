import React, { useEffect, useState } from 'react'
import TaskForm from './TaskForm'
import { toast } from 'react-toastify'
import axios from 'axios'
import { URL } from '../App'
import Task from './Task'
import loaderImg from '../assets/loader.gif'

const TaskList = () => {
  const [formData, setFormData] = useState({
    name: '',
    completed: false
  })
  const [isEditing, setIsEditing] = useState(false)
  const [taskID, setTaskID] = useState('')
  const [tasks, setTasks] = useState([])
  const [completedTasks, setCompletedTasks] = useState([])
  const [isLoading, setIsLoading] = useState(false)

  const { name } = formData

  const handleInputChange = (e) => {
    const {name, value} = e.target
    setFormData({ ...formData, [name]: value})
  }

  // Create a task
  const createTask = async (e) => {
    e.preventDefault()

    if(name === '') {
      return toast('Input field cannot be empty!')
    }
    try {
      await axios.post(`${URL}/api/tasks/`, formData)

      toast.success('Task added successfully!')
      setFormData({...formData, name: ''})
      getTasks()
    } catch(error) {
      toast.error(error.message)
    }
  }

  // Get tasks
  const getTasks = async () => {
    setIsLoading(true)

    try {
      const { data } = await axios.get(`${URL}/api/tasks/`)
      setTasks(data)
      setIsLoading(false)
    } catch(error) {
      toast.error(error.message)
      setIsLoading(false)
    }
  }

  // Delete a task
  const deleteTask = async (id) => {
    try {
      await axios.delete(`${URL}/api/tasks/${id}`)
      getTasks()
      toast.success('Task deleted!')
    } catch(error) {
      toast.error(error.message)
    }
  }

  const getSingleTask = async (task) => {
    setFormData({name: task.name, completed: false})
    setTaskID(task._id)
    setIsEditing(true)
  }

  // Update task
  const updateTask = async (e) => {
    e.preventDefault()
    
    if(name === '') {
      return toast('Input field cannot be empty!')
    }

    try {
      await axios.put(`${URL}/api/tasks/${taskID}`, formData)
      setFormData({...formData, name: ''})
      toast.success('Task updated successfully!')
      setIsEditing(false)
      setTaskID('')
      getTasks()
    } catch(error) {
      toast.error(error.message)
    }
  }

  // Set to complete
  const completeTask = async (task) => {
    const newFormData = ({
      name: task.name,
      completed: true
    })

    try {
      await axios.put(`${URL}/api/tasks/${task._id}`, newFormData)
      toast.success('Task completed!')
      getTasks()
    } catch(error) {
      toast.error(error.message)
    }
  }

  useEffect(() => {
    getTasks()
  }, [])

  useEffect(() => {
    const completedTask = tasks.filter(task => task.completed === true)
    setCompletedTasks(completedTask)
  }, [tasks])

  return (
    <div>
      <h2>Task Manager</h2>
      <TaskForm 
      name={name}
      handleInputChange={handleInputChange}
      createTask={createTask}
      isEditing={isEditing}
      updateTask={updateTask}
      />
      {tasks.length > 0 && (
        <div className='--flex-between --pb'>
        <p>
          <b>Total Tasks:</b> {tasks.length}
        </p>
        <p>
          <b>Completed Tasks:</b> {completedTasks.length}
        </p>
      </div>
      )}  
      <hr />
      {isLoading && (
          <div className="--flex-center">
            <img src={loaderImg} alt="Loading..." width={100} />
          </div>
        )}
        {!isLoading && tasks.length === 0 ? (
          <p>No tasks yet...</p>
        ) : (
          tasks.map((task, index) => {
          
            return (
              <Task 
              key={task._id} 
              task={task} 
              index={index} 
              completeTask={completeTask}
              deleteTask={deleteTask}
              getSingleTask={getSingleTask} />
            )
          })
        )}
    </div>
  )
}

export default TaskList