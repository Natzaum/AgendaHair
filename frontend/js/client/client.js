let userToken = localStorage.getItem('token')
let selectProvedores = document.querySelector('select#email')
let selectCategoria = document.querySelector('select#categoria')
let novoAgendamento = document.querySelector('#clientServices .providerSelect a')
let verServicosDisponiveis = document.querySelectorAll('#clientNewAppointment .buttons a')[1]
let btnVerMessages = document.querySelectorAll('#clientMessages .providerSelect a button')[1]
let clientList = document.querySelector('#clientViewMessages .clientes-container')
let providerViewMessageBackButton =  document.querySelector('#clientViewMessages button')
let consultarAgendamento = document.querySelectorAll('#clientServices .providerSelect button')[1]
let categoria = document.getElementById('categoria').value;




axios.get('http://localhost:3333/providers', {headers: {'Content-Type': 'application/json', 'Authorization': 'Bearer ' + userToken}})
    .then(function (response) {
        if (response.status == 200) {
            for (let provider of response.data.content) { 
                let option = document.createElement('option')
                option.textContent = provider.provider.name
                option.setAttribute('value', provider.provider.email)
                selectProvedores.append(option)
            }
        }
    })
    .catch(function (error) {
        console.log(error)
        if ( error.response & error.response.status == 401) {
            setTimeout(()=> {
                window.location.href = '../../index.html'
            }, 3000)
            return createCustomAlert(`${JSON.stringify(error.response.data)}<br>Refresh em 3s`)
        }
        createCustomAlert(JSON.stringify(error.response.data))
        console.error('Erro ao enviar dados:', error);
});


const messageForm = document.querySelector('#clientSendMessage form');


messageForm.addEventListener('submit', function (event) {
    event.preventDefault(); 
    const formData = new FormData(this); 
    const userData = {};
    formData.forEach(function (value, key) {
        userData[key] = value;
    });

    axios.post('http://localhost:3333/messages/sent', userData, {headers: {'Content-Type': 'application/json', 'Authorization': 'Bearer ' + userToken}})
        .then(function (response) {
            // alert(JSON.stringify(response.data))
            if (response.status == 200) {
                createCustomAlert(JSON.stringify(response.data))
            }
        })
        .catch(function (error) {
            createCustomAlert(JSON.stringify(error.response.data))
            console.error('Erro ao enviar dados:', error);
    });
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


consultarAgendamento.addEventListener('click', ()=> {
    let clientPlan = document.querySelector('#clientPlan .clientes-container')
    axios.get('http://localhost:3333/schedules/contacted', {headers: {'Content-Type': 'application/json', 'Authorization': 'Bearer ' + userToken}})
    .then(function (response) {
        if (response.status == 200) {
            for (let servico of response.data.content) { 
                const ul = document.createElement('ul');
                ul.classList.add('clientes-list')
                let li = document.createElement('li')

                let hourFormated = String(new Date(servico.schedule_date))
                li.innerHTML = `
                ${servico.service.provider.name}
                <p>${servico.service.name}</p><p>Preço: ${servico.service.price}R$</p><p>Contato: ${servico.service.provider.email}</p>
                ${hourFormated.replace(/^\S+\s(\S+\s\S+\s)(\S+\s)(\S+)\s.*$/, "$2$1$3")}
                `
                ul.append(li)
                clientPlan.append(ul)
            }
        }
    })
    .catch(function (error) {
        console.log(error)
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



verServicosDisponiveis.addEventListener('click', ()=>{
    axios.get('http://localhost:3333/providers/services', {headers: {'Content-Type': 'application/json', 'Authorization': 'Bearer ' + userToken}})
        .then(function (response) {

            if (response.status == 200) {
                const services = response.data.content;
                const filteredServices = services.filter(service => {
                    console.log('sllug serivce:', service.category.slug, 'categoria:', document.getElementById('categoria').value)
                    service.category.slug == document.getElementById('categoria').value
                    if (service.category.slug == document.getElementById('categoria').value) {
                        console.log('true')
                        return true
                    }
                });
                console.log(filteredServices)
    
                const container = document.querySelector('.clientes-container');
                container.innerHTML = '';
    
                if (filteredServices.length > 0) {
                    const ul = document.createElement('ul');
                    ul.style = 'padding: 0;list-style-type: none;'
                    filteredServices.forEach(service => {
                        const li = document.createElement('li');
                        li.innerHTML = `
                            <h3 style="color: aliceblue;text-shadow: 1px 1px 2px black;">${service.name} - ${service.provider.name}</h3>
                            <p style="color: lightskyblue;font-size: 10px;">Preço: R$${service.price}</p>
                            <p style="color: lightskyblue;font-size: 10px;">Local: ${service.location.name}, ${service.location.city} - ${service.location.state}</p>
                            <button onclick="contactService(${service.id})" value='${service.id}' style="background-color: #74b55c;width: 100px;height: 25px;">
                            <p style="    color: aliceblue;    width: 100%;    font-size: 9px;">
                            Solicitar serviço
                            </p>
</button>
                        `;
                        ul.appendChild(li);
                    });
                    container.appendChild(ul);
                } else {
                    container.innerHTML = '<p>Nenhum serviço encontrado para a categoria e dia selecionados.</p>';
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



btnVerMessages.addEventListener('click', function () {

    axios.get('http://localhost:3333/messages', {headers: {'Content-Type': 'application/json', 'Authorization': 'Bearer ' + userToken}})
            .then(function (response) {

                if (response.status == 200) {
                    for (let message of response.data.content) {
                        const ul = document.createElement('ul');
                        ul.classList.add('clientes-list')
                        let messageElement = document.createElement('li')
                        let hourFormated = String(new Date(message.sent_at))
                        
                        messageElement.innerHTML = `
                        <li style="/* background-color: aquamarine; */">${message.sender.name}<p style="margin-top: 5px;">
                        ${message.content}</p>
                        <p style="color: #c7c7c7;height: 10px;font-size: 7px;font-style: italic;">${hourFormated.replace(/^\S+\s(\S+\s\S+\s)(\S+\s)(\S+)\s.*$/, "$2$1$3")}</p></li>
                         <p style="color: #c7c7c7;height: 10px;font-size: 7px;font-style: italic;">${message.sender.email}</p></li>
                        `

                        ul.append(messageElement)
                        clientList.append(ul)
                    
                    }

                }
            })
            .catch(function (error) {
                createCustomAlert(error.response)
                console.log('Erro ao receber dados:', error);
    });

})

const contactService = (service_id)=> {
    let dia = document.querySelector('#dia').value
    console.log(service_id, dia)
    axios.post(`http://localhost:3333/providers/services/${service_id}/contact`, {schedule_date:dia}, {headers: {'Content-Type': 'application/json', 'Authorization': 'Bearer ' + userToken}})
        .then(function (response) {
            if (response.status == 200) {
                createCustomAlert(JSON.stringify('Serviço solicitado com sucesso!'))
            }
        })
        .catch(function (error) {
            createCustomAlert('Error!')
            console.error('Erro ao enviar dados:', error);
    });
}

providerViewMessageBackButton.addEventListener('click', ()=> {
    clientList.textContent = ''
})
