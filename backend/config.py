MODEL_NAME = "llava-hf/llava-1.6-mistral-7b-hf"
MAX_IMAGE_SIZE = 1280
MAX_TOKENS = 512
DEVICE = "cpu"

import os
# MongoDB connection (override with MONGODB_URI env var)
MONGODB_URI = os.getenv("MONGODB_URI", "mongodb://localhost:27017/")
MONGODB_DB = os.getenv("MONGODB_DB", "debugai")
