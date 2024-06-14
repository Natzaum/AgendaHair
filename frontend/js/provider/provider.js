const userToken = localStorage.getItem('token');
const select = document.querySelector('select#category');
const btnVerMessages = document.querySelectorAll('#providerMesssages .providerSelect a button')[1];
const clientList = document.querySelector('#providerViewMessage .clientes-list');
const providerViewMessageBackButton = document.querySelector('#providerViewMessage button');
const messageForm = document.querySelector('#providerSendMessage form');
const providerLocation = document.querySelector('#providerLocation form');
const consultarAgendamento = document.querySelectorAll('#providerServices .providerSelect button')[1];


async function loadCategories() {
    try {
        const response = await axios.get('http://localhost:3333/categories', {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${userToken}`
            }
        });
        if (response.status === 200) {
            response.data.content.forEach(category => {
                const option = document.createElement('option');
                option.textContent = category.name;
                option.value = category.id;
                select.append(option);
            });
        }
    } catch (error) {
        handleAuthError(error);
    }
}

function handleAuthError(error) {
    if (error.response.status === 400) {
        return createCustomAlert(error.response.data.message);
    }
    if (error.response && error.response.status === 401) {
        setTimeout(() => {
            window.location.href = '../../index.html';
        }, 3000);
        createCustomAlert(`${JSON.stringify(error.response.data)}<br>Refresh em 3s`);
    } else {
        createCustomAlert(`Erro: ${error.message}`);
        console.error('Erro ao enviar dados:', error);
    }
}

async function sendMessage(event) {
    event.preventDefault();
    const formData = new FormData(messageForm);
    const userData = Object.fromEntries(formData.entries());

    try {
        const response = await axios.post('http://localhost:3333/messages/sent', userData, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${userToken}`
            }
        });
        if (response.status === 201) {
            createCustomAlert(response.data.message);
        }
    } catch (error) {
        handleAuthError(error);
    }
}

async function sendProviderLocation(event) {
    event.preventDefault();
    const formData = new FormData(providerLocation);
    const userData = {};

    formData.forEach((value, key) => {
        if (key === "available_days") {
            if (!userData[key]) userData[key] = [];
            userData[key].push(value);
        } else {
            userData[key] = value;
        }
    });

    try {
        const response = await axios.post('http://localhost:3333/provider/services', userData, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${userToken}`
            }
        });
        if (response.status === 201) {
            createCustomAlert('Serviço criado com sucesso!');
        }
    } catch (error) {
        handleAuthError(error);
    }
}

async function viewMessages() {
    const msgClientList = document.querySelector('#clientViewMessages .clientes-container .clientes-list');
    try {
        const response = await axios.get('http://localhost:3333/messages', {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${userToken}`
            }
        });

        if (response.status === 200) {
            response.data.content.forEach(message => {
                const messageElement = document.createElement('li');
                const hourFormatted = new Date(message.sent_at).toLocaleString();
                messageElement.innerHTML = `
                    <li>${message.sender.name}
                    <p>${message.content}</p>
                    <p style="color: #c7c7c7; height: 10px; font-size: 7px; font-style: italic;">${hourFormatted}</p>
                    <p style="color: #c7c7c7; height: 10px; font-size: 7px; font-style: italic;">${message.sender.email}</p></li>
                `;
                clientList.append(messageElement);
            });
        }
    } catch (error) {
        handleAuthError(error);
    }
}

async function consultarAgendamentos() {
    const clientPlan = document.querySelector('#providerPlan .clientes-container');
    try {
        const response = await axios.get('http://localhost:3333/schedules/contacted', {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${userToken}`
            }
        });

        if (response.status === 200) {
            response.data.content.forEach(servico => {
                const ul = document.createElement('ul');
                ul.classList.add('clientes-list');
                const li = document.createElement('li');
                const hourFormatted = new Date(servico.schedule_date).toLocaleString();
                li.innerHTML = `
                    ${servico.client.name}
                    <p>${servico.service.name}</p>
                    <p>Esta pagando: ${servico.service.price}R$</p>
                    <p>Contato: ${servico.client.email}</p>
                    ${hourFormatted}
                    <div style="display: flex; justify-content: space-around;">
                        <button onclick="deleteSchedule(${servico.id}, this)" style="background-color: #ad5e5e; width: 90px; height: 30px;">
                            <p style="margin: auto 0; color: white; font-size: 9px;">Cancelar Solicitação</p>
                        </button>
                    </div>
                `;
                ul.append(li);
                clientPlan.append(ul);
            });
        }
    } catch (error) {
        handleAuthError(error);
    }
}

async function deleteService(service_id) {
    try {
        const response = await axios.delete(`http://localhost:3333/provider/services/${service_id}`, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${userToken}`
            }
        });
        if (response.status === 200) {
            createCustomAlert('Serviço deletado com sucesso!');
        }
    } catch (error) {
        createCustomAlert('Erro ao deletar serviço!');
        console.error('Erro ao enviar dados:', error);
    }
}

async function deleteSchedule(schedule_id, button) {
    try {
        const response = await axios.delete(`http://localhost:3333/schedules/${schedule_id}`, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${userToken}`
            }
        });
        if (response.status === 200) {
            button.setAttribute('disabled',true)
            const tagP = button.querySelector('p')
            tagP.innerText = 'AGENDAMENTO CANCELADO'
            button.style.cursor = "no-drop"
            createCustomAlert('Agendamento cancelado com sucesso!');
        }
    } catch (error) {
        createCustomAlert('Erro ao deletar serviço!');
        console.error('Erro ao enviar dados:', error);
    }
}

messageForm.addEventListener('submit', sendMessage);
providerLocation.addEventListener('submit', sendProviderLocation);
btnVerMessages.addEventListener('click', viewMessages);
consultarAgendamento.addEventListener('click', consultarAgendamentos);
providerViewMessageBackButton.addEventListener('click', () => {
    clientList.textContent = '';
});

loadCategories();