var btnSignin = document.querySelector("#signin");
var btnSignup = document.querySelector("#signup");
var ALERT_TITLE = "Oops!";
var ALERT_BUTTON_TEXT = "Ok";


var body = document.querySelector("body");


btnSignin.addEventListener("click", function () {
    body.className = "sign-in-js"; 
    });
    
    btnSignup.addEventListener("click", function () {
        body.className = "sign-up-js";
})


if(document.getElementById) {
    window.alert = function(txt) {
        createCustomAlert(txt);
    }
}

function createCustomAlert(txt) {
    d = document;

    if(d.getElementById("modalContainer")) return;

    mObj = d.getElementsByTagName("body")[0].appendChild(d.createElement("div"));
    mObj.id = "modalContainer";
    mObj.style.height = d.documentElement.scrollHeight + "px";

    alertObj = mObj.appendChild(d.createElement("div"));
    alertObj.id = "alertBox";
    if(d.all && !window.opera) alertObj.style.top = document.documentElement.scrollTop + "px";
    alertObj.style.left = (d.documentElement.scrollWidth - alertObj.offsetWidth)/2 + "px";
    alertObj.style.visiblity="visible";

    h1 = alertObj.appendChild(d.createElement("h1"));
    h1.appendChild(d.createTextNode(ALERT_TITLE));

    msg = alertObj.appendChild(d.createElement("p"));
    //msg.appendChild(d.createTextNode(txt));
    msg.innerHTML = txt;

    btn = alertObj.appendChild(d.createElement("a"));
    btn.id = "closeBtn";
    btn.appendChild(d.createTextNode(ALERT_BUTTON_TEXT));
    btn.href = "#";
    btn.focus();
    btn.onclick = function() { removeCustomAlert();return false; }

    alertObj.style.display = "block";

}

function removeCustomAlert() {
    document.getElementsByTagName("body")[0].removeChild(document.getElementById("modalContainer"));
}

const checkAccountType = (account) => {
    if (account.role.slug == 'PROVIDER') {
        window.location.href = 'pages/provider/providerHome.html'
    }
    if (account.role.slug == 'CLIENT') {
        window.location.href = 'pages/Client/clientHome.html'
    }
}


document.addEventListener('DOMContentLoaded', function () {
    const signUpForm = document.querySelector('#signup-form');
    const signInForm = document.querySelector('#signin-form');

    signUpForm.addEventListener('submit', function (event) {
        event.preventDefault(); // Evita que o formulário seja submetido normalmente

        const formData = new FormData(this); // Obtém os dados do formulário

        const userData = {};
        formData.forEach(function (value, key) {
            userData[key] = value;
        });

        // Faz a requisição POST para o backend
        axios.post('http://localhost:3333/register', userData)
            .then(function (response) {
                // alert(JSON.stringify(response.data))
                if (response.status == 200) {
                    let account = response.data.user
                    localStorage.setItem('account', JSON.stringify(account));
                    localStorage.setItem('token', account.token);
                    checkAccountType(account)

                }
            })
            .catch(function (error) {
                createCustomAlert(JSON.stringify(error.response.data))
                console.error('Erro ao enviar dados:', error);
            });
    });


    signInForm.addEventListener('submit', function (event) {
        event.preventDefault(); // Evita que o formulário seja submetido normalmente

        const formData = new FormData(this); // Obtém os dados do formulário

        const userData = {};
        formData.forEach(function (value, key) {
            userData[key] = value;
        });

        axios.post('http://localhost:3333/login', userData)
            .then(function (response) {
                // alert(JSON.stringify(response.data))
                console.log(response.data);
                if (response.status == 200) {
                    let account = response.data.user
                    localStorage.setItem('account', JSON.stringify(account));
                    localStorage.setItem('token', account.token);
                    checkAccountType(account)

                }
            })
            .catch(function (error) {
                createCustomAlert(JSON.stringify(error.response.data))
                console.error('Erro ao enviar dados:', error);
            });
    });
});


// let account = JSON.parse(localStorage.getItem('account'))
// if (!account || account.role.slug == 'CLIENT') {
//     setTimeout(() => {
//         createCustomAlert('Usuário não autenticado ou sem permissão')
        
//     }, 2000);
//     setTimeout(() => {
//         window.location.href = '../../index.html'
//     }, 5000);
// }