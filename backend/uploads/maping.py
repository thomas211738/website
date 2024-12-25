
from pymongo import MongoClient
from dotenv import load_dotenv
import os

load_dotenv()

mongoDBURL = os.getenv('mongoDBURL')
client = MongoClient(mongoDBURL)

db = client['test']

users_collection = db['user-collection']
websitepics_collection = db['websitepics-collection']

all_brothers = list(users_collection.find({'Position': {'$in': [2, 3, 5]}}))

for brother in all_brothers:
    print(brother['FirstName'], brother['LastName'])
