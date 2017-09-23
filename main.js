var Observable = require("FuseJS/Observable");
var Camera = require("FuseJS/Camera");
var CameraRoll = require("FuseJS/CameraRoll");
var ImageTools = require("FuseJS/ImageTools");

var exports = module.exports;

//  These observables will be used to display an image and its information

var imagePath = exports.imagePath = Observable();

//  This is used to keep the last image displayed as a base64 string in memory
var lastImage = "";
//  When we receive an image object we want to display, we call this
var displayImage = function(image)
{
  imagePath.value = image.path;
  ImageTools.getImageFromBase64(image).then(
    function(b64)
    {
      lastImage = b64;
    }
  );
}

/*
    1. Take an unscaled "raw" picture
    2. Pass the picture into ImageTools.resize to scale and then crop it to 320x320
    3. Publish the scaled image to the device cameraroll
    4. Display the final image
*/

exports.takePicture = function()
{
  Camera.takePicture().then(
    function(image) {
      var args = { desiredWidth:320, desiredHeight:320, mode:ImageTools.SCALE_AND_CROP, performInPlace:true };
      ImageTools.resize(image, args).then(
        function(image) {
          CameraRoll.publishImage(image);
          displayImage(image);
        }
      ).catch(
        function(reason) {
          console.log("Couldn't resize image: " + reason);
        }
      );
    }
  ).catch(
    function(reason){
      console.log("Couldn't take picture: " + reason);
    }
  );
};

/*
  1. Spawn a dialog to fetch an image from the camera roll
  2. Display the image
*/

exports.selectImage = function()
{
  CameraRoll.getImage().then(
    function(image)
    {
      console.log("received image: "+image.path+", "+image.width+"/"+image.height);
      displayImage(image);
    }
  ).catch(
    function(reason){
      console.log("Couldn't get image: "+reason);
    }
  );
};
