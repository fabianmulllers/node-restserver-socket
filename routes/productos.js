const { Router } = require('express');
const { check } = require('express-validator');

const { validarCampos } = require('../middlewares/validar-campos');
const { validarJWT } = require('../middlewares/validar-jwt');

const { esAdminRole } = require('../middlewares');
const { crearProducto, obtenerProducto, obtenerProductos, actualizarProducto, borrarProducto } = require('../controllers/productos');
const { existeProductoPorId, existeNombreProducto, existeCategoriaPorId } = require('../helpers/db-validators');


const router = Router();

//Obtener todas los productos
router.get('/',obtenerProductos);

// //Obtener un producto por id - publico
router.get('/:id' ,[
    check('id','No es un id de mongo valido').isMongoId(),
    check('id','Debes ingresar el id').notEmpty(),
    check('id').custom( existeProductoPorId ),
    validarCampos
],obtenerProducto );

//crear un producto
router.post('/',[
    validarJWT,
    esAdminRole,
    check('nombre','El nombre es requerido').notEmpty(),
    check('nombre').custom( existeNombreProducto ),
    check('categoria','Debes ingresar una categoria').notEmpty(),
    check('categoria','La categoria debe tener un formato valido').isMongoId(),
    check('categoria').custom(existeCategoriaPorId),
    validarCampos

], crearProducto);

// //Actualizar - privado cualquier token valido
router.put('/:id',[
    validarJWT,
    esAdminRole,
    check('id','El id no corresponde').isMongoId(),
    check('id','Debes ingresar el id').notEmpty(),
    check('id').custom( existeProductoPorId ),
    check('categoria','La categoria debe tener un formato valido').isMongoId().optional(),
    check('categoria').custom(existeCategoriaPorId).optional(),
    validarCampos
],actualizarProducto);

// //Borrar un producto - Admin
router.delete('/:id',[
    validarJWT,
    esAdminRole,
    check('id','El id no corresponde').isMongoId(),
    check('id','Debes ingresar el id').notEmpty(),
    check('id').custom( existeProductoPorId ),
    validarCampos
],borrarProducto);




module.exports = router;