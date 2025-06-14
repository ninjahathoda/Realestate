from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from db import users_collection
from utils import hash_password, verify_password

router = APIRouter()

class User(BaseModel):
    username: str
    password: str

@router.post("/signup")
def signup(user: User):
    if users_collection.find_one({"username": user.username}):
        raise HTTPException(status_code=400, detail="Username already exists")
    users_collection.insert_one({
        "username": user.username,
        "password": hash_password(user.password)
    })
    return {"message": "User registered successfully"}

@router.post("/login")
def login(user: User):
    existing_user = users_collection.find_one({"username": user.username})
    if not existing_user or not verify_password(user.password, existing_user["password"]):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    return {"message": "Login successful"}
