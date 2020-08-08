// STYLES DINAMICS

let clickThemes = true;

function showThemes() {
    let themes = document.getElementById('select-theme')
    
    if(clickThemes){
        themes.style.display = 'flex';
        clickThemes = false;

    }else{
        themes.style.display = 'none';
        clickThemes= true;
    }
}


let searchInput = document.getElementById('search-input');

function activateSearchButton(){
    
    let searchButton = document.getElementById('search-button');
    searchButton.classList.add('colored');
    searchButton.classList.remove('inactive');   

}

function checkEmptyInput() {
    if(searchInput.value.length == 0) {

        let searchButton = document.getElementById('search-button');
        searchButton.classList.add('inactive');
        searchButton.classList.remove('colored');

        let suggestions = document.getElementById('search-suggestions');
        suggestions.style.display = 'none';

        let div1 = document.getElementById('sugg1');
        let div2 = document.getElementById('sugg2');
        let div3 = document.getElementById('sugg3');

        div1.innerText = "";
        div2.innerText = "";
        div3.innerText = "";

    }
}

function changeTheme2Night(){
    let stylesheet = document.getElementById('stylesheet');
    stylesheet.href = './styles/night-theme/styles-night.css';
}

function changeTheme2Day(){
    let stylesheet = document.getElementById('stylesheet');
    stylesheet.href = './styles/day-theme/styles-day.css';
}

// SEARCH 

var apiKey = 'api_key=lBi3DfmhAX973lNDIbC2l0hCj4EymuCT'

function suggestSearch(){

    let input = document.getElementById('search-input').value;
    let div1 = document.getElementById('sugg1');
    let div2 = document.getElementById('sugg2');
    let div3 = document.getElementById('sugg3');

    fetch('https://api.giphy.com/v1/tags/related/'+ input +'?' + apiKey)
    .then(res => res.json())
    .then(res => {

        if(input.length > 1){

            activateSearchButton()

            let suggestions = document.getElementById('search-suggestions');
            suggestions.style.display = 'flex';
    
            div1.innerText = res.data[0].name
            div2.innerText = res.data[1].name
            div3.innerText = res.data[2].name

            suggestions.appendChild(div1)
            suggestions.appendChild(div2)
            suggestions.appendChild(div3)
        }

    });
}

function searchGif(){
    let input = document.getElementById('search-input').value;
    fetch('https://api.giphy.com/v1/gifs/search'+ '?' + apiKey + '&q=' + input)
    .then(res => res.json())
    .then(res => console.log(res));
}


// SUGGESTED TODAY

function getRndInteger(min, max) {
    return Math.floor(Math.random() * (max - min) ) + min;
}

function showSuggestedToday(){

    let ran1 = getRndInteger(0,6);
    let ran2 = getRndInteger(7,13);
    let ran3 = getRndInteger(14,20);
    let ran4 = getRndInteger(21,27);
    let ransub = getRndInteger(0,10);

    let title1 = document.getElementById('suggested-t1')
    let gif1 = document.getElementById('suggested-g1')

    let title2 = document.getElementById('suggested-t2')
    let gif2 = document.getElementById('suggested-g2')

    let title3 = document.getElementById('suggested-t3')
    let gif3 = document.getElementById('suggested-g3')

    let title4 = document.getElementById('suggested-t4')
    let gif4 = document.getElementById('suggested-g4')

    fetch('https://api.giphy.com/v1/gifs/categories?' + apiKey)
    .then(res => res.json())
    .then(res => {
            
        title1.innerText = '#' + res.data[ran1].gif["tags"][1];       
        gif1.style.backgroundImage = 'url(' + res.data[ran1].gif["images"].downsized_medium["url"] + ')'; 
        
        title2.innerText = '#' + res.data[ran2].gif["tags"][1];    
        gif2.style.backgroundImage = 'url(' + res.data[ran2].gif["images"].downsized_medium["url"] + ')'; 

        title3.innerText = '#' + res.data[ran3].gif["tags"][1];
        gif3.style.backgroundImage = 'url(' + res.data[ran3].gif["images"].downsized_medium["url"] + ')'; 

        title4.innerText = '#' + res.data[ran4].gif["tags"][1]; 
        gif4.style.backgroundImage = 'url(' + res.data[ran4].gif["images"].downsized_medium["url"] + ')'; 

    });
}

showSuggestedToday()

// TRENDING DISPLAY


async function showTrending(){

    fetch('https://api.giphy.com/v1/gifs/trending?' + apiKey + '&limit=45')
    .then(res => res.json())
    .then(res => {

        for(let i= 0; i < 10; i++){
            let container = document.getElementById('trending-container');
            let div = document.createElement('div');
            
            div.style.backgroundImage = 'url(' + res.data[i].images["downsized"].url + ')';
            container.appendChild(div);
        }

    });
}

showTrending();
