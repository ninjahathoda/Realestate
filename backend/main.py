from fastapi import FastAPI, UploadFile, File, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import JSONResponse
from pydantic import BaseModel
from typing import List
from pymongo import MongoClient
from bson import ObjectId
from dotenv import load_dotenv
import shutil
import os
import subprocess

# Load environment variables
load_dotenv()
MONGO_URI = os.getenv("MONGO_URI", "mongodb://localhost:27017")

# MongoDB setup
client = MongoClient(MONGO_URI)
db = client["real_estate"]
property_collection = db["properties"]
magicbricks_collection = db["magicbricks_properties"]
user_collection = db["users"]

# FastAPI app
app = FastAPI()

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Uploads folder
UPLOAD_FOLDER = "uploaded_images"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
app.mount("/images", StaticFiles(directory=UPLOAD_FOLDER), name="images")


# Models
class PropertyFilter(BaseModel):
    location: str
    priceMin: int
    priceMax: int
    type: str

class Property(BaseModel):
    title: str
    price: int
    location: str
    type: str
    image: str

class User(BaseModel):
    name: str
    email: str
    password: str

class LoginRequest(BaseModel):
    email: str
    password: str


@app.post("/api/upload-image")
async def upload_image(file: UploadFile = File(...)):
    file_location = os.path.join(UPLOAD_FOLDER, file.filename)
    with open(file_location, "wb") as f:
        shutil.copyfileobj(file.file, f)
    return {"url": f"/images/{file.filename}"}


@app.post("/api/add-property")
def add_property(
    title: str = Form(...),
    price: int = Form(...),
    location: str = Form(...),
    type: str = Form(...),
    image: str = Form(...)
):
    doc = {
        "title": title,
        "price": price,
        "location": location,
        "type": type,
        "image": image
    }
    result = property_collection.insert_one(doc)
    return {"message": "Property added", "id": str(result.inserted_id)}


@app.post("/api/properties")
def get_properties(filters: PropertyFilter):
    query = {
        "location": {"$regex": filters.location, "$options": "i"},
        "price": {"$gte": filters.priceMin, "$lte": filters.priceMax},
        "type": {"$regex": filters.type, "$options": "i"}
    }
    results = list(property_collection.find(query))
    for item in results:
        item["id"] = str(item["_id"])
        del item["_id"]
    return {"results": results}


@app.get("/api/scrape-magicbricks")
def scrape(city: str = "noida"):
    try:
        result = subprocess.run(
            ["python", "scrape/scraper_magicbricks.py", city],
            capture_output=True,
            text=True
        )
        if result.returncode != 0:
            return JSONResponse(status_code=500, content={"error": result.stderr})
        listings = list(magicbricks_collection.find().sort("_id", -1).limit(10))
        for item in listings:
            item["id"] = str(item["_id"])
            del item["_id"]
        return {"results": listings}
    except Exception as e:
        return JSONResponse(status_code=500, content={"error": str(e)})
