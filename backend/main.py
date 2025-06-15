from fastapi import FastAPI, UploadFile, File, Form, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from db import properties_collection
from utils import serialize_property
from auth import router as auth_router  # <-- Make sure auth.py defines `router`
import shutil
import os
import subprocess
import sys

from pymongo import MongoClient
from bson import ObjectId

# Setup MongoDB connection
client = MongoClient("mongodb://localhost:27017")
db = client["real_estate"]
favorites_collection = db["favorites"]

app = FastAPI()

# Enable CORS for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Serve uploaded images as static files
app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")

# Include authentication routes (from auth.py)
app.include_router(auth_router, prefix="/api")

# ------------------- Property Endpoints -------------------

@app.post("/api/add-property")
async def add_property(
    title: str = Form(...),
    location: str = Form(...),
    price: float = Form(...),
    type: str = Form(...),
    image: str = Form(None)
):
    data = {
        "title": title,
        "location": location,
        "price": f"₹ {price:,.2f}",
        "type": type,
        "image": image
    }
    try:
        properties_collection.insert_one(data)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Database error: {e}")
    return {"message": "Property added successfully"}

@app.get("/api/properties")
def get_properties():
    try:
        properties = list(properties_collection.find())
        return {"results": [serialize_property(p) for p in properties]}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Database error: {e}")

@app.post("/api/upload-image")
async def upload_image(file: UploadFile = File(...)):
    upload_dir = "uploads/images"
    os.makedirs(upload_dir, exist_ok=True)
    file_path = os.path.join(upload_dir, file.filename)
    try:
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"File upload error: {e}")
    return {"url": f"/uploads/images/{file.filename}"}

@app.get("/api/scrape-magicbricks")
def scrape_magicbricks(city: str = Query("noida", pattern="^[a-zA-Z\s]+$")):
    print("FastAPI working directory:", os.getcwd())
    script_path = os.path.join("scrape", "scraper_magicbricks.py")
    print("Script path:", script_path)
    try:
        result = subprocess.run(
            [sys.executable, script_path, city],
            capture_output=True,
            text=True,
            timeout=60
        )
        print("STDOUT:", result.stdout)
        print("STDERR:", result.stderr)
        if result.returncode != 0:
            raise Exception(result.stderr.strip())
    except subprocess.TimeoutExpired:
        raise HTTPException(status_code=504, detail="Scraping timed out.")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Scraping error: {e}")
    return get_properties()

# ------------------- Favorites Endpoints -------------------

@app.post("/api/favorites/add")
def add_favorite(property_id: str = Form(...)):
    print("Adding favorite for property_id:", property_id)
    if favorites_collection.find_one({"property_id": property_id}):
        raise HTTPException(status_code=400, detail="Already in favorites")
    favorites_collection.insert_one({"property_id": property_id})
    return {"message": "Added to favorites"}

@app.get("/api/favorites")
def get_favorites():
    try:
        property_ids = [f["property_id"] for f in favorites_collection.find()]
        print("Favorite property_ids:", property_ids)
        object_ids = [ObjectId(pid) for pid in property_ids if ObjectId.is_valid(pid)]
        print("ObjectIds used for lookup:", object_ids)
        properties = list(properties_collection.find({"_id": {"$in": object_ids}}))
        print("Found properties:", properties)
        return {"results": [serialize_property(p) for p in properties]}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Favorites error: {e}")

@app.post("/api/favorites/remove")
def remove_favorite(property_id: str = Form(...)):
    result = favorites_collection.delete_one({"property_id": property_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Favorite not found")
    return {"message": "Removed from favorites"}

@app.get("/api/favorites/raw")
def get_raw_favorites():
    # For debugging: view the raw favorites collection
    return list(favorites_collection.find())

# ------------------- End of main.py -------------------
