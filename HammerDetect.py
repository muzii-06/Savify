import cv2
from ultralytics import YOLO

def main():
    # Correct variable name for the model path
    model_path = r"C:\Users\USER 1\Desktop\hammerdetect\best (1).pt"  # Use the correct variable name here
    image_path = r"C:\Users\USER 1\Desktop\labl\gettyimages-157335133-612x612.jpg"

    # Load the YOLOv11 model
    try:
        model = YOLO(model_path)
        print(f"Model loaded successfully from: {model_path}")
    except Exception as e:
        print(f"Error loading model: {e}")
        return

    # Read the image
    image = cv2.imread(image_path)
    if image is None:
        print(f"Error: Could not read image from {image_path}")
        return

    # Run the model on the image
    try:
        results = model.predict(source=image, save=False, conf=0.25)
        print("Object detection completed.")
    except Exception as e:
        print(f"Error during prediction: {e}")
        return

    # Visualize results
    annotated_image = results[0].plot()
    output_path = "output_image.jpg"
    cv2.imwrite(output_path, annotated_image)
    print(f"Results saved to: {output_path}")

    # Display the image with bounding boxes
    cv2.imshow("Detection Results", annotated_image)
    print("Press any key to close the image.")
    cv2.waitKey(0)
    cv2.destroyAllWindows()

if __name__ == "__main__":
    main()
