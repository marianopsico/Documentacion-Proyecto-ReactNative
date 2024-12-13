
const OrionHandler = require('../../shared/orion/orionHadler.js');
const orionClient = OrionHandler();

async function DeletePointsOfInterest(id){

    try {
        const result =  await orionClient.Delete(id);
        console.log(result.Status)
        return {
            ok: result.Status == 204 ? true : false,
            message: result.Message
        }

    } catch (error) {
        console.log(error)
    }

}

module.exports = DeletePointsOfInterest;