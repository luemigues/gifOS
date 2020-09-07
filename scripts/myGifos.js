import createGif from './script.js';

//MY GIFOS

function showMyGifos(res, append, rows){
    
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

                savedGifs.push(gif);
                filledColumns -= 2;

            }else if(filledColumns == 4){
                filledColumns=0;
            }
        }
    }
};

export {showMyGifos};