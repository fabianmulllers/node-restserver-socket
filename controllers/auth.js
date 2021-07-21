const { response } = require('express');
const Usuario = require('../models/usuario');
const bcrypt = require('bcrypt');
const { generarJWT } = require('../helpers/generar-jwt');
const { googleVerify } = require('../helpers/google-verify');

const login = async(req, res = response ) =>  {

    const { correo, password } = req.body;

    try {
        //verificar si el email existe
        const usuario = await Usuario.findOne( { correo } );
        if( !usuario ){
            return res.status(400).json({
                msg:"Usuario/ password no son correctos - correo"
            })
        }

        //si el usuario esta activo
        if( !usuario.estado ){
            return res.status(400).json({
                msg:"Usuario/ password no son correctos - estado false"
            })
        }

        //verificar la contrasena 
        const validPassword = bcrypt.compareSync( password, usuario.password );
        if( !validPassword ){
            return res.status(400).json({
                msg:"Usuario/ password no son correctos - password"
            })
        }
        //generar el JWT
        const token = await generarJWT( usuario.id );

        res.json({
            usuario,
            token
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            msg:'Hable con el administrador'
        });
    }
    
}


const googleSignin = async(req = request, res= response ) => {

    const { id_token } = req.body;

    
    try {
        
        const {correo, nombre, img} = await googleVerify( id_token );

        let usuario = await Usuario.findOne({ correo });

        if( !usuario ){
            //tengo que crearlo
            const data = {
                nombre,
                correo,
                password:':P',
                img,
                google: true
            }
            usuario = new Usuario( data );
            await usuario.save();
        }

        //Si el usuario en DB
        if( !usuario.estado){
            return res.status(401).json({
                msg:'hable con el administrador usuario bloqueado'
            });
        }

        //generar el jwt
        const token = await generarJWT( usuario.id );
    
        res.json({
            usuario,
            token
        })
        
    } catch (error) {
        return res.status(400).json({
            msg:'No es reconocido'
        });
    }


}

const renovarToken = async( req, res = response ) => {

    const { usuario } = req;

    //generar el JWT
    const token = await generarJWT( usuario.id );

    res.json({
        usuario,
        token
    })
}


module.exports = {
    login,
    googleSignin,
    renovarToken
}

