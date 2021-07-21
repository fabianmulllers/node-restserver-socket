const {response, request} = require('express');
const Usuario = require('../models/usuario');
const bcrypt = require('bcrypt');


const usuariosGet = async(req = request, res = response) => {

    const { limite = 5, desde = 0 } = req.query;
    const query =  { estado: true }; 

    // const usuarios = await Usuario.find(query)
    //         .skip(Number( desde))
    //         .limit(Number( limite ));
    // const total = await Usuario.countDocuments(query);

    const [total,usuarios ] = await Promise.all([
        Usuario.countDocuments(query),
        Usuario.find(query)
            .skip(Number( desde))
            .limit(Number( limite ))
    ]);



    res.json({
        total,
        usuarios
    });
};

const usuariosPut = async(req, res = response) => {

    const { id }= req.params;

    const { uid, password, correo, google, ...resto } = req.body;

    //TODO: validar contra base de datos
    if( password ){
         const salt = bcrypt.genSaltSync();
         resto.password = bcrypt.hashSync( password, salt );
    }   

    const usuario = await Usuario.findByIdAndUpdate( id, resto,{new:true});


    res.status(200).json(usuario);
};

const usuariosPost = async(req, res = response) => {

    const { nombre, correo, password, role } = req.body;
    const usuario = new Usuario( { nombre, correo, password, role } );

    //Encriptar la password
    const salt = bcrypt.genSaltSync();
    usuario.password = bcrypt.hashSync( password, salt);

    //Guardar en BD
    await usuario.save();

    res.status(200).json({
        ok: true,
        usuario
    });
};

const usuariosDelete = async(req, res = response) => {

    const { id } =  req.params;


    //Fisicamente borrado
    // const usuario = await Usuario.findByIdAndDelete( id );

    const usuarioAutenticado = req.usuario;
    const usuario = await Usuario.findByIdAndUpdate( id, {estado: false },{new:true});

    res.json({ usuario, usuarioAutenticado });

};

const usuariosPatch = (req, res = response) => {
    res.json({
        ok: true,
        msg: "patch API - controlador"
    });
};

module.exports ={
    usuariosGet,
    usuariosPut,
    usuariosPost,
    usuariosDelete,
    usuariosPatch
}