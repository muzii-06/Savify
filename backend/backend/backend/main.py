from fastapi import FastAPI, File, UploadFile
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from ultralytics import YOLO
from PIL import Image
import io

# Initialize FastAPI app
app = FastAPI()

# Allow CORS for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Change to your frontend's URL in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load the YOLO model
model = YOLO("backend/best.pt")  # Replace with the path to your trained YOLO model

# Define class mapping
class_list = ['hammer', 'lighter', 'remote']

@app.post("/predict/")
async def predict(image: UploadFile = File(...)):
    """
    Predict API to run object detection on an uploaded image.
    """
    try:
        # Read image from the uploaded file
        contents = await image.read()
        image_data = Image.open(io.BytesIO(contents)).convert("RGB")

        # Perform prediction
        results = model.predict(source=image_data, save=False, show=False)  # Predict on the image

        # Parse the results
        class_names = set()
        predictions = []
        for result in results:
            for box in result.boxes:
                class_id = int(box.cls)  # Class index
                confidence = float(box.conf)  # Confidence score
                bbox = box.xyxy.tolist()  # Bounding box coordinates
                class_name = class_list[class_id]  # Get class name from class ID
                class_names.add(class_name)
                predictions.append({
                    "class_id": class_id,
                    "class_name": class_name,
                    "confidence": confidence,
                    "bbox": bbox
                })

        # Return predictions as JSON
        return JSONResponse(content={
            "predictions": predictions,
            "classNames": list(class_names)
        })

    except Exception as e:
        return JSONResponse(content={"error": str(e)}, status_code=500)

# Root endpoint
@app.get("/")
async def root():
    return {"message": "Welcome to the YOLO Prediction API"}
