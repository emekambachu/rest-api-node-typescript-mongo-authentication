import express from 'express';
import pkg from 'lodash';
const { get, merge } = pkg;
import {getUserBySessionToken} from "../repositories/user-repository.js";

export const isAuthenticated = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try{
        const sessionToken = req.cookies['sessionToken'];
        if(!sessionToken){
            return res.status(403).json({error: 'Unauthorized'});
        }

        const existingUser = await getUserBySessionToken(sessionToken).select('+authentication.sessionToken');
        if(!existingUser){
            return res.status(403).json({error: 'Unauthorized'});
        }

        merge(req, { identity: existingUser });
        return next();

    }catch(err){
        console.log(err);
        return res.status(400).json({error: 'Unauthorized'});
    }
}

export const isOwner = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try{
        const { id } = req.params;
        const currentUserId = get(req, 'identity._id') as string;
        if(!currentUserId){
            return res.status(403).json({error: 'Unauthorized'});
        }

        if(currentUserId.toString() !== id){
            return res.status(403).json({error: 'Unauthorized'});
        }

        return next();

    }catch(err){
        console.log(err);
        return res.status(400).json({error: 'Unauthorized'});
    }
}