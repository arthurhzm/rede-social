# Rede Social

Este projeto foi desenvolvido com o objetivo de aprender Redux e C# Web API utilizando .NET e Entity Framework.

## Pré-requisitos

Para rodar este projeto na sua máquina, você precisará ter os seguintes itens configurados e/ou instalados:

1. **.NET SDK**: Certifique-se de ter o .NET SDK instalado. Você pode baixá-lo [aqui](https://dotnet.microsoft.com/download).

2. **Node.js**: O Node.js é necessário para rodar o frontend do projeto. Você pode baixá-lo [aqui](https://nodejs.org/).

3. **Banco de Dados PostgreSQL**: Este projeto utiliza o PostgreSQL como banco de dados. Certifique-se de ter o PostgreSQL instalado e configurado na sua máquina. Você pode baixá-lo [aqui](https://www.postgresql.org/download/).

4. **String de Conexão**: Configure a string de conexão com o banco de dados PostgreSQL no arquivo `appsettings.json` localizado na pasta `api`. A string de conexão deve seguir o formato abaixo:
    ```json
    {
      "ConnectionStrings": {
        "DefaultConnection": "Host=localhost;Database=db_redeSocial;Username=postgres;Password=sua_senha"
      }
    }
    ```

## Como Rodar o Projeto

### Backend

1. Navegue até a pasta `api`:
    ```sh
    cd api
    ```

2. Restaure as dependências do projeto:
    ```sh
    dotnet restore
    ```

3. Execute as migrações do Entity Framework para criar o banco de dados:
    ```sh
    dotnet ef database update
    ```

4. Inicie o servidor:
    ```sh
    dotnet run
    ```

### Frontend

1. Navegue até a pasta `front`:
    ```sh
    cd front
    ```

2. Instale as dependências do projeto:
    ```sh
    npm install
    ```

3. Inicie o servidor de desenvolvimento:
    ```sh
    npm start
    ```

## Funcionalidades

- Autenticação de usuários com JWT
- CRUD de posts
- Sistema de likes e comentários
- Seguir e deixar de seguir usuários

## Tecnologias Utilizadas

- **Backend**: C#, .NET, Entity Framework, PostgreSQL
- **Frontend**: React, Redux, JavaScript

## Contribuição

Sinta-se à vontade para contribuir com este projeto. Para isso, siga os passos abaixo:

1. Faça um fork do repositório.
2. Crie uma branch para sua feature (`git checkout -b feature/nova-feature`).
3. Commit suas mudanças (`git commit -m 'Adiciona nova feature'`).
4. Faça um push para a branch (`git push origin feature/nova-feature`).
5. Abra um Pull Request.