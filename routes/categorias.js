const { Router } = require('express');
const { check } = require('express-validator');

const { validarCampos } = require('../middlewares/validar-campos');
const { validarJWT } = require('../middlewares/validar-jwt');

const { crearCategoria, obtenerCategorias, obtenerCategoria, actualizarCategoria, borrarCategoria } = require('../controllers/categorias');

const { existeCategoriaPorId, existNombreCategoria } = require('../helpers/db-validators');
const { esAdminRole } = require('../middlewares');


const router = Router();

//Obtener todas las categorias
router.get('/', obtenerCategorias);

//Obtener una categoria por id - publico
router.get('/:id' ,[
    check('id','No es un id de mongo valido').isMongoId(),
    check('id','Debes ingresar el id').notEmpty(),
    check('id').custom( existeCategoriaPorId ),
    validarCampos
],obtenerCategoria );

//Crear categoria - privado - cualquier persona con un token valido
router.post('/',[
    validarJWT,
    check('nombre','EL nombre es obligatorio').notEmpty(),
    validarCampos
],crearCategoria);

//Actualizar - privado cualquier token valido
router.put('/:id',[
    validarJWT,
    check('nombre','Debes ingresar el nombre').notEmpty(),
    check('id','El id no corresponde').isMongoId(),
    check('id','Debes ingresar el id').notEmpty(),
    check('id').custom( existeCategoriaPorId ),
    check('nombre').custom( existNombreCategoria ),
    validarCampos
],actualizarCategoria);

//Borrar una categoria - Admin
router.delete('/:id',[
    validarJWT,
    esAdminRole,
    check('id','El id no corresponde').isMongoId(),
    check('id','Debes ingresar el id').notEmpty(),
    check('id').custom( existeCategoriaPorId ),
    validarCampos
],borrarCategoria);




module.exports = router;