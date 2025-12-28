from pymongo import MongoClient
from datetime import datetime
from typing import Any
import threading

from config import MONGODB_URI, MONGODB_DB

_client = None
_client_lock = threading.Lock()

def get_client() -> MongoClient:
    global _client
    if _client is None:
        with _client_lock:
            if _client is None:
                _client = MongoClient(MONGODB_URI)
    return _client

def get_db():
    client = get_client()
    return client[MONGODB_DB]

def save_upload_record(filename: str, path: str, ocr_text: str | None, analysis: Any) -> str:
    db = get_db()
    coll = db.uploads
    doc = {
        "filename": filename,
        "path": path,
        "ocr_text": ocr_text,
        "analysis": analysis,
        "uploaded_at": datetime.utcnow(),
    }
    res = coll.insert_one(doc)
    return str(res.inserted_id)
