/* ==========================================
            CareNest v1.0
========================================== */

const splash = document.getElementById("splash");
const landingPage = document.getElementById("landing-page");
const loginPage = document.getElementById("login-page");

const loadingText = document.getElementById("loading-text");
const startButton = document.getElementById("start-btn");

/* ==========================================
        Loading Messages
========================================== */

const messages = [

    "Connecting Care...",

    "Preparing Patient Space...",

    "Securing Your Data...",

    "Almost Ready..."

];

let index = 0;

const textInterval = setInterval(() => {

    index++;

    if(index < messages.length){

        loadingText.innerText = messages[index];

    }

},800);


/* ==========================================
        Splash → Landing
========================================== */

window.addEventListener("load",()=>{

    setTimeout(()=>{

        clearInterval(textInterval);

        splash.style.opacity="0";

        splash.style.transition="opacity .8s ease";

        setTimeout(()=>{

            splash.style.display="none";

            landingPage.style.display="flex";

        },800);

    },3500);

});


/* ==========================================
        Landing → Login
========================================== */

startButton.addEventListener("click",()=>{

    landingPage.style.opacity="0";

    landingPage.style.transition=".6s";

    setTimeout(()=>{

        landingPage.style.display="none";

        loginPage.style.display="flex";

        loginPage.style.opacity="0";

        setTimeout(()=>{

            loginPage.style.opacity="1";

            loginPage.style.transition=".8s";

        },50);

    },600);

});


/* ==========================================
        Demo Login
========================================== */

const form = document.querySelector("form");

form.addEventListener("submit",(event)=>{

    event.preventDefault();

    alert("Welcome to CareNest 🌿\n\nDashboard will be added in Version 2.0");

});
