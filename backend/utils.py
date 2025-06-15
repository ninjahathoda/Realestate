from passlib.context import CryptContext
from bson import ObjectId

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def hash_password(password: str):
    return pwd_context.hash(password)

def verify_password(plain: str, hashed: str):
    return pwd_context.verify(plain, hashed)

def serialize_property(property_obj):
    return {
        "_id": str(property_obj["_id"]),
        "title": property_obj.get("title"),
        "location": property_obj.get("location"),
        "price": property_obj.get("price"),
        "type": property_obj.get("type"),
        "image": property_obj.get("image"),
        # add other fields as needed
    }

