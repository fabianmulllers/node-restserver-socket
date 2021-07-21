const validarCampos = require('../middlewares/validar-campos');
const ValidaRoles  = require('../middlewares/validar-roles');
const validarJWT = require('../middlewares/validar-jwt');
const validarArchivo = require('../middlewares/validar-archivo')



module.exports= {
    ...validarCampos,
    ...ValidaRoles,
    ...validarJWT,
    ...validarArchivo,
}