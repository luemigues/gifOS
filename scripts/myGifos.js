import createGif from './home.js';
import { globalFunctions } from './script.js';
import Giphy from "./giphy.js";
import Recorder from "./recorder.js";
import { getSavedGifos } from './home.js';
import {changeTheme2Night, changeTheme2Day} from './script.js';

const upGiphy = new Giphy('https://upload.giphy.com/v1/gifs', 'lBi3DfmhAX973lNDIbC2l0hCj4EymuCT');
const giphy = new Giphy('https://api.giphy.com/v1', 'lBi3DfmhAX973lNDIbC2l0hCj4EymuCT');

const myGifosStorage = getSavedGifos();

window.onload = () => {

    const theme = localStorage.getItem('theme');

    if(theme == 'night'){
        changeTheme2Night();
    }else{
        changeTheme2Day();
    }
    
    if(location.hash == '#creadorGifo'){
        const newRecord = localStorage.getItem('newRecord');
                
        if(newRecord){
            showCaptureSetup();
            localStorage.removeItem('newRecord');

        }else{
            showSection('creador');
            addEvenCaptureConfirmBttns();
        }
    
    }else if(location.hash == '#misGifos'){
        showSection('gifos');

        document.getElementById('crearGifo').addEventListener('click', ()=> {
            showSection('creador');
            addEvenCaptureConfirmBttns();
        });

        document.getElementById("gifosAnchor").addEventListener('click', ()=> {
            showSection(); 
        });
    }

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
        globalFunctions.show(document.getElementById('creator-container'), 'block')
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

// VIDEO RECORDING 

function showCaptureSetup(){
    globalFunctions.show(document.getElementById("capture-container"), 'block');
    globalFunctions.hide(document.getElementById('creator-container'));
    globalFunctions.hide(document.getElementById('misGifos'));
    globalFunctions.show(document.getElementById("captureButtons"), 'flex');
    getStreamAndRecord();
}

function addEvenCaptureConfirmBttns(){
    
    capture.addEventListener('click', async ()=> {
        try{
            showCaptureSetup()
    
        }catch(err){
            console.log(err)
        }
    });
}

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

const captureTopText = document.getElementById('top-text');

async function startRecordingGif(){
    try{

        changeButtonsTo('recording');
        captureTopText.innerText = 'Capturando Tu Guifo';
        
        recorder.startRecordingGif()
        
        const dateStarted = new Date().getTime();
        (function looper() {
            if(recorder.vidRecorder.state == 'destroyed') {
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
        recorder.stopRecAndPreview();

        //style 

        changeButtonsTo('preview');
        captureTopText.innerText = 'Vista Previa';
        setUpVideoProgress();

        const duration = recorder.finishTime.getTime() - recorder.startTime.getTime();
        document.getElementById('timerRecorded').innerHTML = time(duration);


        //events 

        const repeatBttn = document.getElementById('repeatBttn');
        
        repeatBttn.addEventListener('click', () => {
            localStorage.setItem('newRecord', 'true');
            reRecord();
        });

        uploadAndShowGif();  
        
    }catch(err){
        console.log(err)
        
        if(err.name == 'NotAllowedError' || err.name == "PermissionDeniedError"){
            alert('Es necesario permitir el acceso a la cámara. Por favor, revisar permisos del navegador');
            reRecord();
        }
    }
};


//RE-RECORD - For recapture video or crush handling

function reRecord(){
    try{
        window.location.reload();
        
    }catch(err){
        console.log(err)
    }
}

// GIF UPLOAD
function uploadAndShowGif(){
    
    document.getElementById('uploadBttn').addEventListener('click', () =>{

        globalFunctions.hide(document.getElementById('capture-container'));
        globalFunctions.show(document.getElementById('uploading-container'), 'block');
        
        const interval = setInterval(animateLoading, 800);

        const uploadedGifId = uploadGif();
        uploadedGifId.then(id => {
            clearInterval(interval);         
            showGif(id)
        }) 
    }); 
    
}

async function uploadGif(){
    try{
        const blob = recorder.gif.blob
        let upload = await upGiphy.uploadGif(blob);
        const id = upload.data.id

        return id;

    }catch(err){
        console.log(err)
    }
};

function saveMyGif(gif){

    myGifosStorage.push(gif.data);
    localStorage.setItem('my-gifos', JSON.stringify(myGifosStorage));
}

async function showGif(id){
    
    globalFunctions.hide(document.getElementById('uploading-container'));
    globalFunctions.show(document.getElementById('success-container'), 'block');
    
    const gif = await giphy.getGifById(id);

    saveMyGif(gif);

    const urlGif = gif.data.images['downsized'].url;
    const gifContainer = document.getElementById('uploaded-gif')
    gifContainer.src = urlGif;

    const urlGiphy = gif.data.url

    document.getElementById('gifURL').addEventListener('click', ()=>{
        const url = document.createElement('textarea');
        document.body.appendChild(url);
        url.value = urlGiphy;
        url.select();
        document.execCommand('copy');
        url.style.display = 'none';
        document.body.removeChild(url);
        alert('El enlace a tu Gif se ha copiado en el portapapeles')
        console.log(gif.data.images['downsized'].url)
    })

    document.getElementById('gifDownload').addEventListener('click', async ()=>{

        var link = document.createElement('a');

        let response = await fetch(urlGif);
        let file = await response.blob();
        link.download = 'myGif';
        link.href = window.URL.createObjectURL(file);
        link.style.display = 'none';
        document.body.appendChild(link);
        link.click();
        window.URL.revokeObjectURL(link.href);
        document.body.removeChild(link);
    })
}

//VIDEO PROGRESS BAR
function animateLoading(){

    const progress = document.getElementById("progressUpload");
    let count = 0;

    if(count < progress.length){
        for(let i = 1;  i < (progress.children.length); i++){
            changeColor(progress.children[i]);
            count++
        }
    }else{
        for(let li of progress.children){
            li.style.backgroundColor = '#999999';
        }
        count = 0;
    }
}


//VIDEO PROGRESS BAR

function setUpVideoProgress(){

    document.getElementById('play').addEventListener('click', ()=>{
        const progress = document.getElementById( "progressVid" );
        for(let li of progress.children){
            li.style.backgroundColor = '#999999';
        }
        video.play();
        playVideoProgress();
    });
}

function playVideoProgress(){
    try{
        const progress = document.getElementById("progressVid");
        const vidDuration = recorder.finishTime.getTime() - recorder.startTime.getTime();
        const part = (vidDuration * 10)/100;
        
        if(video.readyState > 0.1){
            for(let i = 1;  i < (progress.children.length + 1); i++){
                const coloring = setTimeout(() => {
                    const j = i - 1;
                    changeColor(progress.children[j]);
                },i * part);
            }
        }

        
    }catch(err){
        console.log(err);
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

// GLOBAL FUNC FOR BUTTON CHANGING

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
    try{
        return  new Date(ms).toISOString().slice(11, -1);

    }catch(e){
        return null;
    }
};
