import subprocess

OLLAMA_PATH = r"C:\Users\karth\AppData\Local\Programs\Ollama\ollama.exe"

def run_llava(image_path: str, prompt: str) -> str:
    """
    Run LLaVA-1.6 (7B) via Ollama on Windows using absolute path.
    """

    cmd = [
        OLLAMA_PATH,
        "run",
        "llava:7b",
        prompt
    ]

    process = subprocess.run(
        cmd,
        capture_output=True,
        text=True,
        encoding="utf-8"
    )

    if process.returncode != 0:
        return f"Ollama error: {process.stderr}"

    return process.stdout.strip()
