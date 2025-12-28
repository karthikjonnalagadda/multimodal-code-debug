# Multimodal Code Debug

![Python](https://img.shields.io/badge/Python-3.10+-blue) ![FastAPI](https://img.shields.io/badge/FastAPI-Backend-green) ![React](https://img.shields.io/badge/React-Frontend-blue)

> A focused demo and reference architecture for multimodal AI-powered debugging.

## Overview

This project demonstrates a practical multimodal debugging pipeline that analyzes screenshots and source code to identify errors, explain root causes, and suggest fixes.

This project is intended as:
- A learning-focused demo of multimodal AI pipelines
- A reference architecture for AI-powered debugging tools
- A base for extending into full image-aware LLM debugging

## Key Capabilities

- Upload error screenshots and source code
- OCR-based error text extraction
- LLM-powered root cause analysis and suggested fixes
- Optional persistence using MongoDB

## Architecture Overview

Frontend (React)
  ↓ multipart/form-data
FastAPI Backend
  ↓
OCR (Tesseract)
  ↓
Prompt Builder
  ↓
LLM (Ollama / LLaVA)
  ↓
Analysis JSON → UI

## Tech Stack

**Frontend**
- React
- Vite
- TypeScript

**Backend**
- FastAPI
- Python
- Uvicorn

**AI / ML**
- OCR: Tesseract
- LLM: LLaVA via Ollama
- Prompt engineering

**Storage (Optional)**
- MongoDB

## Prerequisites

- Python 3.10+ (dev used Python 3.13 on Windows)
- Node.js 16+ and npm
- Tesseract OCR installed and available on PATH (or configure `pytesseract.pytesseract.tesseract_cmd`)
- Ollama installed locally and configured with the `llava:7b` model if you want local multimodal inference (or change `backend/models/llava_engine.py` to call another API).

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

## Screenshots & Demo

Add visual examples and a short demo GIF to help reviewers understand the UI and results quickly. Place images in `docs/screenshots/` and reference them from the README or a `docs/` page.

Example embed markdown:

```markdown
![Upload example](docs/screenshots/upload-example.png)
![Analysis result](docs/screenshots/analysis-result.png)
```

If you add a `demo.gif` I can embed it here and resize it for an optimal README display.

## How It Works (Request Flow)

1. The frontend sends a multipart/form-data POST request to `http://127.0.0.1:8000/analyze` with a `file` (image) and optional `code`/`language` form fields. See `src/services/api.ts`.
2. The backend `app.py` saves the uploaded file to `uploads/`.
3. OCR is run with `pytesseract` (`services/ocr_service.py`) to extract text from the image.
4. `services/prompt_builder.py` constructs a debugging prompt.
5. `backend/models/llava_engine.py` calls the Ollama CLI with the prompt (text). The model output is returned as raw text in JSON `{ "analysis": "..." }`.

## Roadmap / Future Enhancements

- Multimodal input: pass the image directly to a model that supports images (update `run_llava` to send image bytes or use an API that accepts images)
- Heuristics: add deterministic rules to detect common logical errors
- Structured responses: parse model output into JSON (root cause, suggestion, confidence)
- Persistence: GridFS for binary storage (optional)

## Contributing

Contributions welcome. Suggested workflow:

1. Fork the repo, create a feature branch.
2. Open a PR with a clear description and testing steps.

## Author

Karthik J  
B.Tech Student | AI • Full-Stack • GenAI

## License

This project is provided for educational and portfolio purposes. Add an open-source license (e.g., MIT) if you plan to publish the repository publicly.

