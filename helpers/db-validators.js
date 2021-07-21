
const { Categoria,Role,Usuario, Producto } = require('../models');



const esRoleValido = async(role = '') => {
    const existRole = await Role.findOne({ role });
    if( !existRole ){
        throw new Error(`El rol ${ role } no esta registrado en la BD`);
    }
}



const emailExiste = async( correo = '') => {
    const existeEmail = await Usuario.findOne( { correo } );
    if( existeEmail ){
        throw new Error(`El email: ${ correo } ya existe en la BD`); 
    }
}

const existeUsuarioPorId = async(id = '') => {

    const existeUsuario = await Usuario.findById(id);
    if( !existeUsuario ){
        throw new Error(`El id no existe ${ id }`)
    }
}

const existeCategoriaPorId = async(id ='') => {

    const categoria = await Categoria.findById(id);
    if( !categoria ){
        throw new Error(`La categoria con el id: ${ id } no existe `);
    }

}

const existNombreCategoria = async(name ='') => {
    const  nombre = name.toUpperCase().trim();
    const categoria = await Categoria.findOne({ nombre })
    if( categoria ){
        throw new Error(`Ya existe una categoria con el nombre: ${ nombre }` )
    }
}

const existeNombreProducto = async( nombre ='' ) =>{
    nombre = nombre.toUpperCase().trim()
    const producto = await Producto.findOne({ nombre });
    if( producto ){
        throw new Error(`El producto : ${ nombre } ya existe`);
    }
}


const existeProductoPorId = async( id = '') => {

    const producto = await Producto.findById(id);
    if( !producto ){
        throw new Error(`El  producto con el id: ${ id } no existe `);
    }
}

const coleccionesPermitidas = async( coleccion = '',colecciones = []) => {

    if( !colecciones.includes( coleccion ) ){
        throw new Error(`La coleccion ${ coleccion } no es permitida, ${ colecciones } `);

    }

    return true;
}

module.exports ={
    esRoleValido,
    emailExiste,
    existeUsuarioPorId,
    existeCategoriaPorId,
    existNombreCategoria,
    existeNombreProducto,
    existeProductoPorId,
    coleccionesPermitidas
}