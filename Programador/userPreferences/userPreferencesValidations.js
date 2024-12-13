const NewError = require('../../shared/error.js');
const { 
    procedenceValues, 
    GroupCompositionValues,
     TourismTypeValues, 
     TimeOfStay, 
     TransportType,
      PreferredActivity 
    } = require('../../shared/userPreferencesValues.js');

    
function UserPreferencesValidations(request){

    if(!request){
        throw  NewError('ERR_REQUEST','payload is invalid' );
    } 

    if(!procedenceValues.values.includes(request.procedence)){
        throw  NewError('ERR_PROCEDENCE','Procedence is invalid' );
    }

    if(!GroupCompositionValues.values.includes(request.group_composition)){
        throw  NewError('ERR_GROUP_COMPOSITION','group composition is invalid' );
    }

    if(!TourismTypeValues.values.includes(request.tourism_type)){
        throw  NewError('ERR_TOURISM_TYPE','tourism_type is invalid' );
    }

    if(!TimeOfStay.values.includes(request.stay_time)){
        throw  NewError('ERR_TIMESTAY','stay time is invalid' );
    }

    if(!TransportType.values.includes(request.transportation_type)){
        throw  NewError('ERR_TRANSPORT','transportation type is invalid' );
    }

    if(!PreferredActivity.values.includes(request.preferred_activity)){
        throw  NewError('ERR_ACTIVITY','preferred activity type is invalid' );
    }

}

module.exports = UserPreferencesValidations;