from dotenv import load_dotenv
load_dotenv()

from fastapi import FastAPI, HTTPException, UploadFile, File, Form, Query
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import JSONResponse
from pydantic import BaseModel
from typing import List
from pymongo import MongoClient
from bson import ObjectId
import os
import shutil
import subprocess
import sys

# -------------------------------
# Load Environment & MongoDB
# -------------------------------
MONGO_URI = os.getenv("MONGO_URI", "mongodb://localhost:27017")
client = MongoClient(MONGO_URI)
db = client["real_estate"]
property_collection = db["properties"]
user_collection = db["users"]
magicbricks_collection = db["magicbricks_properties"]

# -------------------------------
# FastAPI App Setup
# -------------------------------
app = FastAPI()

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all for now
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Serve uploaded images
UPLOAD_FOLDER = "uploaded_images"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
app.mount("/images", StaticFiles(directory=UPLOAD_FOLDER), name="images")

# -------------------------------
# Models
# -------------------------------
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
    image_url: str

class User(BaseModel):
    name: str
    email: str
    password: str

class LoginRequest(BaseModel):
    email: str
    password: str

# -------------------------------
# API: Upload Image
# -------------------------------
@app.post("/api/upload")
def upload_image(image: UploadFile = File(...)):
    file_location = os.path.join(UPLOAD_FOLDER, image.filename)
    with open(file_location, "wb") as f:
        shutil.copyfileobj(image.file, f)
    return {"image_url": f"/images/{image.filename}"}

# -------------------------------
# API: Add Property
# -------------------------------
@app.post("/api/add-property")
def add_property(
    title: str = Form(...),
    price: int = Form(...),
    location: str = Form(...),
    type: str = Form(...),
    image_url: str = Form(...)
):
    new_property = {
        "title": title,
        "price": price,
        "location": location,
        "type": type,
        "image": image_url
    }
    result = property_collection.insert_one(new_property)
    return {"message": "Property added", "id": str(result.inserted_id)}

# -------------------------------
# API: Get Filtered Properties
# -------------------------------
@app.post("/api/properties")
def get_properties(filter: PropertyFilter):
    query = {
        "location": {"$regex": filter.location, "$options": "i"},
        "price": {"$gte": filter.priceMin, "$lte": filter.priceMax},
        "type": {"$regex": filter.type, "$options": "i"},
    }
    properties = list(property_collection.find(query))
    for prop in properties:
        prop["id"] = str(prop["_id"])
        del prop["_id"]
    return {"results": properties}

# -------------------------------
# API: Signup
# -------------------------------
@app.post("/api/signup")
def signup(user: User):
    if user_collection.find_one({"email": user.email}):
        raise HTTPException(status_code=400, detail="Email already registered")
    user_collection.insert_one(user.dict())
    return {"message": "Signup successful"}

# -------------------------------
# API: Login
# -------------------------------
@app.post("/api/login")
def login(data: LoginRequest):
    user = user_collection.find_one({"email": data.email, "password": data.password})
    if user:
        return {"message": "Login successful"}
    raise HTTPException(status_code=401, detail="Invalid email or password")

# -------------------------------
# API: Scrape MagicBricks (by City)
# -------------------------------

@app.get("/api/scrape-magicbricks")
def scrape_magicbricks(city: str = Query("noida")):
    try:
        print(f"🔍 Starting scraper for city: {city}")
        result = subprocess.run(
            [sys.executable, "scrape/scraper_magicbricks.py", city],
            capture_output=True,
            text=True,
            timeout=90
        )

        if result.returncode != 0:
            print("❌ Scraper error:", result.stderr)
            return JSONResponse(status_code=500, content={"error": result.stderr})

        listings = list(magicbricks_collection.find().sort("_id", -1).limit(30))
        for item in listings:
            item["id"] = str(item["_id"])
            del item["_id"]
        return {"results": listings}

    except Exception as e:
        print("❌ Exception in scraping:", e)
        return JSONResponse(status_code=500, content={"error": str(e)})

