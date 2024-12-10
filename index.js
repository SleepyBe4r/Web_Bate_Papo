import express from "express";
import session from "express-session";
import cookieParser from "cookie-parser";
import path from "path";

const app = express();

app.use(session({
    secret: "minh@chav3S3cr3t4",
    resave: false,
    saveUninitialized: true,
    cookie: {
        secure: false,
        httpOnly: true,
        maxAge: 1000 * 60 * 30 // 30 minutos;
    }
}));

app.use(cookieParser());

app.use(express.urlencoded({ extended: true }));

app.use(express.static(path.join(process.cwd(), 'pages/public')));
app.use(express.static(path.join(process.cwd(), 'pages/private')));

const host = "localhost";
const port = 3000;

var mensagens_Chat = [];
var lista_Usuarios = [];

function logar(req, resp) {
    // Recuperar os dados do formulário enviados para o servidor
    const usuario = req.body.usuario;
    const senha = req.body.senha;

    if(usuario == "admin" && senha == "123"){
        //criar session;
        req.session.usuarioLogado = true;
        //criar cookie com a data da ultima session logada;
        resp.cookie('dataHoraUltimoLogin', new Date().toLocaleString(), {maxAge: 1000 * 60 * 60 * 24 * 30, httpOnly: true});
        resp.redirect("/menu_Inicial");
    } else {
        resp.send(`
            <html>
                <head>
                    <meta charset="utf-8">
                    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css" rel="stylesheet"
                        integrity="sha384-EVSTQN3/azprG1Anm3QDgpJLIm9Nao0Yz1ztcQTwFspd3yD65VohhpuuCOmLASjC" crossorigin="anonymous">
                </head>
                <body>
                    <div class="container w-25"> 
                        <div class="alert alert-danger" role="alert">
                            Usuário ou senha inválidos!
                        </div>
                        <div>
                            <a href="/login.html" class="btn btn-primary">Tentar novamente</a>
                        </div>
                    </div>
                </body>
                <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/js/bootstrap.bundle.min.js"
                        integrity="sha384-MrcW6ZMFYlzcLA8Nl+NtUVF0sA7MsXsP1UyJoMp4YLEuNSfAP+JcXn/tWtIaxVXM"
                        crossorigin="anonymous">
                </script>
            </html>
        `);
    }
}

function inicio_View(req, resp){
    const dataHoraUltimoLogin = req.cookies['dataHoraUltimoLogin'];
    if (!dataHoraUltimoLogin){
        dataHoraUltimoLogin='';
    }

    resp.send(`
        <!DOCTYPE html>
        <html lang="pt-BR">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Menu Inicial - Bate-papo</title>
            <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
        </head>
        <body class="bg-light">
            <div class="container d-flex flex-column justify-content-center align-items-center vh-100">
                <h1 class="mb-5 text-center">Bem-vindo ao Bate-papo</h1>
                <div class="card p-4 shadow" style="width: 100%; max-width: 400px;">
                    <h2 class="text-center mb-4">Informações do Usuário</h2>
                    <ul class="list-group mb-4">
                        <li class="list-group-item">
                            Seu último acesso foi realizado em ${dataHoraUltimoLogin}
                        </li>
                    </ul>
                    <h2 class="text-center mb-4">Menu Inicial</h2>
                    <div class="d-grid gap-3">
                        <a href="/cadastrar_Usuario" class="btn btn-primary btn-lg">Cadastro de Usuários</a>
                        <a href="/batepapo" class="btn btn-success btn-lg">Entrar no Bate-papo</a>
                        <a href="/listar_Usuarios" class="btn btn-info btn-lg">Listar Usuários</a>
                        <a href="/logout" class="btn btn-danger btn-lg">Sair</a>
                    </div>
                </div>
            </div>
            <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"></script>
        </body>
        </html>
        `);
}

function getRandomPastelColor() {
    // Generate a random hue (0-360 degrees)
    const hue = Math.floor(Math.random() * 360);

    // Saturation (0 to 30% for pastel effect)
    const saturation = Math.floor(Math.random() * 30) + 20;  // 20% to 50%

    // Lightness (70% to 90% for pastel effect)
    const lightness = Math.floor(Math.random() * 20) + 70;  // 70% to 90%

    // Return the pastel color in HSL format
    return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
}

function cadastrar_Usuario(req, resp){
    
    const nome = req.body.nome;
    const dataNascimento = req.body.dataNascimento;
    const apelido = req.body.apelido;
    const id = new Date().getTime();
    const cor =  getRandomPastelColor();

    const dataAtual = new Date();
    const dataNascimentoObj = new Date(dataNascimento);

    let idade = dataAtual.getFullYear() - dataNascimentoObj.getFullYear();
    const mes = dataAtual.getMonth() - dataNascimentoObj.getMonth();
    
    if (mes < 0 || (mes === 0 && dataAtual.getDate() < dataNascimentoObj.getDate())) {
      idade--;
    }

    if (nome && dataNascimento && idade >= 12 && apelido) {

        const usuario = {
            id,
            nome,
            dataNascimento,
            apelido,
            cor
        };

        lista_Usuarios.push(usuario);

        resp.redirect("/listar_Usuarios");
    } else {
        resp.write(`
            <!DOCTYPE html>
            <html lang="pt-BR">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Cadastro de Usuário - Bate-papo</title>
                <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
            </head>
            <body class="bg-light">
                <div class="container d-flex flex-column justify-content-center align-items-center vh-100">
                    <h1 class="mb-5 text-center">Cadastro de Usuário</h1>
                    <div class="card p-4 shadow" style="width: 100%; max-width: 400px;">
                        <h2 class="text-center mb-4">Preencha suas informações</h2>
                        <form action="/cadastrar_Usuario" method="POST">
                            <!-- Campo Nome -->
                            <div class="mb-3">
                                <label for="nome" class="form-label">Nome</label>
                                <input type="text" class="form-control" id="nome" name="nome" placeholder="Digite seu nome" value="${nome || ''}" required>
                                ${!nome ? '<p class="text-danger">Nome é obrigatório!</p>' : ''}
                            </div>
                            <!-- Campo Data de Nascimento -->
                            <div class="mb-3">
                                <label for="dataNascimento" class="form-label">Data de Nascimento</label>
                                <input type="date" class="form-control" id="dataNascimento" name="dataNascimento" value="${dataNascimento || ''}" required>
                                ${!dataNascimento ? '<p class="text-danger">Data de Nascimento é obrigatório!</p>' : idade < 12 ? '<p class="text-danger">O Usuario de ter 12 ou mais anos de idade!</p>' : ''}
                            </div>
                            <!-- Campo Nickname -->
                            <div class="mb-3">
                                <label for="apelido" class="form-label">Nickname ou Apelido</label>
                                <input type="text" class="form-control" id="apelido" name="apelido" placeholder="Escolha um apelido" value="${apelido || ''}" required>
                                ${!apelido ? '<p class="text-danger">Apelido é obrigatório!</p>' : ''}
                            </div>
                            <!-- Botões -->
                            <div class="d-grid gap-3">
                                <button type="submit" class="btn btn-primary btn-lg">Cadastrar</button>
                                <a href="/menu_Inicial" class="btn btn-secondary btn-lg">Voltar ao Menu</a>
                            </div>
                        </form>
                    </div>
                </div>
                <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"></script>
            </body>
            </html>
        `);
    }
    resp.end();
}

function listar_Usuarios(req, resp){

    resp.write(`
        <!DOCTYPE html>
        <html lang="pt-BR">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Listar Usuários - Bate-papo</title>
            <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
        </head>
        <body class="bg-light">
            <div class="container my-5">
                <h1 class="mb-4 text-center">Lista de Usuários</h1>
                <div class="card shadow">
                    <div class="card-body">
                        <table class="table table-striped">
                            <thead class="table-dark">
                                <tr>
                                    <th>Nome</th>
                                    <th>Data de Nascimento</th>
                                    <th>Apelido</th>
                                </tr>
                            </thead>
                            <tbody>
    `);

    // Adicionar as linhas da tabela
    lista_Usuarios.forEach((usuario) => {
        resp.write(`
        <tr>
            <td>${usuario.nome}</td>
            <td>${usuario.dataNascimento}</td>
            <td>${usuario.apelido}</td>
        </tr>
        `);
    });

    resp.write(`
                </tbody>
                </table>
                <a class="btn btn-primary" href="/cadastrar_Usuario">${lista_Usuarios.length > 0 ? "Cadastrar mais um Usuario": "Cadastrar um Usuario"}</a>
                <a class="btn btn-dark" href="/menu_Inicial">Voltar para o Menu</a>
            </div>
            </div>
        </body>
        <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js" integrity="sha384-YvpcrYf0tY3lHB60NNkmXc5s9fDVZLESaAA55NDzOxhy9GkcIdslK1eN7N6jIeHz" crossorigin="anonymous"></script>
        </html>
    `);
}

function batepapo_View(req, resp) {
    resp.write(`
        <!DOCTYPE html>
        <html lang="pt-BR">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Bate-papo - Bate-papo</title>
            <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
            <style>
                .chat-container {
                    max-height: 500px;
                    overflow-y: scroll;
                }
                .message {
                    border-radius: 10px;
                    margin-bottom: 10px;
                    padding: 10px;
                }
                .message-user {
                    align-self: flex-end;
                }
                .message-header {
                    font-weight: bold;
                    margin-bottom: 5px;
                }
            </style>
        </head>
        <body class="bg-light">
            <div class="container d-flex flex-column justify-content-center align-items-center vh-100">
                <h1 class="mb-5 text-center">Bate-papo</h1>
                
                <!-- Container de mensagens -->
                <div class="card p-4 shadow" style="width: 100%; max-width: 500px;">
                    <div class="chat-container d-flex flex-column" id="chat-box">`
    );

    mensagens_Chat.forEach((mensagem) => {
        resp.write(`
            <div class="message message-user" style="background-color: ${mensagem.usuario.cor}">
                <div class="message-header" >${mensagem.usuario.apelido}</div> 
                ${mensagem.texto}
            </div>
        `);
    });   

    resp.write(`                    
                    </div>

                    <!-- Formulário para enviar mensagem -->
                    <div class="mt-3">
                        <form action="/mandar_Mensagem" method="POST">
                            <!-- Select para escolher o destinatário -->
                            <div class="row">
                                <select id="usuario" name="usuario" class="form-select m-1" aria-label="Selecione o destinatário">
                                <option value="">Selecione um Usuario</option>`
    );

    lista_Usuarios.forEach((usuario) => {
        resp.write(`
            <option value="${usuario.id}">${usuario.apelido}</option>
        `);
    });              
    
    resp.write(`      
                                </select>
                                <input type="text" class="form-control m-1" id="mensagem" name="mensagem" placeholder="Digite sua mensagem..." aria-label="Mensagem">
                            </div>

                            <div class="row">
                                <button class="btn btn-primary mb-1 mx-1 mt-2" id="send-btn">Enviar</button>
                                <a href="/menu_Inicial" class="btn btn-secondary m-1">Voltar ao Menu</a>
                            </div>
                        </form>
                    </div>
                </div>
            </div>

            <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"></script>
        </body>
        </html>

    `);
}

function mandar_Mensagem(req, resp){
    
    const usuario_Id = req.body.usuario;
    const texto = req.body.mensagem;
    const id = new Date().getTime();
    
    if (usuario_Id && texto) {

        const usuario = lista_Usuarios.find(usuario => usuario.id == usuario_Id);

        const mensagem = {
            id,
            usuario,
            texto
        };

        mensagens_Chat.push(mensagem);

        resp.redirect("/batepapo");
    } else {
        resp.write(`
            <!DOCTYPE html>
            <html lang="pt-BR">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Bate-papo - Bate-papo</title>
                <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
                <style>
                    .chat-container {
                        max-height: 500px;
                        overflow-y: scroll;
                    }
                    .message {
                        border-radius: 10px;
                        margin-bottom: 10px;
                        padding: 10px;
                    }
                    .message-user {
                        align-self: flex-end;
                    }
                    .message-header {
                        font-weight: bold;
                        margin-bottom: 5px;
                    }
                </style>
            </head>
            <body class="bg-light">
                <div class="container d-flex flex-column justify-content-center align-items-center vh-100">
                    <h1 class="mb-5 text-center">Bate-papo</h1>
                    
                    <!-- Container de mensagens -->
                    <div class="card p-4 shadow" style="width: 100%; max-width: 500px;">
                        <div class="chat-container d-flex flex-column" id="chat-box">`
        );
    
        mensagens_Chat.forEach((mensagem) => {
            resp.write(`
                <div class="message message-user" style="background-color: ${mensagem.usuario.cor}">
                    <div class="message-header" >${mensagem.usuario.apelido}</div> <br>
                    ${mensagem.texto}
                </div>
            `);
        });   
    
        resp.write(`                    
                        </div>
    
                       <!-- Formulário para enviar mensagem -->
                    <div class="mt-3">
                        <form action="/mandar_Mensagem" method="POST">
                            <!-- Select para escolher o destinatário -->
                            <div class="row">
                                <select id="usuario" name="usuario" class="form-select m-1" aria-label="Selecione o destinatário">
                                <option value="">Selecione um Usuario</option>`
        );
    
        lista_Usuarios.forEach((usuario) => {
            resp.write(`
                <option value="${usuario.id}">${usuario.apelido}</option>
            `);
        });              
        
        resp.write(`      
                                    </select>
                                    <input type="text" class="form-control m-1" id="mensagem" name="mensagem" placeholder="Digite sua mensagem..." aria-label="Mensagem">
                                    ${!usuario_Id ? '<p class="text-danger">Usuario é obrigatório!</p>' : 
                                        !texto ? '<p class="text-danger">O texto da mensagem é obrigatório!</p>' : ''
                                    }
                                </div>

                                <div class="row">
                                    <button class="btn btn-primary mb-1 mx-1 mt-2" id="send-btn">Enviar</button>
                                    <a href="/menu_Inicial" class="btn btn-secondary m-1">Voltar ao Menu</a>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
    
                <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"></script>
            </body>
            </html>
    
        `);
    }
    resp.end();
}

function validarAutenticacao(req, resp, next) {
    if (req.session.usuarioLogado) {
        alert("deu certo");
        next();
    } else{
        alert("voltando");
        resp.redirect("/login.html");
    }
}

app.get('/', (req,resp)=>{
    resp.redirect("/login");
});

app.get('/login', (req,resp)=>{
    resp.redirect("/login.html");
});

app.post('/login', logar);

app.get("/menu_Inicial", validarAutenticacao, inicio_View);

app.get("/cadastrar_Usuario", validarAutenticacao, (req,resp)=>{
    resp.redirect("create_Usuario.html");
});

app.post("/cadastrar_Usuario", validarAutenticacao, cadastrar_Usuario);

app.get("/listar_Usuarios", validarAutenticacao, listar_Usuarios);

app.get("/batepapo", validarAutenticacao, batepapo_View);

app.post("/mandar_mensagem", validarAutenticacao, mandar_Mensagem);

app.get('/logout', (req, resp) => {
    req.session.destroy(); //eliminar a sessão.
    resp.redirect('/login.html');
});

app.listen(port, host, () => {
    console.log(`Servidor iniciado no endereço http://${host}:${port}`);    
})