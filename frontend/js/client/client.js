let userToken = localStorage.getItem('token')
let selectProvedores = document.querySelector('select#provedores')
let selectCategoria = document.querySelector('select#categoria')
let novoAgendamento = document.querySelector('#clientServices .providerSelect a')



axios.get('http://localhost:3333/providers', {headers: {'Content-Type': 'application/json', 'Authorization': 'Bearer ' + userToken}})
    .then(function (response) {
        if (response.status == 200) {
            for (let provider of response.data.content) { 
                let option = document.createElement('option')
                option.textContent = provider.provider.name
                option.setAttribute('value', provider.provider.name)
                selectProvedores.append(option)
            }
        }
    })
    .catch(function (error) {
        if (error.response.status == 401) {
            setTimeout(()=> {
                window.location.href = '../../index.html'
            }, 3000)
            return createCustomAlert(`${JSON.stringify(error.response.data)}<br>Refresh em 3s`)
        }
        createCustomAlert(JSON.stringify(error.response.data))
        console.error('Erro ao enviar dados:', error);
});


axios.get('http://localhost:3333/categories', {headers: {'Content-Type': 'application/json', 'Authorization': 'Bearer ' + userToken}})
    .then(function (response) {
        if (response.status == 200) {
            for (let category of response.data.content) { 
                let option = document.createElement('option')
                option.textContent = category.name
                option.setAttribute('value', category.slug)
                selectCategoria.append(option)
            }
        }
    })
    .catch(function (error) {
        if (error.response.status == 401) {
            setTimeout(()=> {
                window.location.href = '../../index.html'
            }, 3000)
            return createCustomAlert(`${JSON.stringify(error.response.data)}<br>Refresh em 3s`)
        }
        createCustomAlert(JSON.stringify(error.response.data))
        console.error('Erro ao enviar dados:', error);
});


novoAgendamento.addEventListener('click', ()=>{
    axios.get('http://localhost:3333/providers/services', {headers: {'Content-Type': 'application/json', 'Authorization': 'Bearer ' + userToken}})
        .then(function (response) {

            if (response.status == 200) {
                for (let provider of response.data.content) { 
                    let option = document.createElement('Woption')
                    option.textContent = provider.provider.name
                    option.setAttribute('value', provider.provider.name)
                    selectProvedores.append(option)
                }
            }
        })
        .catch(function (error) {
            if (error.response.status == 401) {
                setTimeout(()=> {
                    window.location.href = '../../index.html'
                }, 3000)
                return createCustomAlert(`${JSON.stringify(error.response.data)}<br>Refresh em 3s`)
            }
            createCustomAlert(JSON.stringify(error.response.data))
            console.error('Erro ao enviar dados:', error);
    });
})
