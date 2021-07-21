const { Router } = require('express');
const { check } = require('express-validator');


const { login, googleSignin, renovarToken } = require('../controllers/auth');
const { validarCampos } = require('../middlewares/validar-campos');
const { validarJWT } = require('../middlewares/');


const router = Router();

router.get('/',validarJWT, renovarToken );

router.post('/login',[
    check('correo','el correo es obligatorio').isEmail(),
    check('password','el password es obligatorio').notEmpty(),
    validarCampos
],login);


router.post('/google',[
    // check('id_token','El id token es obligatorio').notEmpty(),
    // validarCampos
],googleSignin);

module.exports = router;