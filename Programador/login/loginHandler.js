const User = require('../../../models/user.js');
const loggedUser = require('../../../models/loggedUser.js');

const ValidateRequest = require('../user/newUserRequestValidations.js');

const FiwareConfig = require('../../../config/fiwareConfig.js');
const fiware = FiwareConfig()

const CreateHttpService = require('../../shared/httpService.js');
const CreateFiwareUser = require('../user/createFiwareUser.js');
const CreateUser = require('../user/createUser.js');
const httpService = CreateHttpService(fiware.paths.base);


function LoginHandler(){
    return {
        FindUser: async (email) => {
            
            let user = await FindUserByEmail(email);
            return {userId: user.keyrockId};
        },
        Login: async (email, password) => {
           
            let userExists = await FindUserByEmail(email)
            if(!userExists){
                return {
                    ok: false,
                    err: 'Invalid username or password'
                }
            }

            let response = await FiwareSignIn(email, password);
            if(response.Status != 201){
                return {
                    ok: false,
                    err: 'Invalid username or password'
                }
            }

            const token = response.Headers['x-subject-token'];
            let userId = userExists.keyrockId
            let role = userExists.role
            let username = userExists.username
            let phone = userExists.phone
            await DeleteUserLogged(email);
            await SaveUserLogged(userId, token);

            return {
                ok: true,
                token,
                username,
                email,
                userId,
                role,
                phone,
            }

        },
        Register: async (body, role) => {

            const validateRequest = ValidateRequest(body)
            if(!validateRequest.ok){
                return {
                    ok: false,
                    err: {
                        message: validateRequest.message
                    }};
            }

            let userExists = await FindUserByEmail(body.email)
            if(userExists){
                return {
                    ok: false,
                    err: {
                        message: 'User already exists'
                    }
                }
            }

            let token = await GetToken();
            let fiwareUser = await CreateFiwareUser(body, token, httpService);

            if(!fiwareUser.ok){
                return fiwareUser;
            }

            const email = fiwareUser.user.email;
            const keyrockId = fiwareUser.user.id;
            const username = fiwareUser.user.username
            const phone = body.phone
            const response = await CreateUser(username,email,keyrockId,phone,role)
            return {
                    ok: true,
                    message: 'User created successfully',
                    id: response.keyrockId
                }

        },
        ValidateToken: async(token) => {
            let localUser = await FindUserLoggedByToken(token);
            if(!localUser){
                return false;
            }
            let result = await TokenVerify(token)
            return result.Status == 200 && result.Data.valid 
        },
        GetUserRole: async (token) => {
            
            let userLogged = await FindUserLoggedByToken(token);
            if(!userLogged){
                return undefined;
            }

            return  (await FindUserByUserId(userLogged.userId)).role;
        },
    }
}

async function FindUserLoggedByToken(token){
    
    let userMongo =  await  loggedUser.findOne({ token: token }, (err, usuarioDB) => {

        if (err) {
            throw new Error('database error:' + err.message)
        }

        if(!usuarioDB){
            return undefined;
        }
       return usuarioDB
    });

    return userMongo
}

async function FindUserByEmail(email){

    let userMongo =  await  User.findOne({ email: email }, (err, usuarioDB) => {

        if (err) {
            throw new Error('database error:' + err.message)
        }

        if(!usuarioDB){
            return undefined;
        }
       return usuarioDB
    });

    return userMongo
}

async function FindUserByUserId(userId){
    let userMongo =  await  User.findOne({ keyrockId: userId }, (err, usuarioDB) => {

        if (err) {
            throw new Error('database error:' + err.message)
        }

        if(!usuarioDB){
            return undefined;
        }
       return usuarioDB
    });

    return userMongo
}

async function DeleteUserLogged(email){
    let currentUser = await FindUserByEmail(email);

    if(currentUser){
        let userlogged =  await FindUserLoggedByUserId(currentUser.keyrockId);

        if(userlogged){
            let id = userlogged._id;
            try {
                await loggedUser.findByIdAndRemove(id);
            } catch (err) {
                console.log(err);
            }
        }
    }

}

async function SaveUserLogged(userId, token){

    let userLogged = new loggedUser( {userId:userId, token} );
    await userLogged.save((err) => {
        if (err) {
            throw new Error(err.message)
        }
    });

}

async function FindUserLoggedByUserId(userId){

    let user =  await  loggedUser.findOne({ userId: userId }, (err, usuarioDB) => {

        if (err) {
            return undefined;
        }

        if(!usuarioDB){
            return undefined;
        }
       return usuarioDB
    });

    return user;
}

async function FiwareSignIn(email, password){

    return await httpService.Post(fiware.paths.login, {name:email, password:password})
}

async function GetToken(){

    let response = await httpService.Post(fiware.paths.login, {name:fiware.admUser.name, password:fiware.admUser.password})
    return response.Headers['x-subject-token'];
}

async function TokenVerify(token){
    let config = {
        headers: {
          'X-Auth-token': token,
          'X-Subject-token': token
        }
      }

      return await httpService.Get(fiware.paths.login, config);
}
module.exports = LoginHandler;