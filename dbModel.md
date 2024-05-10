users:
- id -> int
- name -> str max 50
- email -> str max 50
- password -> str max 100 (hashed)
- targetGroup -> str[] none
- address -> str none
- cpf -> str
- cnpj -> str
- sex -> enum ['male', 'female', 'other']
- genre -> str
- roleId -> int (foreign key referencing roles.id)
- admin -> boolean
- token -> str (hashed)
- available -> json

services:
- id -> int
- name -> str
- category -> str
- price -> int
- provider_id -> int (foreign key referencing users.id)
- description -> str
- status -> enum ['open', 'closed', 'finished']
- dateCreated -> date

locations:
- id -> int
- name -> str
- street -> str
- cep -> str
- city -> str
- state -> str
- number -> str

roles:
- id -> int
- name -> str
- slug -> str