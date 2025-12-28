export async function analyzeImages(
  images: File[] = [],
  code: string = "",
  language: string = "auto"
) {
  const form = new FormData();

  form.append("code", code);
  form.append("language", language);

  if (images && images.length > 0) {
    form.append("file", images[0]); // backend expects single image
  }

  const res = await fetch("http://127.0.0.1:8000/analyze", {
    method: "POST",
    body: form,
  });

  if (!res.ok) {
    throw new Error("Backend error");
  }

  // Backend returns JSON { analysis: ... }
  return await res.json();
}
