import cv2
from ultralytics import YOLO
import tkinter as tk
from tkinter import filedialog

def detect_image(model, conf_threshold):
    """Function to upload an image and perform object detection."""
    # Open a file dialog to select an image
    file_path = filedialog.askopenfilename(filetypes=[("Image Files", "*.jpg *.jpeg *.png")])
    if not file_path:
        print("No file selected.")
        return

    try:
        # Load the image
        img = cv2.imread(file_path)

        # Run object detection on the image
        results = model.predict(source=img, save=False, conf=conf_threshold)
        detections = results[0].boxes

        # Annotate the image with bounding boxes, class labels, and confidence scores
        if detections is not None:
            for box in detections:
                # Extract bounding box coordinates
                x1, y1, x2, y2 = map(int, box.xyxy[0])  # Bounding box coordinates

                # Extract confidence score and class ID
                confidence = float(box.conf[0])  # Confidence score
                class_id = int(box.cls[0])  # Class ID

                # Skip detections below the confidence threshold
                if confidence < conf_threshold:
                    continue

                # Get class names from the model
                class_name = model.names[class_id]  # Access class names using the model

                # Construct the label
                label = f"{class_name} {confidence:.2f}"

                # Draw bounding box
                cv2.rectangle(img, (x1, y1), (x2, y2), (0, 255, 0), 2)  # Green box with thickness 2

                # Add label above the bounding box
                cv2.putText(img, label, (x1, y1 - 10), cv2.FONT_HERSHEY_SIMPLEX, 0.6, (0, 255, 0), 2)

        # Display the detected image in a new window
        cv2.imshow("Detected Image", img)
        cv2.waitKey(0)
        cv2.destroyWindow("Detected Image")

    except Exception as e:
        print(f"Error during image detection: {e}")

def main():
    # Define the path to your YOLOv11 model
    model_path = r"C:\Users\hp\Desktop\Savify\best.pt"  # Update with your actual model path

    # Set the confidence threshold manually
    conf_threshold = 0.90  # Adjust this value as needed (e.g., 0.25, 0.50, etc.)

    # Load the YOLOv11 model
    try:
        model = YOLO(model_path)
        print(f"Model loaded successfully from: {model_path}")
    except Exception as e:
        print(f"Error loading model: {e}")
        return

    # Initialize webcam
    cap = cv2.VideoCapture(0)  # 0 is the default webcam
    if not cap.isOpened():
        print("Error: Unable to access the webcam.")
        return

    print("Press 'q' to quit the webcam.")

    # Create a Tkinter window
    root = tk.Tk()
    root.title("Live Detection and Image Upload")
    root.geometry("300x100")

    # Add a button to upload an image for detection
    upload_button = tk.Button(root, text="Upload Image for Detection", command=lambda: detect_image(model, conf_threshold))
    upload_button.pack(pady=20)

    def close_window():
        """Close the Tkinter window and stop the webcam."""
        cap.release()
        root.destroy()

    root.protocol("WM_DELETE_WINDOW", close_window)

    # Create a separate window for webcam feed
    cv2.namedWindow("YOLOv11 Live Detection")

    while True:
        ret, frame = cap.read()
        if not ret:
            print("Error: Unable to read from the webcam.")
            break

        # Run object detection on the frame
        try:
            # Make predictions on the frame
            results = model.predict(source=frame, save=False, conf=conf_threshold)
            detections = results[0].boxes

            # Annotate the frame with bounding boxes, class labels, and confidence scores
            if detections is not None:
                for box in detections:
                    # Extract bounding box coordinates
                    x1, y1, x2, y2 = map(int, box.xyxy[0])  # Bounding box coordinates

                    # Extract confidence score and class ID
                    confidence = float(box.conf[0])  # Confidence score
                    class_id = int(box.cls[0])  # Class ID

                    # Skip detections below the confidence threshold
                    if confidence < conf_threshold:
                        continue

                    # Get class names from the model
                    class_name = model.names[class_id]  # Access class names using the model

                    # Construct the label
                    label = f"{class_name} {confidence:.2f}"

                    # Draw bounding box
                    cv2.rectangle(frame, (x1, y1), (x2, y2), (0, 255, 0), 2)  # Green box with thickness 2

                    # Add label above the bounding box
                    cv2.putText(frame, label, (x1, y1 - 10), cv2.FONT_HERSHEY_SIMPLEX, 0.6, (0, 255, 0), 2)

        except Exception as e:
            print(f"Error during prediction: {e}")
            break

        # Display the live frame with bounding boxes
        cv2.imshow("YOLOv11 Live Detection", frame)

        # Exit when 'q' key is pressed
        if cv2.waitKey(1) & 0xFF == ord('q'):
            break

        # Process Tkinter events
        root.update_idletasks()
        root.update()

    # Release resources
    cap.release()
    cv2.destroyAllWindows()

if __name__ == "__main__":
    main()
