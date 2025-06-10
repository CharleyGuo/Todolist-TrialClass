from pymongo import MongoClient
import certifi

# Replace with your actual connection string from MongoDB Atlas
connection_string = "mongodb+srv://user:qwertyuiop@cluster0.ypdasjk.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"

# Create a client connection to your Atlas cluster
client = MongoClient(connection_string, tlsAllowInvalidCertificates=True  # ONLY for testing!
)

# Access (or create) a database; here we name it "mydatabase"
db = client["mydatabase"]

# Access (or create) a collection named "mycollection"
collection = db["mycollection"]

# 1. Insert one document
document = {"name": "Alice", "age": 25, "city": "New York"}
insert_one_result = collection.insert_one(document)
print("Inserted single document with id:", insert_one_result.inserted_id)

# 2. Insert multiple documents
documents = [
    {"name": "Bob", "age": 30, "city": "San Francisco"},
    {"name": "Charlie", "age": 35, "city": "Los Angeles"}
]
insert_many_result = collection.insert_many(documents)
print("Inserted multiple documents with ids:", insert_many_result.inserted_ids)

# Optional: Retrieve and print the documents to verify the insertions
print("\nCurrent documents in the collection:")
for doc in collection.find():
    print(doc)
