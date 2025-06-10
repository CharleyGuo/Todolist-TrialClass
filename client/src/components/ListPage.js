import {useState} from 'react';
import {useParams} from 'react-router-dom';

import NavBar from "./NavBar";
import AddForm from "./AddForm";
import Task from "./Task";

const lists_ex = [
  {id: 0, name: "All"}, 
  {id: 1, name: "Project 1"}, 
  {id: 2, name: "Project 2"}
]
const tasks_ex = {
  "0": [
    {id: 2, list: "Project 1", name: "water plants", description: "use water", priority: "high", completion: false},
    {id: 3, list: "Project 1", name: "make bed", description: "in morning", priority: "medium", completion: true},
    {id: 10, list: "Project 1", name: "do homework", description: "due tomorrow", priority: "low", completion: false},
    {id: 20, list: "Project 2", name: "code React", description: "use chatgpt", priority: "high", completion: false}
  ],
  "1": [
    {id: 100, list: "Project 1", name: "water plants", description: "use water", priority: "high", completion: false},
    {id: 11, list: "Project 1", name: "make bed", description: "in morning", priority: "medium", completion: true},
    {id: 200, list: "Project 1", name: "do homework", description: "due tomorrow", priority: "low", completion: false},
  ],
  "2": [
    {id: 300, list: "Project 2", name: "code React", description: "use chatgpt", priority: "high", completion: false}
  ],
}
const getUniqueTaskId = (tasks) => {
  const allIds = Object.values(tasks).flatMap(list => list.map(task => task.id));
  return Math.max(...allIds) + 1;
};

export default function ListPage() {
  const [lists, setLists] = useState(lists_ex)
  const [tasks, setTasks] = useState(tasks_ex)
  const {activeListId} = useParams() // get from URL
  const activeListName = (lists.map(l => "" + l.id).includes(activeListId)) ? lists[activeListId].name : ""
  const activeListTasks = (Object.keys(tasks).includes(activeListId)) ? tasks[activeListId] : []


  const handleListAdd = (newListName) => {
    const newListId = lists.length
    lists.push({id: newListId, name: newListName})
    setLists(lists)
    tasks[newListId] = [] 
  }

  const handleListDelete = (delListId) => {
    lists.splice(delListId, 1)
    lists.map((list, idx) => {list["id"] = idx; return list})
    delete tasks[delListId]

    setLists(lists)
    setTasks(tasks)
  }

  const handleTaskCheck = (taskId) => {
    const updatedTasks = Object.keys(tasks).reduce((acc, listId) => {
      acc[listId] = tasks[listId].map(task => {
        if (task.id === taskId) {
          return {...task, taskCompletion: !task.taskCompletion}
        }
        else return task
      })
      return acc
    }, {})
    setTasks(updatedTasks)
  }

  const handleTaskDelete = (taskId) => {
    const updatedTasks = {}
    Object.keys(tasks).forEach(listId => {
      updatedTasks[listId] = tasks[listId].filter(task => (task.id !== taskId))
    })
    setTasks(updatedTasks)
  }

  const handleTaskAdd = (newTaskListId, newTaskName, newTaskPriority, newTaskDescription) => {
    const newTaskListName = lists.find(list => String(list.id) === newTaskListId).name
    const newTaskId = getUniqueTaskId(tasks)
    const newTask = {id: newTaskId, list: newTaskListName, name: newTaskName, description: newTaskDescription, priority: newTaskPriority, completion: false}
    
    const updatedTasks = {}
    Object.keys(tasks).forEach(listId => {
      updatedTasks[listId] = [...tasks[listId]]
      if ((listId === newTaskListId) || (listId === "0")) {
        updatedTasks[listId].push(newTask)
      }
    })

    setTasks(updatedTasks)
  }

  const isValidListSelected = (lists.map(l => "" + l.id).includes(activeListId))

  return (
    <>
        <h1>My To Dos</h1>
        <div className="container-fluid">
          <div className="row">
            <div className="col-sm-2">
              <NavBar handleAdd={handleListAdd} handleDelete={handleListDelete} lists={lists}/>
            </div>
            <div className="col-sm-10">
                {
                isValidListSelected ?
                <>
                <h3 className="text-center">Tasks for {activeListName}</h3>
                <div className="row d-flex justify-content-center">
                    <div className="col-sm-10">
                        <AddForm lists={lists} handleAdd={handleTaskAdd}/>
                        <hr/>
                        {activeListTasks.map(task => {
                          return <>
                            <Task {...task} handleCheck={handleTaskCheck} handleDelete={handleTaskDelete}/>
                            <br/>
                          </>
                        })}
                    </div>
                </div>
                </>
                :
                <div className="row d-flex justify-content-center">
                  No list selected. Please select a list.
                </div>
                }
            </div>
          </div>
        </div>
    </>
  );
}