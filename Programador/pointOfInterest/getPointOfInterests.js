
const OrionHandler = require('../../shared/orion/orionHadler.js');
const orionClient = OrionHandler();

async function GetPointsOfInterests(from, limit){
    from > 0 ? from-- : from;
    try {
        const {Data} = await orionClient.GetAll();
        let result = [];

        if(from.length >= Data.length){
            return {
                ok: true,
                total: Data.length,
                pointOfInterests:[]
            }
        }

        let index = from;
        while(Data[index] && limit > 0){
            result.push(Data[index]);
            index++;
            limit--;
        }

        console.log(result)
        return {
            ok: true,
            total: Data.length,
            pointOfInterests:result
        }

    } catch (error) {
        console.log(error)
    }

}

module.exports = GetPointsOfInterests;