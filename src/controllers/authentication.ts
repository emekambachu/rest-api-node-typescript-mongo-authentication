import express from 'express';
import {createUser, getUserByEmail} from "../repositories/user-repository.js";
import {authentication} from "../helpers/index.js";

export const register = async (req: express.Request, res: express.Response) => {
    try{
        const {email, password, username} = req.body;
        if (!email || !password || !username) {
            return res.sendStatus(400);
        }

        const existingUser = await getUserByEmail(email);
        if (existingUser) {
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