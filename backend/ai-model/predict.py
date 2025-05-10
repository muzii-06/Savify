from fastapi import FastAPI, UploadFile, File
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from ultralytics import YOLO
import numpy as np
import cv2

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ✅ Load YOLOv8x model (trained on COCO)
model = YOLO("yolov8x.pt")

@app.post("/predict/")
async def predict(file: UploadFile = File(...)):
    try:
        image_bytes = await file.read()
        nparr = np.frombuffer(image_bytes, np.uint8)
        img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)

        if img is None:
            return JSONResponse(status_code=400, content={"error": "Invalid image format."})

        results = model.predict(img, imgsz=640, conf=0.25)
        predictions = []

        for r in results:
            for box in r.boxes:
                prediction = {
                    "xcenter": float(box.xywh[0][0]),
                    "ycenter": float(box.xywh[0][1]),
                    "width": float(box.xywh[0][2]),
                    "height": float(box.xywh[0][3]),
                    "confidence": float(box.conf[0]),
                    "class": int(box.cls[0]),
                    "name": model.names[int(box.cls[0])]
                }
                predictions.append(prediction)

        return JSONResponse(content={"predictions": predictions})
    
    except Exception as e:
        print(f"Error during detection: {e}")
        return JSONResponse(status_code=500, content={"error": str(e)})
