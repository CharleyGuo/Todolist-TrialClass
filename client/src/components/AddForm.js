import {useState} from 'react';
import {useParams} from 'react-router-dom';


export default function AddForm(props) {
    const {activeListId} = useParams() // get from URL
    const includeListSelection = (activeListId === "0")

    const [newTaskName, setNewTaskName] = useState("")
    const [newTaskPriority, setNewTaskPriority] = useState("")
    const [newTaskDescription, setNewTaskDescription] = useState("")
    const [selectedListId, setSelectedListId] = useState("")

    const handleNameChange = (e) => {
        setNewTaskName(e.target.value)
    }
    const handlePriorityChange = (e) => {
        setNewTaskPriority(e.target.value)
    }
    const handleListIdChange = (e) => {
        setSelectedListId(e.target.value)
    }
    const handleDescriptionChange = (e) => {
        setNewTaskDescription(e.target.value)
    }

    const handleSubmit = () => {
        if (newTaskName === "") {
            alert("Please enter a task name.")
            return
        }
        if (newTaskPriority === "") {
            alert("Please select a priority level.")
            return
        }

        let newTaskListId = activeListId

        if (props.includeListSelection) {
            if (selectedListId === "0") {
                alert("Please select a task list.")
                return
            }
            else newTaskListId = selectedListId
        }

        props.handleAdd(newTaskListId, newTaskName, newTaskPriority, newTaskDescription)

        setNewTaskName("")
        setNewTaskPriority("")
        setNewTaskDescription("")
        setSelectedListId("0")
    }

    return (
        <>
        <h5>Add Item</h5>
        <form className="row g-2">
            <div className="col-sm-auto">
                <input type="text" className="form-control" placeholder="Enter Task Name" value={newTaskName} onChange={handleNameChange}/>
            </div>
            <div className="col-sm-auto">
                <select className="form-select" value={newTaskPriority} onChange={handlePriorityChange}>
                    <option value="">Priority</option>
                    <option value="high">high</option>
                    <option value="medium">medium</option>
                    <option value="low">low</option>
                </select>
            </div>
            {
                includeListSelection ? 
                <div className="col-sm-auto">
                <select className="form-select" value={selectedListId} onChange={handleListIdChange}>
                    <option value="">List</option>
                    {props.lists.map(list => {
                        if (list.name != "All")
                        return <option value={list.id}>{list.name}</option>
                    })}
                </select>
                </div>
                :
                <></>
            }
            <div className="col-sm d-flex justify-content-end">
                <button className="btn btn-sm btn-primary" type="button" value="add" onClick={handleSubmit}>Add</button>
            </div>
            <div className="col-sm-12">
                <textarea className="form-control" placeholder="Enter Task Description" rows="2" value={newTaskDescription} onChange={handleDescriptionChange}/>
            </div>
        </form>
        </>
    )
}