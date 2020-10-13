import createGif from './home.js';
import { globalFunctions } from './script.js';


if(location.hash == '#creadorGifo'){
    showSection('creador');   
    
}else if(location.hash == '#misGifos'){
    showSection('gifos');
};

//MY GIFOS

export function showMyGifos(res, append, rows){
    
    let totalgifs = 0;
    let savedGifs = [];
    let filledColumns = 0
    let gapsToFill = rows * 4;


    for(let i = res.length-1 ; i >= 0; i--){
       
        if(totalgifs < gapsToFill){
        
            let gifWidth = res[i].images["downsized"].width;
            let gifHeight = res[i].images["downsized"].height;


            if(filledColumns < 3 && savedGifs.length > 0){

                createGif(savedGifs[0], append, true);

                savedGifs.shift();
                filledColumns+=2;
                totalgifs += 2;
            }

            if(gifWidth/gifHeight > 1.41){
                filledColumns+=2;

                if(filledColumns < 5){

                    createGif(res[i], append, true);
                    totalgifs += 2;
                }

            }else{
                filledColumns++
                createGif(res[i], append);
                totalgifs ++;
            }

            if(filledColumns==5){

                savedGifs.push(res[i]);
                filledColumns -= 2;

            }else if(filledColumns == 4){
                filledColumns=0;
            }
        }
    }
};

//EVENTS

document.getElementById('crearGifo').addEventListener('click', ()=> {
    showSection('creador'); 
});

document.getElementById("gifosAnchor").addEventListener('click', ()=> {
    showSection(); 
});

function showSavedGifos(){  
        let myGifosgSection = document.getElementById('misGifos-container');
        let gifos = JSON.parse(localStorage.getItem('my-gifos'));
        if(gifos){
            showMyGifos(gifos, myGifosgSection, 10);
        }
};


function showSection(section){
    if(section == 'creador'){
        // globalFunctions.hide(document.getElementById('misGifos'));
        globalFunctions.show(document.getElementById('creadorGifo'), 'flex')
        globalFunctions.show(document.getElementById('creator-container'))
        globalFunctions.show(document.getElementById('backArrow'), 'block')
        globalFunctions.hide(document.getElementById('nav'));

        let mainHeader = document.getElementsByClassName('main-header')
        for(let e of mainHeader){
            e.style.justifyContent = "flex-start";
        };

    }else{
        globalFunctions.hide(document.getElementById('creadorGifo'));
        globalFunctions.show(document.getElementById('misGifos'), 'block');
        globalFunctions.hide(document.getElementById('backArrow'));
        showSavedGifos();
    }
}

const cancelButtons = document.getElementsByClassName('cancel');

for(let button of cancelButtons){
    button.addEventListener('click', ()=>{
        window.location.assign('../index.html');
    });
};

// VIDEO

const video = document.getElementById('video');
const capture = document.getElementById('capture');
const imgBlob = document.getElementById('blob');
let recordedGifURL = "";

capture.addEventListener('click', async ()=> {
    try{
        globalFunctions.show(document.getElementById("capture-container"), 'block');
        globalFunctions.hide(document.getElementById('creator-container'));
        globalFunctions.hide(document.getElementById('misGifos'));
        globalFunctions.show(document.getElementById("captureButtons"), 'flex')
        getStreamAndRecord('play');

    }catch(err){
        console.log(err)
    }
});

async function getStreamAndRecord(){

    // SETTING RECORDER
   const stream = await navigator.mediaDevices.getUserMedia(
        {
        audio: false,
        video: {
        height: { max: 480 }
        }
        
        });
        
        let recorder = RecordRTC(stream, {
            type: 'gif',
            frameRate: 1,
            quality: 10,
            width: 360,
            hidden: 240,
            onGifRecordingStarted: function() {
                console.log('started')
            },
        });
            
        video.srcObject = stream;
        video.play();

        // recording

        const recordingButtons = document.getElementById("captureButtons");
        for(let button of recordingButtons.children){
            button.addEventListener('click', () =>{
                startRecordingGif(recorder);
            });
        };

        // saving and preview recording
        const stopRecordingButtons = document.querySelectorAll(".recordingButton");
        for(let button of stopRecordingButtons){
            button.addEventListener('click', () => {
                stopRecAndPreview(recorder, stream);
            })
        };

};

const repeatBttn = document.getElementById('repeatBttn');
repeatBttn.addEventListener('click', () => {
    reRecord();
});

function reRecord(){
    video.style.display ='block';
    imgBlob.style.display = 'none';
    changeButtonsTo('re-record');
    getStreamAndRecord();   
}

function startRecordingGif(recorder){
    changeButtonsTo('recording');
    recorder.startRecording();
    const dateStarted = new Date().getTime();
    (function looper() {
        if(!recorder) {
            return;
        }
        
        document.querySelector('#timerPassed').innerHTML = time((new Date().getTime() - dateStarted));
        setTimeout(looper, 100);
    })();
};

function stopRecAndPreview(recorder, stream){

    try{
        changeButtonsTo('preview');
        recorder.stopRecording(function(){
    
            let blob = recorder.getBlob();
            let form = new FormData();
            form.append('file', blob, 'myGif.gif');
            console.log(form.get('file'));
    
            stream.getTracks().forEach( (track) => {
                track.stop();
            });
            recordedGifURL = recorder.toURL();
            console.log(recordedGifURL)
            imgBlob.src = recordedGifURL;
            video.style.display ='none';
            imgBlob.style.display = 'block';
            }
        });
    }catch(err){
        console.log(err)
        reRecord();
    }
};


function changeButtonsTo(buttons){
    switch(buttons){
        case 'recording':
            globalFunctions.hide(document.getElementById("captureButtons"));
            globalFunctions.show(document.getElementById("recordingButtons"), 'flex');
        break;

        case 'preview':
            globalFunctions.hide(document.getElementById("recordingButtons"));
            globalFunctions.show(document.getElementById("previewButtons"), 'flex');
        break;

        case 're-record':
            globalFunctions.hide(document.getElementById("previewButtons"));
            globalFunctions.show(document.getElementById("captureButtons"), 'flex');
        break;

        case 'uploading':
            globalFunctions.hide(document.getElementById("capture-container"));
            globalFunctions.show(document.getElementById("uploading-container"), 'flex');
        break;

        default: console.log('No buttons changed');
    }
};

function startRecording(recorder){
    const recordingButtons = document.getElementById("captureButtons");
        for(let button of recordingButtons.children){
            button.addEventListener('click', () =>{
                changeButtonsTo('recording');
                recorder.startRecording();
                const dateStarted = new Date().getTime();
                (function looper() {
                    if(!recorder) {
                        return;
                    }
        
                    document.querySelector('#timerPassed').innerHTML = time((new Date().getTime() - dateStarted));
                    setTimeout(looper, 100);
                })();
        
            });
        };
};

function time(ms) {
    return new Date(ms).toISOString().slice(11, -1);
};
