import express from 'express';
import {createUser, getUserByEmail, getUserByUsername} from "../repositories/user-repository.js";
import {authentication} from "../helpers/index.js";

export const login = async (req: express.Request, res: express.Response) => {
    try {
        const {email, password} = req.body;
        if(!email || !password){
            return res.sendStatus(400);
        }

        const user = await getUserByEmail(email).select('+authentication.password +authentication.salt');
        if(!user){
            console.log('User does not exist');
            return res.sendStatus(400);
        }

        const expectedHash = authentication(user.authentication.salt, password);
        if(expectedHash !== user.authentication.password){
            console.log('Invalid password');
            return res.sendStatus(403);
        }

        const salt = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
        user.authentication.sessionToken = authentication(salt, user._id.toString());
        user.save();

        res.cookie('sessionToken', user.authentication.sessionToken, {domain: 'localhost', path: '/', maxAge: 1000 * 60 * 60 * 24 * 365, httpOnly: true});
        return res.status(200).json({
            id: user._id,
            email: user.email,
            username: user.username,
            token: user.authentication.sessionToken
        }).end();

    } catch (e) {
        console.log(e);
        return res.sendStatus(400);
    }
}

export const register = async (req: express.Request, res: express.Response) => {
    try{
        const {email, password, username} = req.body;
        if (!email || !password || !username) {
            return res.sendStatus(400);
        }

        const existingUser = await getUserByEmail(email);
        const existingUsername = await getUserByUsername(username);

        if (existingUser || existingUsername) {
            console.log('User already exist');
            return res.sendStatus(400); // Conflict - User already exists
        }

        const salt = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
        const user = await createUser({
            email,
            username,
            authentication: {
                salt,
                password: authentication(salt, password),
            },
        });
        return res.status(200).json(user).end();

    }catch(e){
        console.log(e);
        return res.sendStatus(400);
    }
}