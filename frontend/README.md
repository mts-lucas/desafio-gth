# Como Executar o projeto:

1 - Com seu backend já em execução, crie um arquivo `.env` com base em `.env.exemple`. O exemplo já esta preenchido com a url correta com o banco de dados, mas caso tenha escolhido outra porta diferente, modifique a url:

```
NEXT_PUBLIC_MYURL="http://127.0.0.1:8003/desafio/api/v1/"
```

Com isso execute

```bash   
source .env

```

2 - Com isso va em seu terminal execute:

```bash  
docker compose build --no-cache
docker compose up -d --build 

```

5 - A aplicação já estara disponivel para uso em:

```
http://127.0.0.1:8003/desafio/api/v1/"

```
