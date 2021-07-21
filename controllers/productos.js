const { response } = require("express");
const { Producto } = require('../models')


//obtenerProducto
const obtenerProductos = async( req, res = response) => {

    try {
        const { limite = 5, desde = 0 } = req.query;
        const query =  { estado: true }; 

        const [total,productos ] = await Promise.all([
            Producto.countDocuments(query),
            Producto.find( query )
                .populate('usuario', 'nombre')
                .populate('categoria','nombre')
                .skip(Number( desde))
                .limit(Number( limite ))
        ]);

        res.json({
            total,
            productos
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            msg:'Contactarse con el administrador'
        })
    }
}


// //obtenerCategoria - populate

const obtenerProducto = async ( req, res = response ) => {

    
    try {
        const {id} = req.params;

        const producto = await Producto.findById( id )
        .populate('usuario', 'nombre')
        .populate('categoria','nombre');

        res.json(producto);
        
    } catch (error) {
        console.log(error);
        res.status(500).json({
            msg:'Contactarse con el administrador'
        }) 
    }

}


//crear productos
const crearProducto = async ( req, res = response ) => {

    try {   

        const {estado, usuario, ...data }  = req.body
        
        data.nombre = data.nombre.trim().toUpperCase();
        data.usuario = req.usuario._id

    
        //instanciar el objeto producto
        const producto = new Producto( data );
        //guardar producto en BD
        await producto.save();
    
        res.status(201).json(producto);

    } catch (error) {
        console.log(error)
        res.status(500).json({
            msg:"Contactar con el administrador"
        })
    }


}




// // actualizarProducto
const actualizarProducto = async (req, res = response ) => {

    try {
        const { id } = req.params;
        const {estado, usuario, ...data}  = req.body;

        if( data.nombre ){
            data.nombre = data.nombre.toUpperCase().trim();
        }
        data.usuario = req.usuario._id;

        const producto = await Producto.findByIdAndUpdate( id,data,{new:true} )
            .populate('usuario','nombre')
            .populate('categoria','nombre');

        res.json( producto );

        
    } catch (error) {
        console.log(error);
        res.status(500).json({
            msg:'Contactarse con el administrador'
        }) 
    }
}

// //borrarProducto - estado:

const borrarProducto = async( req, res = response ) => {

    try {

        const data = { estado : false };
        const { id } = req.params;
        const producto = await Producto.findByIdAndUpdate( id , data,{ new: true});

        res.json(producto);

        
    } catch (error) {
        console.log(error);
        res.status(500).json({
            msg:'Contactarse con el administrador'
        }) 
    }
}

module.exports ={
    obtenerProductos,
    crearProducto,
    obtenerProducto,
    actualizarProducto,
    borrarProducto
}