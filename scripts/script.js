import { onLoadGifosSection } from './myGifos.js';
import { onLoadIndex } from './home.js';

let clickThemes = true;
// onload

checkThemes();

window.onload = () => {
    if(window.location.pathname == '/misGifos.html'){
        onLoadGifosSection();
    }else{
        onLoadIndex();
    }

    activateEvents();
}


function checkThemes(){
    const theme = localStorage.getItem('theme');
    
    if(theme == 'night'){
        changeTheme2Night();
    }else{
        changeTheme2Day();
    }

}

//Global funcs
export let globalFunctions = {

    hide(element){
        element.style.display = "none";
    },
    
    show(element, type){
        switch(type){
            case 'grid':
                element.style.display = "grid";
            break;

            case 'flex':
                element.style.display = "flex";
            break;

            case 'block':
                element.style.display = "block";
            break;

            default: "block";
        }
    },
    
    getRndInteger(min, max) {
        return Math.floor(Math.random() * (max - min) ) + min;
    }
};

function activateEvents(){
    const themeDropdown = document.getElementById("theme-dropdown");
    for(let button of themeDropdown.children){
        button.addEventListener('click', showThemes)
    };
    
    document.getElementById("day-button").addEventListener('click',  changeTheme2Day);
    document.getElementById("night-button").addEventListener('click', changeTheme2Night);
    
    document.getElementById('crearGifo').addEventListener('click', ()=> {
        location.assign("./misGifos.html#creadorGifo");
    });
}


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
    stylesheet.setAttribute('href', './styles/night-theme/styles-night.css')
    localStorage.setItem('theme', 'night');
};

function changeTheme2Day(){
    let stylesheet = document.getElementById('stylesheet');
    stylesheet.setAttribute('href', './styles/day-theme/styles-day.css');
    localStorage.setItem('theme', 'day');
};

