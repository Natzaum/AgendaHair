var btnSignin = document.querySelector("#signin");
var btnSignup = document.querySelector("#signup");


var body = document.querySelector("body");


btnSignin.addEventListener("click", function () {
   body.className = "sign-in-js"; 
});

btnSignup.addEventListener("click", function () {
    body.className = "sign-up-js";
})


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
                alert(JSON.stringify(response.data))
                console.log(response.data);
            })
            .catch(function (error) {
                alert(error)
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
                alert(JSON.stringify(response.data))
                console.log(response.data);
            })
            .catch(function (error) {
                alert(error)
                console.error('Erro ao enviar dados:', error);
            });
    });
});