import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import NavBar from "./NavBar";
import AddForm from "./AddForm";
import Task from "./Task";

const API_ROOT = "http://127.0.0.1:8000";

export default function ListPage() {
  const { activeListId } = useParams();
  const [lists, setLists] = useState([]);
  const [tasks, setTasks] = useState([]);

  // Fetch and transform lists
  const fetchLists = async () => {
    const resp = await fetch(`${API_ROOT}/list/read_all`);
    const data = await resp.json();
    const listsData = data.map(l => ({ id: l.listID, name: l.listName }));
    setLists(listsData);
    return listsData;
  };

  // Fetch and transform tasks for the active list
  const fetchTasks = async (listsData) => {
    const resp = await fetch(`${API_ROOT}/task/read_all`);
    const raw = await resp.json();
    const filtered = raw.filter(t => activeListId === "0" || t.listID === +activeListId);
    const tasksData = filtered.map(t => ({
      id:            t.taskID,
      name:          t.taskName,
      description:   t.taskDescription,
      priority:      t.taskPriority,
      completion:    t.taskStatus,
      list:          listsData.find(l => l.id === t.listID)?.name || "",
      creationDate:  t.creationDate,
      completionDate: t.completionDate
    }));
    setTasks(tasksData);
  };

  // Load on mount and when activeListId changes
  useEffect(() => {
    async function loadData() {
      try {
        const listsData = await fetchLists();
        await fetchTasks(listsData);
      } catch (err) {
        console.error("Error loading data:", err);
      }
    }
    loadData();
  }, [activeListId]);

  // List CRUD
  const handleListAdd = async (name) => {
    try {
      const nextId = lists.reduce((max, l) => Math.max(max, l.id), 0) + 1;
      const creationDate = new Date().toISOString().slice(0,10);
      await fetch(`${API_ROOT}/list/create`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ listID: nextId, listName: name, listDescription: "", creationDate })
      });
      const listsData = await fetchLists();
      await fetchTasks(listsData);
    } catch (err) {
      console.error("Error adding list:", err);
    }
  };

  const handleListDelete = async (id) => {
    try {
      await fetch(`${API_ROOT}/list/delete`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ listID: +id })
      });
      const listsData = await fetchLists();
      await fetchTasks(listsData);
    } catch (err) {
      console.error("Error deleting list:", err);
    }
  };

  // Task CRUD
  const handleTaskAdd = async (listId, name, priority, description) => {
    try {
      const nextTaskId = tasks.reduce((max, t) => Math.max(max, t.id), 0) + 1;
      const creationDate   = new Date().toISOString().slice(0,10);
      const completionDate = "";
      await fetch(`${API_ROOT}/task/create`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          taskID:         nextTaskId,
          taskName:       name,
          taskDescription:description,
          taskPriority:   priority,
          taskStatus:     false,
          creationDate,
          completionDate,
          listID:         +listId
        })
      });
      const listsData = await fetchLists();
      await fetchTasks(listsData);
    } catch (err) {
      console.error("Error adding task:", err);
    }
  };

  const handleTaskCheck = async (id) => {
    try {
      const task = tasks.find(t => t.id === id);
      const updatedStatus = !task.completion;
      const updatedCompletionDate = updatedStatus ? new Date().toISOString().slice(0,10) : "";
      await fetch(`${API_ROOT}/task/update`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          taskID:         id,
          taskName:       task.name,
          taskDescription:task.description,
          taskPriority:   task.priority,
          taskStatus:     updatedStatus,
          creationDate:   task.creationDate,
          completionDate: updatedCompletionDate,
          listID:         lists.find(l => l.name === task.list).id
        })
      });
      const listsData = await fetchLists();
      await fetchTasks(listsData);
    } catch (err) {
      console.error("Error updating task:", err);
    }
  };

  const handleTaskDelete = async (id) => {
    try {
      await fetch(`${API_ROOT}/task/delete`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ taskID: id })
      });
      const listsData = await fetchLists();
      await fetchTasks(listsData);
    } catch (err) {
      console.error("Error deleting task:", err);
    }
  };

  const isValidListSelected = lists.some(l => String(l.id) === activeListId);
  const activeListName     = lists.find(l => String(l.id) === activeListId)?.name || "";

  return (
    <>
      <h1>My To Dos</h1>
      <div className="container-fluid">
        <div className="row">
          <div className="col-sm-2">
            <NavBar handleAdd={handleListAdd} handleDelete={handleListDelete} lists={lists} />
          </div>
          <div className="col-sm-10">
            {isValidListSelected ? (
              <>
                <h3 className="text-center">Tasks for {activeListName}</h3>
                <div className="row d-flex justify-content-center">
                  <div className="col-sm-10">
                    <AddForm
                      lists={lists}
                      includeListSelection={activeListId === "0"}
                      handleAdd={handleTaskAdd}
                    />
                    <hr />
                    {tasks.map(task => (
                      <div key={task.id}>
                        <Task
                          {...task}
                          handleCheck={handleTaskCheck}
                          handleDelete={handleTaskDelete}
                        />
                        <br />
                      </div>
                    ))}
                  </div>
                </div>
              </>
            ) : (
              <div className="row d-flex justify-content-center">
                No list selected. Please select a list.
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
