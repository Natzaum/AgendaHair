let userToken = localStorage.getItem('token')
let select = document.querySelector('select#category')
let btnVerMessages = document.querySelectorAll('#providerMesssages .providerSelect a button')[1]
let clientList = document.querySelector('#providerViewMessage .clientes-list')
let providerViewMessageBackButton =  document.querySelector('#providerViewMessage button')
const messageForm = document.querySelector('#providerSendMessage form');
const providerLocation = document.querySelector('#providerLocation form');
let consultarAgendamento = document.querySelectorAll('#providerServices .providerSelect button')[1]
axios.get('http://localhost:3333/categories', {headers: {'Content-Type': 'application/json', 'Authorization': 'Bearer ' + userToken}})
    .then(function (response) {
        if (response.status == 200) {
            for (let category of response.data.content) { 
                let option = document.createElement('option')
                option.textContent = category.name
                option.setAttribute('value', category.id)
                select.append(option)
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
        alert(error)
        console.error('Erro ao enviar dados:', error);
});



messageForm.addEventListener('submit', function (event) {
    event.preventDefault(); 
    const formData = new FormData(this); 
    const userData = {};
    formData.forEach(function (value, key) {
        userData[key] = value;
    });
    // Faz a requisição POST para o backend
    axios.post('http://localhost:3333/messages/sent', userData, {headers: {'Content-Type': 'application/json', 'Authorization': 'Bearer ' + userToken}})
        .then(function (response) {
            // alert(JSON.stringify(response.data))
            if (response.status == 200) {
                createCustomAlert(JSON.stringify(response.data))
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
});




providerLocation.addEventListener('submit', function (event) {
    event.preventDefault(); 
    const formData = new FormData(this); 
    const userData = {};
    console.log(formData);

    formData.forEach(function (value, key) {
        if (key === "available_days") {
            if (!userData[key]) {
                userData[key] = [];
            }
            userData[key].push(value);
        } else {
            userData[key] = value;
        }
    });
    

    axios.post('http://localhost:3333/provider/services', userData, {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + userToken
        }
    })
    .then(function (response) {
        if (response.status == 201) {
            createCustomAlert('Serviço criado com sucesso!');
        }
    })
    .catch(function (error) {
        if (error.response.status == 401) {
            setTimeout(()=> {
                window.location.href = '../../index.html'
            }, 3000)
            return createCustomAlert(`${JSON.stringify(error.response.data)}<br>Refresh em 3s`)
        }
        createCustomAlert(`Error: status code ${error.response.status}, para ver a lista de erros use a aba de network`);
        console.error('Erro ao enviar dados:', error);
    });
});


btnVerMessages.addEventListener('click', function () {
    let msgClientList = document.querySelector('#clientViewMessages .clientes-container .clientes-list')
    axios.get('http://localhost:3333/messages', {headers: {'Content-Type': 'application/json', 'Authorization': 'Bearer ' + userToken}})
            .then(function (response) {

                if (response.status == 200) {
                    for (let message of response.data.content) {
                        let messageElement = document.createElement('li')
                        let hourFormated = String(new Date(message.sent_at))
                        
                        messageElement.innerHTML = `
                        <li style="/* background-color: aquamarine; */">${message.sender.name}<p style="margin-top: 5px;">
                        ${message.content}</p>
                        <p style="color: #c7c7c7;height: 10px;font-size: 7px;font-style: italic;">${hourFormated.replace(/^\S+\s(\S+\s\S+\s)(\S+\s)(\S+)\s.*$/, "$2$1$3")}</p></li>
                         <p style="color: #c7c7c7;height: 10px;font-size: 7px;font-style: italic;">${message.sender.email}</p></li>
                        `

                        clientList.append(messageElement)
                    
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
                createCustomAlert(error.response)
                console.log('Erro ao receber dados:', error);
    });

})


consultarAgendamento.addEventListener('click', ()=> {
    let clientPlan = document.querySelector('#providerPlan .clientes-container')
    axios.get('http://localhost:3333/schedules/contacted', {headers: {'Content-Type': 'application/json', 'Authorization': 'Bearer ' + userToken}})
    .then(function (response) {
        if (response.status == 200) {
            for (let servico of response.data.content) { 
                const ul = document.createElement('ul');
                ul.classList.add('clientes-list')
                let li = document.createElement('li')

                let hourFormated = String(new Date(servico.schedule_date))
                li.innerHTML = `
                ${servico.client.name}
                <p>${servico.service.name}</p><p>Esta pagando: ${servico.service.price}R$</p><p>Contato: ${servico.client.email}</p>
                ${hourFormated.replace(/^\S+\s(\S+\s\S+\s)(\S+\s)(\S+)\s.*$/, "$2$1$3")}
                <div style="display: flex;justify-content: space-around;">
                    <button onclick="deleteSchedule(${servico.id})" style="    background-color: #ad5e5e;    width: 90px;    height: 30px;">
                    <p style="    margin: auto 0;    color: white;    font-size: 9px;">Cancelar Solicitação</p>
                    </button>    
                </div>
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


const deleteService = (service_id)=> {
    axios.delete(`http://localhost:3333/provider/services/${service_id}`, {headers: {'Content-Type': 'application/json', 'Authorization': 'Bearer ' + userToken}})
        .then(function (response) {
            if (response.status == 200) {
                createCustomAlert(JSON.stringify('Serviço deletado com sucesso!'))
            }
        })
        .catch(function (error) {
            createCustomAlert('Error ao deletar serviço!')
            console.error('Erro ao enviar dados:', error);
    });
}

const deleteSchedule = (schedule_id)=> {
    axios.delete(`http://localhost:3333/schedules/${schedule_id}`, {headers: {'Content-Type': 'application/json', 'Authorization': 'Bearer ' + userToken}})
        .then(function (response) {
            if (response.status == 200) {
                createCustomAlert('Agendamento cancelado com sucesso!')
            }
        })
        .catch(function (error) {
            createCustomAlert('Error ao deletar serviço!')
            console.error('Erro ao enviar dados:', error);
    });
}


providerViewMessageBackButton.addEventListener('click', ()=> {
    clientList.textContent = ''
})
