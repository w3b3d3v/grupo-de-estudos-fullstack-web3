# grupo-de-estudos-fullstack-web3
# Web3 Communities

![Screenshot 2024-12-10 at 17 33 46](https://github.com/user-attachments/assets/442b12e4-3603-4283-a634-e0c8452e6f23)

Projeto desenvolvido no grupo de estudos fullstack web3.

Com o objetivo de mostrar como desenvolver uma aplicação fullstack web3 (frontend, backend, smart contracts) foi desenvolvido o projeto Web3 Communities, um fórum onde apenas convidados podem acessar seus posts exclusivos.

**Funcionalidades**

**Frontend**: 
- Gestao da conexão da carteira (se conectar com sua carteira)
- Autenticar assinando uma mensagem com a carteira
- Checar o balance do nosso token 
- Caso autenticado ver os postos exclusivos 
- Realizar uma transação de convite pra outra carteira


**Backend**
- Auth: checar se assinatura enviada é valida, caso seja valida:
    - checar o balanço do endereço no nosso token, caso > 0: retornar um jwt
    - se menor que 0: retorna 401
- Post: recebe uma chamada com o jwt, verifica se o token é valido e retorna os posts daquele endereço


**Contratos**
- Token padrão erc20
- A carteira deploy do contrato seria a unica convidada inicialmente 
- Um endereço só pode convidar outras 3 carteiras
- Ferramental: Foundry & Hardhat





**Tecnologias usadas**

**Frontend/Backend**
- Next
- Wagmi
- Viem
- Rainbowkit
- JWT


**Contracts**
- Solidity
- Hardhat





