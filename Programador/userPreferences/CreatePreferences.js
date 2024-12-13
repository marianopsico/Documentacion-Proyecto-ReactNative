const UserPreferences = require('../../../models/UserPreferences.js');
const User = require('../../../models/user.js');

async function CreateUserPreferences(preferences){

    try {

        const userExists = await User.findOne({ keyrockId: preferences.user_id });

        if(!userExists){
            return {
                ok: false,
                err:{
                    message: "user not found"
                }
            }
        }

        const userPrefExists = await UserPreferences.findOne({ user_id: preferences.user_id });
        if(userPrefExists){
            return {
                ok: false,
                err:{
                    message: "user preferences for that user already exists"
                }
            }
        }
        const res = await UserPreferences.create(preferences);
        return {
            ok: true,
            res
        }

    } catch (error) {

        return {
            ok: false,
            err: {
                message: error.message
            }
        }
    }

}

module.exports = CreateUserPreferences