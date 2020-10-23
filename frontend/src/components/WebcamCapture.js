import React from 'react';
import Webcam from "react-webcam";

const videoConstraints = {
  width: 400,
  height: 300,
  facingMode: "user"
};


export const WebcamCapture = React.forwardRef((_props, ref) => {
    return (
        <Webcam
            audio={false}
            ref={ref}
            screenshotFormat="image/jpeg"
            height={300}
            width="100%"
            videoConstraints={videoConstraints}
            />
    );
});
