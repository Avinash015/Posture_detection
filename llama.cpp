#include <iostream>
#include <opencv2/opencv.hpp>
#include <opencv2/dnn/dnn.hpp>

using namespace cv;

// Define the threshold for the crawling detection
const int THRESHOLD = 85;

// Define the model for PoseNet
std::string model = "pose_model/SSD-MobileNetV2-512.ckpt";
std::string labels = "pose_model/labels.txt";

// Define the input and output sizes for the model
const int INPUT_SIZE = 512;
const int OUTPUT_SIZE = 136;

// Define the skeleton positions for crawling detection
const std::vector<std::string> crawlingPositions = {"left_ankle", "right_ankle", "left_wrist", "right_wrist", "left_knee", "right_knee"};

// Define the function for crawling detection
void detectCrawling(const std::vector<cv::Point3f>& skeleton, const std::vector<cv::Point3f>& groundPlane) {
    // Calculate the distance between each skeleton position and the ground plane
    std::vector<float> distances(skeleton.size(), 0);
    for (int i = 0; i < skeleton.size(); i++) {
        distances[i] = cv::norm(skeleton[i] - groundPlane[i]);
    }

    // Check if the person is crawling
    bool isCrawling = true;
    for (int i = 0; i < crawlingPositions.size(); i++) {
        int index = crawlingPositions[i];
        if (distances[index] > THRESHOLD) {
            isCrawling = false;
            break;
        }
    }

    // Print the result
    if (isCrawling) {
        std::cout << "Person is crawling" << std::endl;
    } else {
        std::cout << "Person is not crawling" << std::endl;
    }
}

int main() {
    // Load the PoseNet model
    cv::dnn::readNetFromDarknet(model, labels, "pose_model/SSD-MobileNetV2-512.cfg");

    // Load the video capture device
    cv::VideoCapture cap(0);

    // Define the code for the video capture loop
    while (true) {
        // Read a frame from the video capture device
        cv::Mat frame;
        cap >> frame;

        // Convert the frame to RGB
        cv::cvtColor(frame, frame, cv::COLOR_BGR2RGB);

        // Resize the frame to the input size of the model
        cv::Mat input(INPUT_SIZE, INPUT_SIZE, CV_8UC3, cv::Scalar(0, 0, 0));
        cv::resize(frame, input, input.size(), 0, 0, cv::BILINEAR);

        // Define the output matrix for the pose detection
        cv::Mat output(OUTPUT_SIZE, OUTPUT_SIZE, CV_8UC3, cv::Scalar(0, 0, 0));

        // Run the PoseNet model on the input frame
        cv::dnn::setInput(model, input, "data");
        cv::dnn::setInput(model, output, "output");
        cv::dnn::forward(model, true);

        // Extract the skeleton positions from the output
        std::vector<cv::Point3f> skeleton;
        cv::dnn::getOutput(model, output, "output", skeleton);

        // Detect crawling movement
        detectCrawling(skeleton, groundPlane);

        // Display the output
        cv::imshow("Output", output);

        // Press 'q' to exit
        if (cv::waitKey(1) & 0xFF == 'q') {
            break;
        }
    }

    return 0;
}