const { Router } = require('express');
const { check } = require('express-validator');
const { cargarArchivos, actualizarImagen, mostrarImagen, actualizarImagenCloudinary } = require('../controllers/uploads');
const { coleccionesPermitidas } = require('../helpers');

const { validarArchivoSubir,validarCampos } = require('../middlewares');



const router = Router();


router.post('/',validarArchivoSubir, cargarArchivos );

router.put('/:coleccion/:id',[
    validarArchivoSubir,
    check('id','EL id debe ser de mongo').isMongoId(),
    check('coleccion').custom( c => coleccionesPermitidas( c, ['usuarios','productos'])  ),
    validarCampos
],actualizarImagenCloudinary );

router.get('/:coleccion/:id',[
    check('id','EL id debe ser de mongo').isMongoId(),
    check('coleccion').custom( c => coleccionesPermitidas( c, ['usuarios','productos'])  ),
    validarCampos
],mostrarImagen)

module.exports = router;