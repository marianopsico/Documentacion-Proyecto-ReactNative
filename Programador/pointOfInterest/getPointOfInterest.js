
const OrionHandler = require('../../shared/orion/orionHadler.js');
const orionClient = OrionHandler();

async function GetPointsOfInterest(id){

    try {
        const {Data} = await orionClient.Get(id);

        return {
            ok: true,
            pointOfInterest:Data
        }

    } catch (error) {
        console.log(error)
    }

}

module.exports = GetPointsOfInterest;