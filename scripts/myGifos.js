import createGif from './home.js';
import { globalFunctions } from './script.js';
import Giphy from "./giphy.js";
import Recorder from "./recorder.js";

const upGiphy = new Giphy('https://upload.giphy.com/v1/gifs', 'lBi3DfmhAX973lNDIbC2l0hCj4EymuCT');

if(location.hash == '#creadorGifo'){
    showSection('creador');   
    
}else if(location.hash == '#misGifos'){
    showSection('gifos');
};


const recorder = new Recorder();

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

capture.addEventListener('click', async ()=> {
    try{
        globalFunctions.show(document.getElementById("capture-container"), 'block');
        globalFunctions.hide(document.getElementById('creator-container'));
        globalFunctions.hide(document.getElementById('misGifos'));
        globalFunctions.show(document.getElementById("captureButtons"), 'flex')
        getStreamAndRecord();

    }catch(err){
        console.log(err)
    }
});

async function getStreamAndRecord(){
    try{
        // SETTING RECORDER
        await recorder.initialize()
        await recorder.showStream()
        
            // recording
    
        const recordingButtons = document.getElementById("captureButtons");
        for(let button of recordingButtons.children){
            button.addEventListener('click', () =>{
                startRecordingGif()
            });
        };
    
        // saving and preview recording
        const stopRecordingButtons = document.querySelectorAll(".recordingButton");
        for(let button of stopRecordingButtons){
            button.addEventListener('click', () => {
                stopRecAndPreview();
            })
        };

    }catch(err){
        console.log(err);
        reRecord();
    }

};

const repeatBttn = document.getElementById('repeatBttn');
repeatBttn.addEventListener('click', () => {
    reRecord();
});

async function startRecordingGif(){
    try{
        changeButtonsTo('recording');
        
        recorder.startRecordingGif()
        
        const dateStarted = new Date().getTime();
        (function looper() {
            if(!recorder) {
                return;
            }
            
            document.querySelector('#timerPassed').innerHTML = time((new Date().getTime() - dateStarted));
            setTimeout(looper, 100);
        })();
    }catch(err){
        console.log(err)
        reRecord();
    }
    
};

function stopRecAndPreview(){
    
    try{
        
        changeButtonsTo('preview');
        recorder.stopRecAndPreview();
        
    }catch(err){
        console.log(err)
        reRecord();
    }
};

function reRecord(){
    try{
        video.style.display ='block';
        imgBlob.style.display = 'none';
        changeButtonsTo('re-record');
        getStreamAndRecord()

    }catch(err){
        console.log(err)

        // globalFunctions.hide(document.getElementById('capture-container'));
        // globalFunctions.hide(document.getElementById('uploading-container'));
        // globalFunctions.hide(document.getElementById('success-container'));
        
        showSection('creador');  
    }
}

document.getElementById('uploadBttn').addEventListener('click', uploadGif);

async function uploadGif(){
    try{
        let upload = await upGiphy.uploadGif(recorder.gif.blob);
        let res = upload.json()
        console.log(res);

    }catch(err){
        console.log(err)
    }
};


document.getElementById('play').addEventListener('click', ()=>{
    const progress = document.getElementById( "progressVid" );
    for(let li of progress.children){
        li.style.backgroundColor = '#999999';
    }
    video.play();
    videoProgress();
});


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
            globalFunctions.hide(document.getElementById("recordingButtons"));
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


function time(ms) {
    return new Date(ms).toISOString().slice(11, -1);
};

function videoProgress(){
    try{
        const progress = document.getElementById("progressVid");
        const vidDuration = video.duration;
        const partSec = (vidDuration * 10)/100;
        const partMil = partSec * 1000;
        
        if(video.readyState > 0.2){
            for(let i = 1;  i < (progress.children.length + 1); i++){
                setTimeout(() => {
                    const j = i - 1;
                    changeColor(progress.children[j]);
                },i * partMil);

            }
        }

        function changeColor(div){
            const theme = localStorage.getItem('theme');
            if(theme == 'day'){
                console.log('hello');
                div.style.backgroundColor = '#F7C9F3'; 
            }else if(theme == 'night'){
                div.style.backgroundColor = '#CE36DB'; 
            }else{
                div.style.backgroundColor = '#F7C9F3'; 
            }
        }

    }catch(err){
        console.log(err);
    }
}