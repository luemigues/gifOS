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
    stylesheet.setAttribute('type',"text/css");
}

function changeTheme2Day(){
    let stylesheet = document.getElementById('stylesheet');
    stylesheet.href = './styles/day-theme/styles-day.css';
    stylesheet.setAttribute('type',"text/css");
}

// SEARCH 

var apiKey = 'api_key=lBi3DfmhAX973lNDIbC2l0hCj4EymuCT'

function suggestSearch(){

    let input = document.getElementById('search-input').value;
    let div1 = document.getElementById('sugg1');
    let div2 = document.getElementById('sugg2');
    let div3 = document.getElementById('sugg3');

    activateSearchButton()

    fetch('https://api.giphy.com/v1/tags/related/'+ input +'?' + apiKey)
    .then(res => res.json())
    .then(res => {

        if(input.length > 1){   

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

function hide(element){
    element.style.display = "none";
}

function show(element){
    element.style.display = "block";
}

function searchFromInput(){
    let input = document.getElementById('search-input').value
    showResults(input)
}

function autocompleteAndSearch(id){
    let suggestedTerm = document.getElementById(id).innerText;
    let input = document.getElementById('search-input').value = suggestedTerm;

    showResults(input)
}

function closeSearch(){
    let search = document.getElementById('search')
    let trending = document.getElementById('trending')
    let suggested = document.getElementById('suggested-today')

    hide(search)
    show(trending)
    show(suggested)
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

function searchCategory(id){

    let categoryName = document.getElementById(id).innerText
    categoryName = categoryName.substring(1);
    showResults(categoryName)
}

function showResults(term){

    let trending = document.getElementById('trending')
    let suggested = document.getElementById('suggested-today')
    let suggestions = document.getElementById('search-suggestions');

    hide(trending)
    hide(suggested)
    hide(suggestions)

    let search = document.getElementById('search-container');
    let searchSection = document.getElementById('search');
    let searchTitle = document.getElementById('search-title');
    
    searchTitle.innerText = term;
    search.textContent = "";
    searchSection.style.display = 'block';
    
    fetch('https://api.giphy.com/v1/gifs/search'+ '?' + apiKey + '&q=' + term)
    .then(res => res.json())
    .then(res => showGifsOnGrid(res, search))
}

// TRENDING DISPLAY

function showTrending(offset){

    let trendingSection = document.getElementById('trending-container');

    fetch('https://api.giphy.com/v1/gifs/trending?' + apiKey + '&limit=25' + '&offset='+ offset)
    .then(res => res.json())
    .then(res => showGifsOnGrid(res, trendingSection));
}

function showGifsOnGrid(res, append){
    
    let gifs = res.data;
    let totalgifs = 0;
    let savedGifs = [];
    let filledColumns = 0


    for(let gif of gifs){
       
        if(totalgifs < 12){

        
            let gifWidth = gif.images["downsized"].width;
            let gifHeight = gif.images["downsized"].height;

            if(filledColumns < 3 && savedGifs.length > 0){

                createGif(savedGifs[0], append, true);

                savedGifs.shift();
                filledColumns+=2;
                totalgifs += 2;
            }

            if(gifWidth/gifHeight > 1.41){
                filledColumns+=2;

                if(filledColumns < 5){

                    createGif(gif, append, true);
                    totalgifs += 2;
                }

            }else{
                filledColumns++
                createGif(gif, append);
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
}

function createGif(gif, append, isWide = false){
    
    let div = document.createElement('div');
    let hover = document.createElement('div');
    div.appendChild(hover);
    append.appendChild(div);
    
    div.style.backgroundImage = 'url(' + gif.images["downsized"].url + ')'

    const regex = ' by';
    let title = gif.title.replace(regex,'');
    let splitTitle = title.split(" ");
    let tags = splitTitle.join(' #');
    hover.textContent = '#' + tags;
    
    div.onclick = () => window.open(gif.url)

    if(isWide){
        div.style.gridColumn = "span 2";
    }   
}

let n = 0
showTrending(n)

// window.onscroll = function(ev) {
//     if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight) {
//         showTrending(n+=25)
//     }
// };
