const userToken = localStorage.getItem('token');


const selectProvedores = document.querySelector('select#email');
const selectCategoria = document.querySelector('select#categoria');
const novoAgendamento = document.querySelector('#clientServices .providerSelect a');
const verServicosDisponiveis = document.querySelectorAll('#clientNewAppointment .buttons a')[1];
const btnVerMessages = document.querySelectorAll('#clientMessages .providerSelect a button')[1];
const clientList = document.querySelector('#clientViewMessages .clientes-container');
const providerViewMessageBackButton = document.querySelector('#clientViewMessages button');
const consultarAgendamento = document.querySelectorAll('#clientServices .providerSelect button')[1];
const messageForm = document.querySelector('#clientSendMessage form');
const categoria = document.getElementById('categoria');

const handleAuthError = (error) => {
    if (error.response && error.response.status === 401) {
        setTimeout(() => {
            window.location.href = '../../index.html';
        }, 3000);
        createCustomAlert(`${JSON.stringify(error.response.data)}<br>Refresh em 3s`);
        return true;
    }
    return false;
}

const loadProviders = () => {
    axios.get('http://localhost:3333/providers', {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + userToken
        }
    })
    .then(response => {
        if (response.status === 200) {
            response.data.content.forEach(provider => {
                const option = document.createElement('option');
                option.textContent = provider.provider.name;
                option.value = provider.provider.email;
                selectProvedores.append(option);
            });
        }
    })
    .catch(error => {
        console.error('Erro ao carregar provedores:', error);
        if (!handleAuthError(error)) {
            createCustomAlert(JSON.stringify(error.response.data));
        }
    });
}

const sendMessage = (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const userData = Object.fromEntries(formData);

    axios.post('http://localhost:3333/messages/sent', userData, {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + userToken
        }
    })
    .then(response => {
        if (response.status === 201) {
            createCustomAlert(response.data.message);
        }
    })
    .catch(error => {
        console.error('Erro ao enviar mensagem:', error);
        createCustomAlert(JSON.stringify(error.response.data));
    });
}

const loadCategories = () => {
    axios.get('http://localhost:3333/categories', {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + userToken
        }
    })
    .then(response => {
        if (response.status === 200) {
            response.data.content.forEach(category => {
                const option = document.createElement('option');
                option.textContent = category.name;
                option.value = category.slug;
                selectCategoria.append(option);
            });
        }
    })
    .catch(error => {
        console.error('Erro ao carregar categorias:', error);
        if (!handleAuthError(error)) {
            createCustomAlert(JSON.stringify(error.response.data));
        }
    });
}

const consultSchedules = () => {
    const clientPlan = document.querySelector('#clientPlan .clientes-container');
    axios.get('http://localhost:3333/schedules/contacted', {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + userToken
        }
    })
    .then(response => {
        if (response.status === 200) {
            clientPlan.innerHTML = ''; // Limpar o conteúdo existente
            response.data.content.forEach(servico => {
                const ul = document.createElement('ul');
                ul.classList.add('clientes-list');
                const li = document.createElement('li');
                const hourFormated = new Date(servico.schedule_date).toLocaleString();

                li.innerHTML = `
                    ${servico.service.provider.name}
                    <p>${servico.service.name}</p>
                    <p>Preço: ${servico.service.price}R$</p>
                    <p>Contato: ${servico.service.provider.email}</p>
                    <p>${hourFormated}</p>
                    <div style="display: flex; justify-content: space-around;">
                        <button onclick="deleteSchedule(${servico.id})" style="background-color: #ad5e5e; width: 90px; height: 30px;">
                            <p style="margin: auto 0; color: white; font-size: 9px;">Cancelar Solicitação</p>
                        </button>
                    </div>
                `;
                ul.append(li);
                clientPlan.append(ul);
            });
        }
    })
    .catch(error => {
        console.error('Erro ao consultar agendamentos:', error);
        if (!handleAuthError(error)) {
            createCustomAlert(JSON.stringify(error.response.data));
        }
    });
}

const viewAvailableServices = () => {
    axios.get('http://localhost:3333/providers/services', {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + userToken
        }
    })
    .then(response => {
        if (response.status === 200) {
            const services = response.data.content;
            const categoryValue = categoria.value;
            const filteredServices = services.filter(service => service.category.slug === categoryValue);
            
            const container = document.querySelector('.clientes-container');
            container.innerHTML = '';

            if (filteredServices.length > 0) {
                const ul = document.createElement('ul');
                ul.style = 'padding: 0; list-style-type: none;';
                filteredServices.forEach(service => {
                    const li = document.createElement('li');
                    li.innerHTML = `
                        <h3 style="color: aliceblue; text-shadow: 1px 1px 2px black;">${service.name} - ${service.provider.name}</h3>
                        <p style="color: lightskyblue; font-size: 10px;">Preço: R$${service.price}</p>
                        <p style="color: lightskyblue; font-size: 10px;">Local: ${service.location.name}, ${service.location.city} - ${service.location.state}</p>
                        <button onclick="contactService(${service.id})" style="background-color: #74b55c; width: 100px; height: 25px;">
                            <p style="color: aliceblue; width: 100%; font-size: 9px;">Solicitar serviço</p>
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
    .catch(error => {
        console.error('Erro ao ver serviços disponíveis:', error);
        if (!handleAuthError(error)) {
            createCustomAlert(JSON.stringify(error.response.data));
        }
    });
}

const viewMessages = () => {
    axios.get('http://localhost:3333/messages', {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + userToken
        }
    })
    .then(response => {
        if (response.status === 200) {
            clientList.innerHTML = ''; // Limpar o conteúdo existente
            response.data.content.forEach(message => {
                const ul = document.createElement('ul');
                ul.classList.add('clientes-list');
                const messageElement = document.createElement('li');
                const hourFormated = new Date(message.sent_at).toLocaleString();

                messageElement.innerHTML = `
                    <li>${message.sender.name}
                        <p style="margin-top: 5px;">${message.content}</p>
                        <p style="color: #c7c7c7; height: 10px; font-size: 7px; font-style: italic;">${hourFormated}</p>
                        <p style="color: #c7c7c7; height: 10px; font-size: 7px; font-style: italic;">${message.sender.email}</p>
                    </li>
                `;
                ul.append(messageElement);
                clientList.append(ul);
            });
        }
    })
    .catch(error => {
        console.error('Erro ao ver mensagens:', error);
        createCustomAlert(error.response);
    });
}


const contactService = (service_id) => {
    const dia = document.querySelector('#dia').value;
    axios.post(`http://localhost:3333/providers/services/${service_id}/contact`, { schedule_date: dia }, {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + userToken
        }
    })
    .then(response => {
        if (response.status === 200) {
            createCustomAlert('Serviço solicitado com sucesso!');
        }
    })
    .catch(error => {
        console.error('Erro ao contactar serviço:', error);
        createCustomAlert('Erro ao solicitar serviço!');
    });
}

const deleteSchedule = (schedule_id) => {
    axios.delete(`http://localhost:3333/schedules/${schedule_id}`, {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + userToken
        }
    })
    .then(response => {
        if (response.status === 200) {
            createCustomAlert('Agendamento cancelado com sucesso!');
        }
    })
    .catch(error => {
        console.error('Erro ao deletar agendamento:', error);
        createCustomAlert('Erro ao deletar agendamento!');
    });
}


messageForm.addEventListener('submit', sendMessage);
consultarAgendamento.addEventListener('click', consultSchedules);
verServicosDisponiveis.addEventListener('click', viewAvailableServices);
btnVerMessages.addEventListener('click', viewMessages);
providerViewMessageBackButton.addEventListener('click', () => clientList.textContent = '');

loadProviders();
loadCategories();