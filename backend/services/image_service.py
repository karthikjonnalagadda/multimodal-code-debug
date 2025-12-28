import cv2

def preprocess_image(path, max_size=1280):
    img = cv2.imread(path)

    h, w, _ = img.shape
    scale = max_size / max(h, w)

    if scale < 1:
        img = cv2.resize(img, (int(w * scale), int(h * scale)))

    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    return gray
