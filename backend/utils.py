from passlib.context import CryptContext
from bson import ObjectId

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def hash_password(password: str):
    return pwd_context.hash(password)

def verify_password(plain: str, hashed: str):
    return pwd_context.verify(plain, hashed)

def serialize_property(property_doc):
    return {
        "id": str(property_doc.get("_id")),
        "title": property_doc.get("title"),
        "price": property_doc.get("price"),
        "location": property_doc.get("location"),
        "type": property_doc.get("type"),
        "image": property_doc.get("image")
    }
