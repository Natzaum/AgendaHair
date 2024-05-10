# AgendaHair
Um software a ser desenvolvido para cadastro de usuários e agendamento de horários para atendimento.


A build executavel do electron fica localizada em dist/win-unpacked/agendahair.exe
(é necessário buildar antes)

## Passo 1: Instalar Dependências do Backend

Certifique-se de ter o Node.js e o npm instalados em seu sistema. Em seguida, instale as dependências.

```bash
npm install
```

## Passo 2: Configuração do Docker Compose

O arquivo `docker-compose.yml` está configurado para iniciar os serviços necessários para o projeto, incluindo um banco de dados PostgreSQL e uma ferramenta de gerenciamento de banco de dados conhecida como Adminer.


## Passo 3: Executar o Docker Compose

Execute o Docker Compose para criar e iniciar os contêineres(banco de dados e do adminer) .

```bash
docker-compose up -d
```

Este comando irá inicializar os serviços definidos no arquivo `docker-compose.yml`.

## Passo 4: Buildar a aplicação Electron

```bash
npm run build
```
O arquivo .exe vai aparecer em `dist/win-unpacked`, basta executar o agendahair.exe

## Passo 5: Rodar o Backend

```bash
npm run server
```

## Rotas do Backend

O backend possui as seguintes rotas:

### Registro de Usuário

```bash
http://localhost:3333/register
```

Esta rota permite que os usuários se registrem na aplicação.
Exemplo de dados que devem ser enviada:

(dados falsos para o exemplo)
```json
{
	"name": "cabeludo",
	"email": "...@gmail.com",
	"password": "123456we7",
    "type": "CLIENT",
	"sex": "Masculino",
	"genre": "Heterossexual",
	"CPF": "154.871.140-30",
	"CNPJ": "58.861.147/0001-56"
}

```


### Login de Usuário

```bash
http://localhost:3333/login
```

Esta rota permite que os usuários façam login na aplicação.

### Bugs conhecidos:

se utilizar npm run build (para buildar o electron) o backend vai apresentar falha
- para corrigir é só apagar o node_modules e usar npm i novamente




