from fastapi import FastAPI, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
import shutil
import os

from services.ocr_service import extract_text
from services.prompt_builder import build_debug_prompt
from models.llava_engine import run_llava
from utils.memory_guard import has_enough_memory
from services.db_service import save_upload_record

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)


@app.post("/analyze")
async def analyze(
    file: UploadFile = File(...),
    code: str | None = Form(None),
    language: str | None = Form(None),
):
    if not has_enough_memory():
        return {"error": "Low system memory. Close other apps and retry."}

    file_path = os.path.join(UPLOAD_DIR, file.filename)

    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    # OCR fallback
    ocr_text = extract_text(file_path)

    # Build debugging prompt
    prompt = build_debug_prompt(ocr_text)

    # Run LLaVA via Ollama
    result = run_llava(file_path, prompt)

    # Save record to MongoDB (non-blocking failure)
    try:
        record_id = save_upload_record(file.filename, file_path, ocr_text, result)
    except Exception:
        record_id = None

    return {
        "analysis": result,
        "record_id": record_id,
    }
