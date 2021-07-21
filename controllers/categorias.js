const { response } = require("express");
const { Categoria } = require('../models')


//obtenerCategorias - paginado - total - populate
const obtenerCategorias = async( req, res = response) => {

    try {
        const { limite = 5, desde = 0 } = req.query;
        const query =  { estado: true }; 

        const [total,categorias ] = await Promise.all([
            Categoria.countDocuments(query),
            Categoria.find( query )
                .populate('usuario', 'nombre')
                .skip(Number( desde))
                .limit(Number( limite ))
        ]);

        res.json({
            total,
            categorias
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            msg:'Contactarse con el administrador'
        })
    }
}


//obtenerCategoria - populate

const obtenerCategoria = async ( req, res = response ) => {

    
    try {
        const {id} = req.params;

        const categoria = await Categoria.findById( id ).populate('usuario', 'nombre');

        res.json(categoria);
        
    } catch (error) {
        console.log(error);
        res.status(500).json({
            msg:'Contactarse con el administrador'
        }) 
    }

}



const crearCategoria = async ( req, res = response ) => {

    try {
        
        const nombre = req.body.nombre.toUpperCase().trim();
    
        const categoriaBD = await Categoria.findOne( { nombre });
    
        //si existe categoria
        if( categoriaBD ){
            return res.status(400).json({
                mgs:`La categoria: ${ nombre } ya existe en la BD`
            })
        }
    
        //Generar la data a guardar 
        const data = {
            nombre,
            usuario: req.usuario._id
        }
    
        //instanciar el objeto categoria
        const categoria = new Categoria( data );
        //guardar categoria en BD
        categoria.save();
    
        res.status(201).json(categoria);

    } catch (error) {
        console.log(error)
        res.status(500).json({
            msg:"Contactar con el administrador"
        })
    }


}




// actualizarCategoria
const actualizarCategoria = async (req, res = response ) => {

    try {
        const { id } = req.params;
        const {estado, usuario, ...data}  = req.body;

        if( data.nombre ){
            data.nombre = data.nombre.toUpperCase().trim();
        }
        data.usuario = req.usuario._id;

        const categoria = await Categoria.findByIdAndUpdate( id,data,{new:true} ).populate('usuario');

        res.json( categoria );

        
    } catch (error) {
        console.log(error);
        res.status(500).json({
            msg:'Contactarse con el administrador'
        }) 
    }
}

//borrarCategoria - estado:

const borrarCategoria = async( res, resp = response ) => {

    try {

        const data = { estado : false };
        const { id } = req.params;
        const categoria = await Categoria.findByIdAndUpdate( id , data,{ new: true});

        res.json(categoria);

        
    } catch (error) {
        console.log(error);
        res.status(500).json({
            msg:'Contactarse con el administrador'
        }) 
    }
}

module.exports ={
    crearCategoria,
    obtenerCategorias,
    obtenerCategoria,
    actualizarCategoria,
    borrarCategoria
}