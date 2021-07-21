const express = require('express')
const cors = require('cors');
const { dbConnection } = require('../database/config');
// const { createServer } = require('http') 
const fileUpload = require('express-fileupload');
const { socketController } = require('../sockets/controller');


class Server {

    constructor(){
        this.app = express();
        this.port = process.env.PORT;
        this.server = require('http').createServer( this.app );
        this.io = require('socket.io')( this.server );

        this.paths ={
            auth      :'/api/auth',
            buscar      :'/api/buscar',
            categorias: '/api/categorias',
            usuarios  :'/api/usuarios',
            productos  :'/api/productos',
            uploads  :'/api/uploads',


        }


        //conectar a BD
        this.conectarDB();

        //Middlewares
        this.middlewares();

        //Rutas de mi aplicacion
        this.router();

        // Sockets
        this.sockets();
    }

    async conectarDB(){

        await dbConnection();
    }

    middlewares(){
        //CORS
        this.app.use(cors());

        //Lectura y parceo del body
        this.app.use( express.json() );

        //Directorio publico
        this.app.use( express.static('public') );

        //fileupload carga de archivo
        this.app.use(fileUpload({
            useTempFiles : true,
            tempFileDir : '/tmp/',
            createParentPath: true
        }));
    }

    router(){
      
        this.app.use(this.paths.auth , require( '../routes/auth' ) );
        this.app.use(this.paths.usuarios , require( '../routes/user' ) );
        this.app.use(this.paths.categorias , require( '../routes/categorias' ) );
        this.app.use(this.paths.productos , require( '../routes/productos' ) );
        this.app.use(this.paths.buscar , require( '../routes/buscar' ) );
        this.app.use(this.paths.uploads , require( '../routes/uploads' ) );


    }

    sockets(){
        this.io.on('connection', ( socket ) => socketController( socket,this.io ) );
    }

    listen(){
        this.server.listen(this.port, () => {
            console.log(`Example app listening at http://localhost:${this.port}`)
        })
    }

}

module.exports = Server