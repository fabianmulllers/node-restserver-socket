
const { Router} = require('express');
const { check } = require('express-validator');

// const { validarCampos } = require('../middlewares/validar-campos');
// const { esAdminRole, tieneRole } = require('../middlewares/validar-roles');
// const { validarJWT } = require('../middlewares/validar-jwt');

const { validarCampos, esAdminRole, tieneRole, validarJWT } = require('../middlewares');

const { esRoleValido, emailExiste, existeUsuarioPorId } = require('../helpers/db-validators');
const { usuariosGet, usuariosPut, usuariosPost, usuariosDelete, usuariosPatch } = require('../controllers/user');


const router = Router();

router.get( '/', usuariosGet );

router.put('/:id',[
    check('id','No es un ID valido').isMongoId(),
    check('id').custom( existeUsuarioPorId ),
    check('role').optional().custom( esRoleValido ),
    validarCampos
], usuariosPut);

router.post('/',[
    check('nombre','El nombre es obligatorio').not().isEmpty(), 
    check('password','El password debe ser mas de 6 letras').isLength({ min: 6}), 
    check('correo','El correo no es valido').isEmail(), 
    check('correo').custom( emailExiste ),
    // check('role','No es un role valido').isIn(['ADMIN_ROLE','USER_ROLE']),
    check('role').custom( esRoleValido ),
    validarCampos
], usuariosPost);

router.delete('/:id',[
    validarJWT,
    esAdminRole,
    tieneRole('ADMIN_ROLE','USER_ROLE'),
    check('id','No es un ID valido').isMongoId(),
    check('id').custom( existeUsuarioPorId ),
    validarCampos
],usuariosDelete);

router.patch('/', usuariosPatch);



module.exports = router;