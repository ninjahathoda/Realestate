from fastapi import FastAPI, UploadFile, File, Form, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from db import properties_collection
from utils import serialize_property
from auth import router as auth_router
import shutil
import os
import subprocess
import sys

app = FastAPI()

# CORS for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Serve uploaded images as static files
app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")

# Include auth routes
app.include_router(auth_router, prefix="/api")

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
    # Return the public URL for the uploaded image
    return {"url": f"/uploads/images/{file.filename}"}

@app.get("/api/scrape-magicbricks")
def scrape_magicbricks(city: str = Query("noida", pattern="^[a-zA-Z\s]+$")):
    # Print working directory and script path for debugging
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
