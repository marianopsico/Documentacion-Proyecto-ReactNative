const NewError = require("../../shared/error");
const GetCategory = require('../category/GetCategory');

function ValidateReques(body){
    
    if(!body){
        throw  NewError('ERR_REQUEST','payload is invalid' );
    } 

    if(!GetCategory().CategoryValues.includes(body.category)){
        throw  NewError('ERR_CATEGORY','Category is invalid' );
    }

    if(!body.location && !body.adress){
        throw  NewError('ERR_LOCATION_ADRESS_INVALID','must send location or adress' );
    }

    if(body.location && body.location.length > 2){
        throw  NewError('ERR_LOCATION','must send latitude and longitude values only');
    }

    if(!body.name){
        throw  NewError('ERR_NAME','must send a name' );
    }

    // if(body.contactPoint){
    //     if(!body.contactPoint.email || !IsValidEmail(body.contactPoint.email)){
    //         throw  NewError('ERR_CONTACTPOINT_EMAIL','must send a valid email' );
    //     } 
        
    //     if(!body.contactPoint.telephone){
    //         throw  NewError('ERR_CONTACTPOINT_EMAIL','must send a telephone' );
    //     }
    // }
}


function IsValidEmail(email){
    if(email.includes('@') && email.includes('.') && email.length > 3){
        return true;
    }

    return false;
}

module.exports = ValidateReques;