const { response, request } = require("express")

const esAdminRole = ( req = request, res = response, next) => {

    if( !req.usuario ){

        return res.status(200).json({
            msg:'se quiere verificar el role sin validar el token primero'
        });

    }
    const { role, nombre } = req.usuario;

    if(role !== 'ADMIN_ROLE'){
        return res.status(401).json({
            msg:`El:  ${ nombre} no es administrador - no puede hacer esto`
        });
    }


    next();
}

const tieneRole = ( ...roles ) => {

    return (req = request, res = response ,next) => {

        if( !req.usuario ){

            return res.status(200).json({
                msg:'se quiere verificar el role sin validar el token primero'
            });
    
        }

        if( !roles.includes( req.usuario.role )){
            return res.status(401).json({
                msg:`El serivicio requiere uno de estos roles ${ roles }`
            });
        }

        console.log(roles,req.usuario.role);
        next();
    }

}


module.exports ={
    esAdminRole,
    tieneRole
}