const path = require('path')
const fs = require('fs')

const cloudinary = require('cloudinary').v2
cloudinary.config( process.env.CLOUDINARY_URL);

const { response }=  require('express');
const { subirArchivo } = require('../helpers');

const { Usuario, Producto } = require('../models')

const cargarArchivos = async ( req , res = response) => {

    //imagenes
    try {
        const nombre = await subirArchivo( req.files,undefined,'imgs');
        res.json({
            nombre
        });
    } catch (error) {
        return res.status(400).json({
            error
        });
    }
    

}

const actualizarImagen = async( req , res = response) => {

    const {id, coleccion} = req.params;

    let modelo;

    switch( coleccion ) {
        case 'usuarios':
            modelo = await Usuario.findById( id )
            if(!modelo){
                return res.status(400).json({
                    msg: `no existe un usuario con el id ${ id }`
                });
            }

        break;

        case 'productos':
            modelo = await Producto.findById( id )
            if(!modelo){
                return res.status(400).json({
                    msg: `no existe el producto con el id ${ id }`
                });
            }
        break;

        default:
            return res.status(500).json({msg:'Se me olvido validar esto'})
    }

    //limpiar imagenes previas
    if( modelo.img ){
        // Hay que borrar la imagen del servidor
        const pathImagen =  path.join(__dirname,'../uploads',coleccion,modelo.img);
        if( fs.existsSync( pathImagen ) ){
            fs.unlinkSync( pathImagen );
        }
    }

    const nombre = await subirArchivo( req.files,undefined,coleccion );
    modelo.img = nombre;

    await modelo.save();

    res.json(modelo)
}



const actualizarImagenCloudinary = async( req , res = response) => {

    const {id, coleccion} = req.params;

    let modelo;

    switch( coleccion ) {
        case 'usuarios':
            modelo = await Usuario.findById( id )
            if(!modelo){
                return res.status(400).json({
                    msg: `no existe un usuario con el id ${ id }`
                });
            }

        break;

        case 'productos':
            modelo = await Producto.findById( id )
            if(!modelo){
                return res.status(400).json({
                    msg: `no existe el producto con el id ${ id }`
                });
            }
        break;

        default:
            return res.status(500).json({msg:'Se me olvido validar esto'})
    }

    //limpiar imagenes previas
    if( modelo.img ){
        const nombreArr = modelo.img.split('/');
        const nombre = nombreArr[ nombreArr.length - 1];
        const [public_id] = nombre.split('.');
        await cloudinary.uploader.destroy( `castlevania/${public_id}` );
    }

    const { tempFilePath }  = req.files.archivo;
    const  {secure_url, public_id}  = await cloudinary.uploader.upload( tempFilePath,{ folder: 'castlevania'} );

    modelo.img = secure_url;

    await modelo.save();

    res.json( modelo )
}

const mostrarImagen = async(req, res= response) => {

    const { id, coleccion } = req.params;

    let modelo;

    switch( coleccion ) {
        case 'usuarios':
            modelo = await Usuario.findById( id )
            if(!modelo){
                return res.status(400).json({
                    msg: `no existe un usuario con el id ${ id }`
                });
            }

        break;

        case 'productos':
            modelo = await Producto.findById( id )
            if(!modelo){
                return res.status(400).json({
                    msg: `no existe el producto con el id ${ id }`
                });
            }
        break;

        default:
            return res.status(500).json({msg:'Se me olvido validar esto'})
    }

    //limpiar imagenes previas
    if( modelo.img ){
        // Hay que borrar la imagen del servidor
        const pathImagen =  path.join(__dirname,'../uploads',coleccion,modelo.img);
        if( fs.existsSync( pathImagen ) ){
            return res.sendFile( pathImagen )
        }
    }

    const pathImageNotFound =  path.join(__dirname,'../assets','no-image.jpg');
    res.sendFile( pathImageNotFound );

}


module.exports = {
    cargarArchivos,
    actualizarImagen,
    mostrarImagen,
    actualizarImagenCloudinary   
    
}