let capture;
let posenet;
let noseX,noseY;
let reyeX,reyeY;
let leyeX,leyeY;
let singlePose,allPoses,skeleton;
let actor_img;
let specs,smoke;
let crawlingThreshold = 0.85; 
let ankleBaseline = 0;// Initialize the ankle baseline to ground level
let ankleVelocityThreshold = 5; // Adjust as needed




function setup() {
    createCanvas(800, 500);
    capture = createCapture(VIDEO)
    capture.hide();

    posenet = ml5.poseNet(capture, modelLoaded);
    posenet.on('pose',receivedPoses);

    actor_img = loadImage('images/shahrukh.png');
    specs = loadImage('images/spects.png');
    smoke = loadImage('images/cigar.png');

}

function receivedPoses(poses){
    console.log(poses);

    // Store all detected poses and skeletons
    if(poses.length > 0){
        allPoses = poses; // Store all detected poses
    }
}


function modelLoaded() {
    console.log('Model has loaded');
}


function checkCrawling(singlePose) {
    // Calculate the relative positions of ankles, wrists, and knees
    let leftAnkleY = singlePose.keypoints[15].position.y;
    let rightAnkleY = singlePose.keypoints[16].position.y;
    let leftWristY = singlePose.keypoints[7].position.y;
    let rightWristY = singlePose.keypoints[8].position.y;
    let leftKneeY = singlePose.keypoints[13].position.y;
    let rightKneeY = singlePose.keypoints[14].position.y;

    // Check if both left and right ankles, wrists, and knees are close to the ground
    let ankleThreshold = height * 0.95; // Adjust as needed
    let wristThreshold = height * 0.95; // Adjust as needed
    let kneeThreshold = height * 0.95; // Adjust as needed

    let isCrawling = (
        leftAnkleY > ankleThreshold &&
        rightAnkleY > ankleThreshold &&
        leftWristY > wristThreshold &&
        rightWristY > wristThreshold &&
        leftKneeY > kneeThreshold &&
        rightKneeY > kneeThreshold
    );

    return isCrawling;
}


function checkJumping(singlePose) {
    // Check if both left and right ankles are detected
    let leftAnkle = singlePose.keypoints[15];
    let rightAnkle = singlePose.keypoints[16];

    if (leftAnkle.score > 0.5 || rightAnkle.score > 0.5) {
        // Calculate the average Y position of both ankles
        let leftAnkleY = leftAnkle.position.y;
        let rightAnkleY = rightAnkle.position.y;
        let avgAnkleY = (leftAnkleY + rightAnkleY) / 2;

        // If the ankle baseline is not set, set it to the current ankle position
        if (ankleBaseline === 0) {
            ankleBaseline = avgAnkleY;
        }

        // Calculate the upward movement of the ankles from the baseline
        let ankleUpwardMovement = avgAnkleY - ankleBaseline;

        // Calculate the velocity of the ankles' upward movement
        let frameRate = 30; // Adjust to match your frame rate
        let ankleVelocity = ankleUpwardMovement * frameRate;

        // Check if the ankle velocity is above the threshold
        if (ankleVelocity > ankleVelocityThreshold) {
            console.log("Person is jumping");
            return true;
        }
    }

    return false;
}



function draw() {
    // images and videos (webcam)
    image(capture, 0, 0);
    fill(255,0,0);

    if(allPoses){
        for(let p = 0; p < allPoses.length; p++) {
            singlePose = allPoses[p].pose;
            skeleton = allPoses[p].skeleton;

            // Draw keypoints and lines for each pose
            for(let i = 0; i < singlePose.keypoints.length; i++){
                ellipse(singlePose.keypoints[i].position.x, singlePose.keypoints[i].position.y, 20);
            }
            stroke(255,255,255);
            strokeWeight(5);
            for(let j = 0; j < skeleton.length; j++){
                line(skeleton[j][0].position.x, skeleton[j][0].position.y, skeleton[j][1].position.x, skeleton[j][1].position.y);
            }
            

             // Check if the person is crawling
            let isCrawling = checkCrawling(singlePose);

            if (isCrawling) {
                 console.log("Person is crawling");
            }

            
            let isJumping = checkJumping(singlePose);

            if (isJumping) {
                console.log("Person is jumping");
            } 



            // You can overlay images for each pose here if needed
            // image(specs, singlePose.nose.x - 35, singlePose.nose.y - 50, 80, 80);
            // image(smoke, singlePose.nose.x - 35, singlePose.nose.y + 10, 40, 40);
        }
    }
}

