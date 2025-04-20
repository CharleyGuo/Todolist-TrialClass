from pymongo import MongoClient

client = MongoClient("mongodb://127.0.0.1:27017")

db = client['To-do']

tasks = db["Tasks"]
lists = db["Lists"]

db.Tasks.insert_one({
    "taskID": 1, 
    "taskName": "testName", 
    "taskDescription": "testDesc", 
    "taskPriority": 0, 
    "taskStatus": "False",
    "completionDate": "2024-10-31",
    "creationDate": "2024-10-27"})

db.Lists.insert_one({
    "listID": 1, 
    "listName": "list1", 
    "listDescription": "tempDescrip",
    "creationDate": "2024-10-27"})

# collection_list = db.list_collections()
# for c in collection_list:
#     print(c)
    

