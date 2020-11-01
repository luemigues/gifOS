class Recorder {
    constructor() {

        this.video = document.getElementById('video');
        this.capture = document.getElementById('capture');
        this.gif = {
            url: '',
            blob: '',
        }

        this.stream = '';
        this.vidRecorder = '';
        this.gifRecorder = '';

    }

    async initialize() {

        this.stream = await navigator.mediaDevices.getUserMedia({
            audio: false,
            video: {
                height: {
                    max: 480
                }
            }

        });
        console.log('STREAM ' + this.stream)
        this.vidRecorder = RecordRTC(this.stream, {
            type: 'video',
            quality: 10,
            mimeType: "video/webm; codecs=vp8",
            frameRate: 30,
        });

        this.gifRecorder = RecordRTC(this.stream, {
            type: 'gif',
            frameRate: 1,
            quality: 10,
            width: 360,
            hidden: 240,
            onGifRecordingStarted: function() {
                console.log('started')
            },
        });
    }


    async showStream() {
        console.log('SHOW STREAM ' + this)
        this.video.srcObject = this.stream;
        await this.video.play();
    }

    async startRecordingGif() {
        await this.vidRecorder.startRecording();
        await this.gifRecorder.startRecording();

        this.vidRecorder.stream = this.stream;
        this.gifRecorder.stream = this.stream;
    }

    stopRecAndPreview() {

        this.vidRecorder.stopRecording(() => {
            let videoBlob = this.vidRecorder.getBlob();
            this.video.src = URL.createObjectURL(videoBlob);
            this.video.load();
            this.vidRecorder.reset();
            this.vidRecorder.destroy();
            this.video.srcObject = null;
        })

        this.gifRecorder.stopRecording(() => {
            let blob = this.gifRecorder.getBlob();
            let form = new FormData();
            form.append('file', blob, 'myGif.gif');
            console.log(form.get('file'));
            this.gif.blob = form;

            const recordedGifURL = this.gifRecorder.toURL();
            this.gif.url = recordedGifURL;
            this.gifRecorder.reset();
            this.gifRecorder.destroy();

            this.showUploadedGif(this.gif.url);
        });

        
        this.stream.getTracks().forEach((track) => {
            track.stop();
        });
    }
    
    showUploadedGif(url){
        this.capture.src = url
    };
}

export default Recorder;