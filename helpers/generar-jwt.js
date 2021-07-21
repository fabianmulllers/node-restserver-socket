const jwt = require('jsonwebtoken')
const { Usuario }= require('../models') 

const generarJWT = ( uid = '') => {

    return new Promise( (resolve, reject) => {

        const payload = { uid };
        jwt.sign(payload, process.env.SECRETPRIVATEKEY,{
            expiresIn: '4h'
        },( err, token) => {
            if( err ){
                console.log(err);
                reject('No se pudo generar el token');
            }else{
                resolve(token);
            }
        });

    } );

}

const comprobarJWT = async(token = '') => {

    try {
        
        if( token.length < 10 ){
            return null;
        }

        const { uid } = jwt.verify( token, process.env.SECRETPRIVATEKEY );
        const usuario = await Usuario.findById(uid);

        if ( usuario && usuario.estado){
            return usuario;
            // if(usuario.estado) {
  
            // }else{
            //     return null;
            // }
        }else{
            return null;
        }

    } catch (error) {

        return null;

    }
}

module.exports = {
    generarJWT,
    comprobarJWT
}