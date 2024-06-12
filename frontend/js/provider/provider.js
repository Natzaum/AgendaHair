let userToken = localStorage.getItem('token')
let select = document.querySelector('select#categoria')


axios.get('http://localhost:3333/categories', {headers: {'Content-Type': 'application/json', 'Authorization': 'Bearer ' + userToken}})
    .then(function (response) {
        if (response.status == 200) {
            for (let category of response.data.content) { 
                let option = document.createElement('option')
                option.textContent = category.name
                option.setAttribute('value', category.slug)
                select.append(option)
            }
        }
    })
    .catch(function (error) {
        alert(error)
        console.error('Erro ao enviar dados:', error);
});
