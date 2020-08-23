
// Global vars
const apiKey = 'api_key=lBi3DfmhAX973lNDIbC2l0hCj4EymuCT'
const searchInput = document.getElementById('search-input');
let clickThemes = true;
let searchedTerms = [];

//Global funcs

function hide(element){
    element.style.display = "none";
};

function show(element){
    element.style.display = "block";
};

function getRndInteger(min, max) {
    return Math.floor(Math.random() * (max - min) ) + min;
};

//THEMES

function showThemes() {
    let themes = document.getElementById('select-theme')
    
    if(clickThemes){
        themes.style.display = 'flex';
        clickThemes = false;

    }else{
        themes.style.display = 'none';
        clickThemes= true;
    }
};

function changeTheme2Night(){
    let stylesheet = document.getElementById('stylesheet');
    stylesheet.href = './styles/night-theme/styles-night.css';
    stylesheet.setAttribute('type',"text/css");
};

function changeTheme2Day(){
    let stylesheet = document.getElementById('stylesheet');
    stylesheet.href = './styles/day-theme/styles-day.css';
    stylesheet.setAttribute('type',"text/css");
};

// SUGGESTED SEARCH

function activateSearchButton(){
    
    let searchButton = document.getElementById('search-button');
    searchButton.classList.add('colored');
    searchButton.classList.remove('inactive');   

};

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
};
 
function suggestSearch(){

    let input = searchInput.value;
    let div1 = document.getElementById('sugg1');
    let div2 = document.getElementById('sugg2');
    let div3 = document.getElementById('sugg3');

    activateSearchButton()

    fetch('https://api.giphy.com/v1/tags/related/'+ input +'?' + apiKey)
    .then(res => res.json())
    .then(res => {

        if(input.length >= 1){   

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
};

//SEARCH RESULTS

function searchFromInput(){
    let input = searchInput.value;
    if(input.length >= 1){
        showResults(input)

        searchedTerms.push(input)
        localStorage.setItem('search-History', JSON.stringify(searchedTerms));

        document.getElementById('previous-search').innerHTML = '';
        showSearchHistory();
    }
};

function showSearchHistory(){
    let recentSearch = JSON.parse(localStorage.getItem('search-History'));

    if(recentSearch){

        for(i= (recentSearch.length - 1); i > 0; i--){
    
            let container = document.getElementById('previous-search');
            let searchTerm = document.createElement('div');
    
            searchTerm.innerText = recentSearch[i];
            container.appendChild(searchTerm);
        }
    }
}


function showResults(term){
    
    let suggestions = document.getElementById('search-suggestions');
    hide(suggestions)
    
    let search = document.getElementById('search-container');
    let searchSection = document.getElementById('search');
    let searchTitle = document.getElementById('search-title');
    
    searchSection.scrollIntoView(true);
    
    window.smoothsc
    
    searchTitle.innerText = term;
    search.textContent = "";
    searchSection.style.display = 'block';
    
    searchInput.value = "";
    
    searchGifs(term, 0);
}

function searchGifs(term, offset){
    
    let search = document.getElementById('search-container');
    
    fetch('https://api.giphy.com/v1/gifs/search'+ '?' + apiKey + '&q=' + term + '&offset='+ offset)
    .then(res => res.json())
    .then(res => showGifsOnGrid(res, search, 5));
}

function autocompleteAndSearch(id){
    let suggestedTerm = document.getElementById(id).innerText;
    let input = searchInput.value = suggestedTerm;
    document.getElementById('previous-search').innerText = '';
    
    searchedTerms.push(input);
    localStorage.setItem('search-History', JSON.stringify(searchedTerms));
    
    showResults(input);
    showSearchHistory();
};

function closeSearch(){
    let search = document.getElementById('search')
    let trending = document.getElementById('trending')
    let suggested = document.getElementById('suggested-today')
    
    hide(search)
    show(trending)
    show(suggested)
};

// SUGGESTED TODAY


function suggestCategory(titlePostion, gifPosition, position){
    let random = [getRndInteger(0,5), getRndInteger(6,11), getRndInteger(12,17), getRndInteger(18,24)]
    let title = document.getElementById(titlePostion)
    let gif = document.getElementById(gifPosition)

    fetch('https://api.giphy.com/v1/gifs/categories?' + apiKey)
    .then(res => res.json())
    .then(res => {

        let gifData = res.data;
            
        title.innerText = '#' + gifData[random[position]].gif["tags"][1];
        gif.style.backgroundImage = 'url(' + gifData[random[position]].gif["images"].downsized_medium["url"] + ')'; 

    });
};

function suggestDailyCategories(){

    suggestCategory('suggested-t1','suggested-g1',0)
    suggestCategory('suggested-t2','suggested-g2',1)
    suggestCategory('suggested-t3','suggested-g3',2)
    suggestCategory('suggested-t4','suggested-g4',3)
}

suggestDailyCategories();

function suggestNewCategory(categoryId){
    if(categoryId == 'suggested-g1'){

        suggestCategory('suggested-t1','suggested-g1',0)
    } else if(categoryId == 'suggested-g2'){

        suggestCategory('suggested-t2','suggested-g2',1)
    }else if(categoryId == 'suggested-g3'){

        suggestCategory('suggested-t3','suggested-g3',2)
    }else if(categoryId == 'suggested-g4'){

        suggestCategory('suggested-t4','suggested-g4',3)
    }    
}

function searchCategory(id){

    let categoryName = document.getElementById(id).innerText
    categoryName = categoryName.substring(1);
    showResults(categoryName)
}



// TRENDING DISPLAY

function showTrending(offset){

    let trendingSection = document.getElementById('trending-container');

    fetch('https://api.giphy.com/v1/gifs/trending?' + apiKey + '&limit=25' + '&offset='+ offset)
    .then(res => res.json())
    .then(res => showGifsOnGrid(res, trendingSection, 5));
}

// GIFS IN GRID

function showGifsOnGrid(res, append, rows){
    
    let gifs = res.data;
    let totalgifs = 0;
    let savedGifs = [];
    let filledColumns = 0
    let gapsToFill = rows * 4;


    for(let gif of gifs){
       
        if(totalgifs < gapsToFill){

        
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
    
    div.style.backgroundImage = 'url(' + gif.images["original"].url + ')'

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

showSearchHistory()

let n = 0
showTrending(n)

window.onscroll = function(ev) {
    
    let searchSection = document.getElementById('search').style.display;

        if (((window.innerHeight + window.scrollY) >= document.body.offsetHeight) && (searchSection == 'block')) {
            let term = document.getElementById('search-title').innerText;
            searchGifs(term, n+=25)
        }else if(((window.innerHeight + window.scrollY) >= document.body.offsetHeight) && (searchSection == 'none')){
            showTrending(n+=25);
        }
    };