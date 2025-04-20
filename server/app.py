from fastapi import FastAPI, Request
from pydantic import BaseModel
from typing import Optional
import time
import datetime
import json
from fastapi.middleware.cors import CORSMiddleware
from pymongo import MongoClient

# Setting up the FastAPI application
app = FastAPI()
origins = ["*"]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Setting up the MongoDB client
client = MongoClient("mongodb://127.0.0.1:27017")
db = client['To-do']
tasks_collection = db["Tasks"]
lists = db["Lists"]

# Base classes
class Task(BaseModel):
    name: str
    desc: str = ""
    priority: int = 10
    status: bool = False
    compDate: str = str(datetime.date.today())
    createDate: str = str(datetime.date.today())

#Endpoints

@app.delete("/task/deleteall")
async def deleteTask():
    tasks_collection.delete_many({})

@app.get("/task/read")
async def readTask(id):
    return tasks_collection.find_one({"taskID":{"$eq":id}})

@app.get("/task/read_sample")
async def readTaskSample(id):
    return {
    "taskID": id, 
    "taskName": "Sample Task Name", 
    "taskDescription": "Sample Task Description", 
    "taskPriority": 1, 
    "taskStatus": False,
    "completionDate": "2024-10-31",
    "creationDate": "2024-10-27"
    }

@app.post("/task/create")
async def create_task(task: Task):
    task_id = int(time.time() * 1000)
    new_task = {
        "taskID": task_id,
        "taskName": task.name,
        "taskDescription": task.desc,
        "taskPriority": task.priority,
        "taskStatus": task.status,
        "completionDate": task.compDate,
        "creationDate": task.createDate,
    }
    print(new_task)
    tasks_collection.insert_one(new_task)
    return str(new_task)

@app.get("/task/readall")
async def readAllTasks():
    documents = tasks_collection.find()
    tasks = []
    for doc in documents:
        doc["_id"] = str(doc["_id"])
        tasks.append(doc)
    return tasks
