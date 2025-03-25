# Como Executar o projeto:

1 - Em seu servidor postgress, crie o banco de dados:

```sql
CREATE DATABASE nome_do_banco
    WITH 
    OWNER = seu_usuario
    ENCODING = 'UTF8'
    CONNECTION LIMIT = -1;
```

e forneça todas as permissões caso nao tenha

```sql    
GRANT ALL PRIVILEGES ON DATABASE nome_do_banco TO seu_usuario;

```

2 - Crie um arquivo `.env` e Configure as variaveis de ambiente, e acordo com o exemplo em `.env.exemple`

```sql    
SECRET_KEY='django-insecure-7kj78(=mj=n7)umfiw(lk(-0o$6fy#s+!_+*$r-e5bs@&yu&+!'
DEBUG=False
DATABASE_NAME="your db name here"
DATABASE_USER="your user here"
DATABASE_PASSWORD="your password here"
DATABASE_HOST="your host here"
DATABASE_PORT="your port here"

# Docker ou dev (dev usa sqlite)
STAGE=Docker

```

Com isso execute

```bash   
source .env

```

3 - Crie a rede `desafio-network` com o seguinte comando:

```bash  
docker network create -d bridge desafio-network
```

E caso seu servidor postgress tambem esteja rodando via docker, o adicione a essa rede:


```bash  
docker network connect desafio-network CONTAINER_POSTGRESS
```

4 - Com isso va em seu terminal execute:

```bash  
docker compose build --no-cache
docker compose up -d --build 

```

5 - A api já estara disponivel para uso em:

```
http://127.0.0.1:8003/desafio/api/v1/"

```
