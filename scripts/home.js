import Giphy from "./giphy.js";
import {globalFunctions} from './script.js';

// Global vars
const searchInput = document.getElementById('search-input');
const searchSection = document.getElementById('search');
let searchedTerms = getSearchedTerms();
let myGifosStorage = getSavedGifos();
let n = 0;

const giphy = new Giphy('https://api.giphy.com/v1', 'lBi3DfmhAX973lNDIbC2l0hCj4EymuCT');

export function getSavedGifos(){
    const fromStorage = JSON.parse(localStorage.getItem('my-gifos'));
    if(fromStorage){
        return fromStorage;
    }else{
        return [];
    }
};


export function onLoadIndex(){
    activateHeaderEvents()
    suggestDailyCategories();
    showSearchHistory()
    showTrending(n)
}

//EVENT LISTENERS

function activateHeaderEvents(){

    document.getElementById("search-button").addEventListener('click', searchFromInput);
    
    searchInput.addEventListener('input', suggestSearch);
    searchInput.addEventListener('keyup', checkEmptyInput);
    
    const searchSuggestionsButtons = document.getElementById("search-suggestions");
    for(let button of searchSuggestionsButtons.children){
        button.addEventListener('click', () => {
            
            let suggestedTerm = button.innerText;
            let input = searchInput.value = suggestedTerm;
            document.getElementById('previous-search').innerText = '';
            
            searchedTerms.push(input);
            localStorage.setItem('search-History', JSON.stringify(searchedTerms));
            
            showResults(input);
            showSearchHistory();
        });
    };

    const closeCategoryItems = document.getElementsByClassName('close-category');
    for(let i=1 ; i <= 4; i++){
        closeCategoryItems[i-1].addEventListener('click', () => suggestNewCategory(`suggested-g${i}`));
    };
    
    const viewMorefromCategory = document.getElementsByClassName('button suggested-b');
    for(let i=1 ; i <= 4; i++){
        viewMorefromCategory[i-1].addEventListener('click', () => searchCategory(`suggested-t${i}`));
    };
}

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
        
        let div1 = document.getElementById('sugg0');
        let div2 = document.getElementById('sugg1');
        let div3 = document.getElementById('sugg2');
        
        div1.innerText = "";
        div2.innerText = "";
        div3.innerText = "";
        
    }
    
};

async function suggestSearch(){

    try{
        let input = searchInput.value;
        let div1 = document.getElementById('sugg0');
        let div2 = document.getElementById('sugg1');
        let div3 = document.getElementById('sugg2');
        
        activateSearchButton()
        
        let relatedTerms = await giphy.getRelatedTags(input);
            
        if(input.length >= 1){   
                
            let suggestions = document.getElementById('search-suggestions');
            suggestions.style.display = 'flex';
                
            div1.innerText = relatedTerms.data[0].name
            div2.innerText = relatedTerms.data[1].name
            div3.innerText = relatedTerms.data[2].name
        }
    }
    catch(err){
        return err;
    }  
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

function getSearchedTerms(){
    const fromStorage = JSON.parse(localStorage.getItem('search-History'));
    if(fromStorage){
        return fromStorage;
    }else{
        return [];
    }
};

function showSearchHistory(){

    try{
        let recentSearch = JSON.parse(localStorage.getItem('search-History'));
        
        if(recentSearch){
            
            for( let i = (recentSearch.length - 1); i >= 0; i--){
                
                let container = document.getElementById('previous-search');
                let searchTerm = document.createElement('div');
                
                searchTerm.innerText = recentSearch[i];
                container.appendChild(searchTerm);
    
                searchTerm.addEventListener('click', () => {showResults(searchTerm.innerText)})
    
            }
        }
    }
    catch(err){
        return err;
    }
};


function showResults(term){

    let suggestions = document.getElementById('search-suggestions');
    globalFunctions.hide(suggestions)
    
    let search = document.getElementById('search-container');
    let searchSection = document.getElementById('search');
    let searchTitle = document.getElementById('search-title');
    
    searchTitle.innerText = term;
    search.textContent = "";
    searchSection.style.display = 'block';
    
    searchInput.value = "";

    let searchButton = document.getElementById('search-button');
        searchButton.classList.add('inactive');
        searchButton.classList.remove('colored');
    
    searchGifs(term, 0, true);
    
};

async function searchGifs(term, offset, fromClick){

    try{
        let searchContainer = document.getElementById('search-container');
        
        let search = await giphy.getSearch(term, 25, offset)
        
        showGifsOnGrid(search, searchContainer, 5, fromClick);
    }
    catch(err){
        return err;
    }
};
    

// SUGGESTED TODAY

async function suggestCategory(titlePostion, gifPosition, position){
    try{
        let random = [globalFunctions.getRndInteger(0,5), globalFunctions.getRndInteger(6,11), globalFunctions.getRndInteger(12,17), globalFunctions.getRndInteger(18,24)];
        let title = document.getElementById(titlePostion);
        let gif = document.getElementById(gifPosition);
    
        let categories = await giphy.getCategories();
    
        let gifData = categories.data; 
        title.innerText = '#' + gifData[random[position]].name_encoded;
        gif.style.backgroundImage = 'url(' + gifData[random[position]].gif["images"].downsized_medium["url"] + ')'; 
    }
    catch(err){
        return err;
    }
};


function suggestDailyCategories(){

    suggestCategory('suggested-t1','suggested-g1',0)
    suggestCategory('suggested-t2','suggested-g2',1)
    suggestCategory('suggested-t3','suggested-g3',2)
    suggestCategory('suggested-t4','suggested-g4',3)
};

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
};

function searchCategory(id){

    let categoryName = document.getElementById(id).innerText
    categoryName = categoryName.substring(1);
    showResults(categoryName)
};

// TRENDING DISPLAY

async function showTrending(offset){

    try{
        let trendingSection = document.getElementById('trending-container');
        let trendings = await giphy.getTrendings(25, offset);
    
        showGifsOnGrid(trendings, trendingSection, 5, false);
    }
    catch(err){
        return err;
    }
};

// GIFS IN GRID

function showGifsOnGrid(res, append, rows, fromClick){
    
    let gifs = res.data || res;
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
    
    if(fromClick){
        window.scrollBy(0,searchSection.offsetTop - 150)
    }
};

function createGif(gif, append, isWide = false){

   try{
        let indexOncreate = myGifosStorage.findIndex(e => e.id == gif.id);

        let div = document.createElement('div');
        let hover = document.createElement('div');
        let span = document.createElement('span');
        div.appendChild(hover);
        append.appendChild(div);

        span.className = "material-icons";
        if(indexOncreate > -1){
            span.innerHTML = "favorite";
        }else{
            span.innerHTML = "favorite_border";
        }
        
    
        div.style.backgroundImage = 'url(' + gif.images["original"].url + ')'
    
        const regex = ' by';
        let title = gif.title.replace(regex,'');
        let splitTitle = title.split(" ");
        let tags = splitTitle.join(' #');
        hover.textContent = '#' + tags ;
        hover.appendChild(span);
        
        //div.addEventListener('click', () => window.open(gif.url))
        div.addEventListener('click', () => {

                let index = myGifosStorage.findIndex(e => e.id == gif.id);

                if(index > -1){                   
                    span.innerHTML = "favorite_border";
                    myGifosStorage.splice(index, 1);
                    localStorage.setItem('my-gifos', JSON.stringify(myGifosStorage));
                    
                }else{
                    myGifosStorage.push(gif);
                    localStorage.setItem('my-gifos', JSON.stringify(myGifosStorage));
                    span.innerHTML = "favorite";
                }
        });
    
        if(isWide){
            div.style.gridColumn = "span 2";
        }   
    }
    catch(err){
        return err;
    }
    
};

export default createGif;

window.onscroll = function(ev) {

    if(window.location.pathname.includes('index.html')){

        let search = searchSection.style.display;
    
            if (((window.innerHeight + window.scrollY) >= document.body.offsetHeight) && (search == 'block')) {
                let term = document.getElementById('search-title').innerText;
                searchGifs(term, n+=25,false)
            }else if(((window.innerHeight + window.scrollY) >= document.body.offsetHeight) && (search == '')){
                showTrending(n+=25);
            }
    }
};

