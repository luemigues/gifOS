export class Recorder{
    constructor(recorder){

        this.recorder = recorder;

        this.videoSetting = {   
            audio: false,
            video:
                {
                width: { max: 832 },
                height: { max: 434 },
                facingMode: "user"
            }
        };

        this.video = document.getElementById('video');
        
    }

    async streamVideo(){
        try{
            const stream = await navigator.mediaDevices.getUserMedia(this.videoSetting);
            this.video.srcObject = stream;
            this.video.play();
        }catch(err){
            console.log(err)
            alert('No pudimos acceder a la camara')
        }
    };

    async record(method, callback){
        const stream = await navigator.mediaDevices.getUserMedia(this.videoSetting);
        const recorder = RecordRTC(stream, {
            type: 'gif',
            frameRate: 1,
            quality: 10,
            width: 360,
            hidden: 240,
            onGifRecordingStarted: function() {
            console.log('started')
            },
        }); 
        if(method == 'record'){
            recorder.startRecording();
        }
        if(method == 'stop'){
            recorder.stopRecording(callback);
        }
    };
}