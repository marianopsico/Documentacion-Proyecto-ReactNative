const PointOfInterestModel = require('../../../models/pointOfInterest');
const ValidateReques = require('./pointOfInterestValidations.js');
const uuidv4 = require('../../shared/uuidv4.js')
const OrionHandler = require('../../../business/shared/orion/orionHadler.js');
const orionClient = OrionHandler();

async function CreateNewPointOfInterest(body){

    try {
        ValidateReques(body);
        const model  = PointOfInterestModel(body);
        model.id = uuidv4();
        model.type = "PointOfInterest";
        const result = await orionClient.Create(model);
        return {
            ok: result.Status === 201 ? true : false,
            pointOfInterest:model
        }

    } catch (error) {
        console.log(error)
    }

    
}

module.exports = CreateNewPointOfInterest;