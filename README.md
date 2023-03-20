sudo chmod -R 777 pgdata
# Multiplayer Pong Game And Social Networking Using React, Typescript, Node and Nestjs!

### Summary!

This fullstack website allows users to play the classic game of pong against others. it also features a range of impressive functionalities, including a login system, user profiles, a match-making system, a group chat interface, a DM system, a ranking system, a friends system, and a two-factor authentication system. This project offers an excellent opportunity to demonstrate technical proficiency across both frontend and backend development.

This is the final project of the core curriculum at 42 School (One of the top ten most innovative universities according to the WURI 2021 ranking). I completed this project on my own. All projects at 42 School go through three evaluations, and you can see the requirements for delivering the project at the end of this page.

## Main Technologies

* Frontend: React, Typescript, Styled Components.
* Backend: Nest.js, Node.js, Express.js, PostgreSQL.
* Authentication: Passport, JWT.
* 2FA: SendGrid API.
* Others: Docker and Docker Compose.

## Visual Overview

Dashboard:

![Dashboard](readme/dashboard.png "Dashboard")

Private Profile:

![Dashboard](readme/privateprofile.png "Private Profile")

Online Multiplayer Game:

![Dashboard](readme/ponggame.png "Online Multiplayer Game")

Public Chat Room:

![Dashboard](readme/publicchatroom.png)

Users Modal:

![Dashboard](readme/usersmodal.png)

Friends Modal:

![Dashboard](readme/friendsmodal.png)

Ranking:

![Dashboard](readme/ranking.png)

Chat Rooms:

![Dashboard](readme/chatrooms.png)

Room Adm Panel:

![Dashboard](readme/admpanel.png)

Final Game Scream:

![Dashboard](readme/finalscream.png)

There are additional functionalities in the game. At the end of this README, I will provide a list of all the requirements and tasks completed for this project.

Remove the database: rm -rf ./pgdata

### Setup - Como Usar o Programa!

O primeiro passo para executar o programa é rodar um "make" dentro do diretório. 

```
make
``` 

Depois disso, você precisa rodar os programas seguindo a seguinte ordem:

```
./Encoder
```

```
./Decoder
```

```
./Encoder
```

A primeira vez que o ./Encoder for rodado você precisa passar para ele parâmetros para ele saber que tipo de texto você quer comprimir.

O programa aceita dois tipos de parâmetros.

A maneira mais simples de usar é passar um texto ou múltiplos textos para o encoder como no exemplo abaixo:


Um único texto:
```
./Encoder "This text will be compressed"
```

múltiplos textos:
```
./Encoder "This text will be compressed" "This will be compressed too" This will be compressed to.
```

Você também tem a opção de passar arquivos, ou, múltiplos arquivos de texto para o programa. Para isso você precisa passar a flag "-f" e passar o diretório do arquivo:

```
./Encoder -f thisfilewillbecompressed.txt
```

Você também pode passar múltiplos arquivos: 
```
./Encoder -f thisfilewillbecompressed.txt text2.txt text3.txt text4.txt 
```

Depois de rodar o encoder com o texto que você quer que seja comprimido, você precisa rodar o decoder.

Para rodar o decoder é bem simples:

```
./Decoder
```

Depois de ter rodado o ./Decoder, você precisa rodar o ./Encoder novamente.

```
./Encoder
```

Se você fez tudo certo, ao rodar o Encoder pelo segunda vez, você deve receber esse tipo de mensagem na tela:

![image description](readme/comousar.png)

## Sumário

*  [Resumo](#resumo)
*  [Setup - Como Usar o Programa!](#setup---como-usar-o-programa)
*  [Explicação geral do Encoder!](#explicação-geral-do-encoder)
*  [Algoritimo de Huffman!](#algoritimo-de-huffman)
*  [Shared Memory!](#shared-memory)
*  [Quais informações enviamos para o decoder?](#quais-informações-enviamos-para-o-decoder)
*  [Explicação geral do Decoder!](#explicação-geral-do-decoder)
*  [Desafio](#desafio)


