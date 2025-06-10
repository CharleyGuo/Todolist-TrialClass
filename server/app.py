from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, constr
import todo  # your module where `db = MongoClient(...)[...]`
from datetime import date
from openai import OpenAI
from dotenv import load_dotenv
import os

load_dotenv()
client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], allow_credentials=True,
    allow_methods=["*"], allow_headers=["*"],
)

class Task(BaseModel):
    taskID: int
    taskName: str
    taskDescription: str
    taskPriority: int
    taskStatus: bool
    creationDate: date
    completionDate: date
    listID: int

class ListModel(BaseModel):
    listID: int
    listName: str
    listDescription: str
    creationDate: date

class DeletePayload(BaseModel):
    taskID: int

class DeleteListPayload(BaseModel):
    listID: int

def create_prompt(task_doc):
    return f"""
    You are a productivity assistant. Given the task below, generate a suggested plan of action with steps:
    
    Task: {task_doc['taskName']}
    Description: {task_doc['taskDescription']}
    
    Plan:
    """

def get_plan_from_gpt(prompt):
    response = client.chat.completions.create(
        model="gpt-4",
        messages=[
            {"role": "user", "content": prompt}
        ]
    )
    return response.choices[0].message.content


@app.get("/tasks/{task_id}/plan")
def generate_plan_for_task(task_id: int):
    task = todo.db.Tasks.find_one({"taskID": task_id})
    if not task:
        raise HTTPException(404, detail="Task not found")
    prompt = create_prompt(task)
    plan = get_plan_from_gpt(prompt)
    return {"task_id": task_id, "plan": plan}

@app.get("/")
async def read_root():
    return {"message": "Hello, World!"}

@app.delete("/task/delete_all")
async def delete_all_tasks():
    result = todo.db.Tasks.delete_many({})
    return {"deleted_count": result.deleted_count}

@app.get("/task/read_all", response_model=list[Task])
async def get_tasks():
    docs = []
    for doc in todo.db.Tasks.find():
        doc["_id"] = str(doc["_id"])
        docs.append(doc)
    return docs

@app.get("/task/read/{task_id}", response_model=Task)
async def get_task(task_id: int):
    doc = todo.db.Tasks.find_one({"taskID": task_id})
    if not doc:
        raise HTTPException(status_code=404, detail="Task not found")
    doc["_id"] = str(doc["_id"])
    return doc

@app.post("/task/create", status_code=201, response_model=Task)
async def create_task(task: Task):
    payload = task.dict()
    todo.db.Tasks.insert_one(payload)
    return task

@app.post("/task/update", response_model=Task)
async def update_task(task: Task):
    res = todo.db.Tasks.update_one({"taskID": task.taskID}, {"$set": task.dict()})
    if res.matched_count == 0:
        raise HTTPException(status_code=404, detail="Task not found")
    return task

@app.post("/task/delete")
async def delete_task(payload: DeletePayload):
    res = todo.db.Tasks.delete_one({"taskID": payload.taskID})
    if res.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Task not found")
    return {"message": "Task deleted"}

@app.get("/list/read_all", response_model=list[ListModel])
async def get_lists():
    docs = []
    for doc in todo.db.Lists.find():
        doc["_id"] = str(doc["_id"])
        docs.append(doc)
    return docs

@app.get("/list/read/{list_id}", response_model=ListModel)
async def get_list(list_id: int):
    doc = todo.db.Lists.find_one({"listID": list_id})
    if not doc:
        raise HTTPException(status_code=404, detail="List not found")
    doc["_id"] = str(doc["_id"])
    return doc

@app.post("/list/create", status_code=201, response_model=ListModel)
async def create_list(list_item: ListModel):
    payload = list_item.dict()
    # convert the date back to "YYYY-MM-DD" string
    payload["creationDate"] = list_item.creationDate.isoformat()
    todo.db.Lists.insert_one(payload)
    return list_item

@app.post("/list/update", response_model=ListModel)
async def update_list(list_item: ListModel):
    res = todo.db.Lists.update_one({"listID": list_item.listID}, {"$set": list_item.dict()})
    if res.matched_count == 0:
        raise HTTPException(status_code=404, detail="List not found")
    return list_item

@app.post("/list/delete")
async def delete_list(payload: DeleteListPayload):
    print(payload)
    res = todo.db.Lists.delete_one({"listID": payload.listID})
    if res.deleted_count == 0:
        raise HTTPException(status_code=404, detail="List not found")
    return {"message": "List deleted"}
