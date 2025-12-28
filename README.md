# Multimodal Code Debug

> A lightweight multimodal debugging assistant that analyzes screenshots and source code to identify errors, explain root causes, and suggest fixes.

## Overview

This project provides a simple full-stack demo for a multimodal debugging assistant:

- Frontend: React + Vite UI for uploading screenshots and source code, displaying AI analysis.
- Backend: FastAPI server that accepts file uploads, runs OCR on screenshots, builds a debugging prompt, and forwards the prompt to a local LLM (via Ollama).
- Model integration: `models/llava_engine.py` invokes Ollama CLI to run a multimodal LLaVA model (configured to run locally).

Important note: the current pipeline sends OCR-extracted text to the LLM. The image pixels are saved and available, but the model call currently passes only the text prompt (not the binary image). See `backend/models/llava_engine.py` and `backend/app.py`.

## Repository Structure

- `backend/` — FastAPI backend
  - `app.py` — API endpoints (POST `/analyze`)
  - `services/ocr_service.py` — OCR extraction using Tesseract
  - `services/prompt_builder.py` — Builds the debugging prompt sent to the LLM
  - `models/llava_engine.py` — Runs Ollama CLI to call the model
  - `utils/` — helpers such as `memory_guard.py`
- `frontend/` — React + Vite frontend
  - `src/services/api.ts` — client API helper to send multipart/form-data
  - `src/components/ResultPanel.tsx` — displays backend analysis results
  - `src/App.tsx` — main UI (upload, code editor, About modal, footer)

## Prerequisites

- Python 3.10+ (dev used Python 3.13 on Windows)
- Node.js 16+ and npm
- Tesseract OCR installed and available on PATH (or configure `pytesseract.pytesseract.tesseract_cmd`)
- Ollama installed locally and configured with the `llava:7b` model if you want local multimodal inference (or change `models/llava_engine.py` to call another API).

## Backend Setup

1. Create and activate a virtual environment inside `backend/`:

```bash
cd backend
python -m venv venv
venv\Scripts\activate   # Windows
source venv/bin/activate  # macOS / Linux
```

2. Install Python dependencies:

```bash
pip install -r requirements.txt
```

3. Configure `backend/models/llava_engine.py` if your Ollama binary is installed in a different location. The default path is set in `OLLAMA_PATH`.

4. Run the backend (development reload mode):

```bash
uvicorn app:app --reload
```

Notes: the `--reload` option will show a transient KeyboardInterrupt stack when files change as the reloader restarts the worker — this is expected.

## MongoDB (optional)

The backend can save upload metadata (filename, path, OCR text, analysis, timestamp) to a MongoDB database. The project defaults to `mongodb://localhost:27017/` and database name `debugai`.

1. Set environment variables (PowerShell):

```powershell
$env:MONGODB_URI = 'mongodb://localhost:27017/'
$env:MONGODB_DB = 'debugai'
```

Or on macOS / Linux:

```bash
export MONGODB_URI='mongodb://localhost:27017/'
export MONGODB_DB='debugai'
```

2. The backend reads `MONGODB_URI` and `MONGODB_DB` from the environment. You can add them to `backend/.env` if you use a dotenv loader or set them in your shell before starting `uvicorn`.

3. Install Python dependencies (ensure you run this from the `backend/` folder or reference the correct path):

```bash
# from backend/
pip install -r requirements.txt

# or from repo root
pip install -r backend/requirements.txt
```

4. The `/analyze` endpoint returns a `record_id` in the JSON when the upload is successfully stored in MongoDB. The DB stores metadata and a timestamp; binary image files are still saved to the `uploads/` folder by default.

Optional: store image binaries in GridFS if you prefer storing blobs inside MongoDB instead of the filesystem. If you'd like, I can add GridFS support to save images directly in the database.

## Frontend Setup

1. Install dependencies and start dev server:

```bash
cd frontend
npm install
npm run dev
```

2. Open the UI at the URL printed by Vite (usually `http://localhost:5173`). The UI provides an upload zone and a code editor.

## How It Works (Request Flow)

1. The frontend sends a multipart/form-data POST request to `http://127.0.0.1:8000/analyze` with a `file` (image) and optional `code`/`language` form fields. See `src/services/api.ts`.
2. The backend `app.py` saves the uploaded file to `uploads/`.
3. OCR is run with `pytesseract` (`services/ocr_service.py`) to extract text from the image.
4. `services/prompt_builder.py` constructs a debugging prompt (now instructing the model to check for type coercion and mixed-type errors).
5. `models/llava_engine.py` currently calls the Ollama CLI with the prompt (text). The model output is returned as raw text in JSON `{ "analysis": "..." }`.

## Common Issues & Troubleshooting

- 422 Unprocessable Content: If the backend returns 422 on upload, the cause is usually a form mismatch. Ensure `file` is sent as multipart/form-data and the backend expects `file: UploadFile = File(...)`. This project already fixes that in `backend/app.py`.
- Uvicorn reload traces: When editing backend files with `--reload`, seeing a `KeyboardInterrupt` stack from the child process is normal — the reloader kills and restarts the worker.
- Ollama / Model errors: If the model process fails, `models/llava_engine.py` returns the `stderr` text. Check `OLLAMA_PATH` and that the `llava:7b` model (or your chosen model) is available to Ollama.
- OCR failures: Ensure Tesseract is installed; if OCR returns poor text, consider improving image preprocessing (cropping, contrast) or using a different OCR engine.

## Recommended Improvements

- Multimodal input: pass the image directly to a model that supports images (update `run_llava` to send image bytes or use an API that accepts images) — currently only OCR text is sent.
- Heuristics: add deterministic heuristics to detect common logical errors (e.g., JavaScript string+number concatenation) and surface them before/alongside model output.
- Structured responses: parse the model output into JSON (root cause, suggestion, confidence) to render richer UI cards.

## Contributing

Contributions welcome. Suggested workflow:

1. Fork the repo, create a feature branch.
2. Open a PR with a clear description and testing steps.

## Author

Author: karthik

## License

This repository does not include a license file. Add one if you plan to open-source it.
