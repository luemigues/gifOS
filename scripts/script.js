
let clickThemes = true;


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

const themeDropdown = document.getElementById("theme-dropdown");
for(let button of themeDropdown.children){
    button.addEventListener('click', showThemes)
};

document.getElementById("day-button").addEventListener('click', changeTheme2Day);
document.getElementById("night-button").addEventListener('click', changeTheme2Night);

document.getElementById('crearGifo').addEventListener('click', ()=> {
    location.assign(".././misGifos.html#creadorGifo");
});


//THEMES
window.onload = () => {
    const theme = localStorage.getItem('theme');
    if(theme == 'night'){
        changeTheme2Night();
    }else{
        changeTheme2Day();
    }
}

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

export function changeTheme2Night(){
    let stylesheet = document.getElementById('stylesheet');
    stylesheet.href = './styles/night-theme/styles-night.css';
    stylesheet.setAttribute('type',"text/css");
    localStorage.setItem('theme', 'night')
};

export function changeTheme2Day(){
    let stylesheet = document.getElementById('stylesheet');
    stylesheet.href = './styles/day-theme/styles-day.css';
    stylesheet.setAttribute('type',"text/css");
    localStorage.setItem('theme', 'day')
};

