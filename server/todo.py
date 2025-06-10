from pymongo import MongoClient

connection_string = "mongodb+srv://user:qwertyuiop@cluster0.ypdasjk.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
client = MongoClient(connection_string, tlsAllowInvalidCertificates=True)

db = client['To-do']

tasks = db["Tasks"]
lists = db["Lists"]



# collection_list = db.list_collections()
# for c in collection_list:
#     print(c)
result = db.Tasks.update_many(
    {"parentID": {"$exists": True}},
    {"$rename": {"parentID": "listID"}}
)


