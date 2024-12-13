const UserPreferences = require('../../../models/UserPreferences.js');
const UserPreferencesValidations = require('./userPreferencesValidations.js');

async function UpdateUserPreferences(userId, updatedPreferences){

    try {
        const userPrefExists = await UserPreferences.findOne({ user_id: userId });
        if(!userPrefExists){
            return {
                ok: false,
                err:{
                    message: "user preferences for that user not found"
                }
            }
        }

        UserPreferencesValidations(updatedPreferences)
        const res = await UserPreferences.findOneAndUpdate({ user_id: userId, }, updatedPreferences);

        return {
            ok: true,
            res
        }

    } catch (error) {

        console.log(error)
        return {
            ok: false,
            err: {
                type: error.type,
                message: error.msg
            }
        }
    }

}


module.exports = UpdateUserPreferences