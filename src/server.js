//Servidor
//Importação das bibliotecas externas
const express = require('express');
const server = express();

const { pageLanding, pageStudy, pageGiveClasses, saveClasses, pageSuccess } = require('./pages')

//Configuração do nunjucks (template engine)
const nunjucks = require('nunjucks');
nunjucks.configure('src/views', {
  express: server,
  noCache: true,
})

//Início e configuração do servidor
server
//receber os dados do req.body
.use(express.urlencoded({ extended: true }))
// Configuração dos arquivos estáticos (css, scripts, imagens)
.use(express.static("public"))
// Configuração das rotas de aplicação
.get("/", pageLanding)
.get("/study", pageStudy)
.get("/give-classes", pageGiveClasses)
.post("/save-classes", saveClasses)
.get("/success", pageSuccess)
//start do servidor
.listen(5500);