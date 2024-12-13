
const PointOfInterestModel = require('../../../models/pointOfInterest');
const ValidateReques = require('./pointOfInterestValidations.js');
const OrionHandler = require('../../../business/shared/orion/orionHadler.js');
const orionClient = OrionHandler();

async function UpdateNewPointOfInterest(id, body){

    try {
        const {Data} = await orionClient.Get(id);

        if(!Data){
            return {
                ok:false,
                message: "entity not foud"
            }
        }

        ValidateReques(body);
        const model  = PointOfInterestModel(body);
        UpdateModel(Data, model);
        const result = await orionClient.Update(id, model);
        console.log(result)
        return {
            ok: result.Status === 204 ? true : false,
            pointOfInterest:model
        }

    } catch (error) {
        console.log(error)
    }

    
}

//Piso todos los valores que me mandan, a excepcion de la fecha de creacion.
function UpdateModel(poi, model){
    model.dateCreated.value = poi.dateCreated.value;
    return model;
}
module.exports = UpdateNewPointOfInterest;