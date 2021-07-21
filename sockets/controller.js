const { Socket } = require('socket.io');

const { comprobarJWT } = require('../helpers');
const { ChatMensajes } = require('../models');

const chatMensajes = new ChatMensajes();

const socketController = async ( socket = new Socket(), io ) => {
    

    const usuario = await comprobarJWT( socket.handshake.headers['x-token'] );
    if( !usuario ){
        return socket.disconnect();
    }

    chatMensajes.conectarUsuario( usuario )
    io.emit('usuarios-activos', chatMensajes.usuariosArr );

    //llenar mensajes cuando la persona se conecte
    io.emit('recibir-mensajes', chatMensajes.ultimos10 );

    //Conectarlo a una sala especial
    socket.join( usuario.id );// global, socket.id , usuario.id




    //Limpiar cuando alguien se desconecta
    socket.on('disconnect', () => {
        chatMensajes.desconectarUsuario( usuario.id );
        console.log(' usuario desconectado: ', usuario.nombre );
        io.emit('usuarios-activos', chatMensajes.usuariosArr );
    });

    socket.on('enviar-mensaje',( { uid, mensaje } ) => {

        if( uid ){
            //mensaje privado
            socket.to( uid ).emit( 'mensaje-privado', { de:usuario.nombre, mensaje });
            
        }else{
            chatMensajes.enviarMensaje( usuario.id, usuario.nombre, mensaje );
            io.emit('recibir-mensajes', chatMensajes.ultimos10 );
        }


    })
}


module.exports = {
    socketController
}