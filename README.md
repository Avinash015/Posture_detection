
# Pose Detection and Analysis with PoseNet

This project demonstrates the use of PoseNet, a machine learning model, to detect and analyze human poses in real-time using webcams or video feeds. The project is implemented using JavaScript (with p5.js library) and C++ (with OpenCV library).

## Features

- **Real-time Pose Detection**: The application uses the PoseNet model to detect human poses in real-time from webcam feeds.
- **Crawling Detection**: It identifies if a person is crawling based on the position of key body parts such as ankles, wrists, and knees.
- **Jumping Detection**: It also detects jumping movements by analyzing the position and velocity of ankle movements.
- **Visual Feedback**: Provides visual feedback by drawing keypoints and connecting lines to illustrate the detected poses.

## Components

### JavaScript (p5.js)
- **`index.html`**: HTML file containing the structure of the webpage and links to necessary libraries.
- **`sketch.js`**: JavaScript file implementing the PoseNet model, pose detection, crawling, and jumping analysis, and rendering of detected poses.

### C++
- **`main.cpp`**: C++ file implementing pose detection using OpenCV and the PoseNet model. It captures video frames from the webcam, processes them, and analyzes poses for crawling movements.

## Setup and Usage

1. Clone the repository to your local machine.
2. Open the project directory in your preferred code editor.
3. Ensure you have necessary dependencies installed:
   - For JavaScript: Ensure you have `ml5.js` and `p5.js` included in the project directory or link them from online sources.
   - For C++: Ensure you have OpenCV installed and properly linked to your project.
4. Run the project by opening `index.html` in a web browser for the JavaScript component.
5. For the C++ component, compile the code and run the executable. Ensure your webcam is connected and accessible.

## Additional Resources

- [PoseNet Documentation](https://github.com/tensorflow/tfjs-models/tree/master/posenet): Official documentation for the PoseNet model.
- [p5.js Documentation](https://p5js.org/reference/): Documentation for the p5.js library.
- [OpenCV Documentation](https://docs.opencv.org/): Official documentation for the OpenCV library.

## Notes

- Adjust parameters such as thresholds for crawling and jumping detection as needed for optimal performance.
- Feel free to customize the project by adding new features, overlays, or enhancements.
