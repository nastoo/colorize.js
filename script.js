// Nathan Stooss - 2020
// This script colorizes b&w images of video
// Video frames need to be saved as individual images

// It uses the Deepai API
// Please put your API Key into the api_key const

// This is a nodeJS script, it use different modules : fs, deepai, node-wget, mkdirp
// You can install it running following commands into your terminal

// You need to put your images to colorize in a folder named to-colorize (located next to the script)

// Now, the Script !
// The API KEY : 
const api_key = "a0fd9664-5c6b-46ac-9850-46ccddd71890";

// Inclusing modules 
const fs = require('fs');
const deepai = require('deepai');
const wget = require('node-wget');
const mkdirp = require('mkdirp');

// Creating necessary folders
const originalFile = './to-colorize/';
const destFolder = './colorized/';
const filesProcessed = './processedFiles/';
mkdirp(originalFile);
mkdirp(destFolder);
mkdirp(filesProcessed);

// Getting timestamp to save processed images in a unique folder, and creating it
// It also creates another folder where original files would be moved at the end (called processedFiles)
let date = Date.now();
const finaldestFolder = destFolder + date + '/';
mkdirp(finaldestFolder);
mkdirp(filesProcessed + date + '/');

// Setting API Key
deepai.setApiKey(api_key);

// Listing directory files
fs.readdir(originalFile, function (err, files) {
    //handling error
    if (err) {
        return console.log('Unable to scan directory: ' + err);
    } 
    //listing all files using forEach
    files.forEach(function (file) {
        // Sends every to Deepai server
        console.log('Sending ' + file); 
        (async function() {
            var resp = await deepai.callStandardApi("colorizer", {
                image: fs.createReadStream(originalFile + file),
            });
            // download file from the URL gived in the json answer
            wget({
                url: resp.output_url, 
                dest: finaldestFolder + file
            });
        })()
        
        
    });
    // Original files copy to processedFiles, in folder named as the current timestamp
    fs.rename(originalFile, filesProcessed + date + '/', function (err) {
        if (err) {
            if (err.code === 'EXDEV') {
                copy();
            }
            return;
        }
    });
    mkdirp(originalFile);
});