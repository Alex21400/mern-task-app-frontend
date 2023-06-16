import React from 'react'
import { FaCheckDouble, FaEdit, FaRegTrashAlt } from 'react-icons/fa'

const Task = ({task, index, deleteTask, getSingleTask, completeTask}) => {
  return (
    <div className={task.completed ? 'task completed' : 'task'}>
      <p>
        <b>{index + 1}.</b> &nbsp;
        {task.name}
      </p>
      <div className='task-icons'>
        <FaCheckDouble color='green' onClick={() => completeTask(task)}/>
        <FaEdit color='grey' onClick={() => getSingleTask(task)} />
        <FaRegTrashAlt color='red' onClick={() => deleteTask(task._id)} />
      </div>
    </div>
  )
}

export default Task