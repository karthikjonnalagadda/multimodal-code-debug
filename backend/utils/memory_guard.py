import psutil

def has_enough_memory(min_gb: float = 0.3) -> bool:
    """
    Allow execution if at least 300 MB RAM is free.
    Safe because Ollama manages its own memory.
    """
    available_gb = psutil.virtual_memory().available / (1024 ** 3)
    return available_gb >= min_gb
