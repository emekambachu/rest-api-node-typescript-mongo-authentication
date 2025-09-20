import express from 'express';
import {deleteUserById, getUserById, getUsers, updateUserById} from '../repositories/user-repository.js';

export const getAllUsers = async (req: express.Request, res: express.Response) => {
    try {
        const user = await getUsers();
        return res.status(200).json({
            success: true,
            users: user,
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({error: error.message});
    }
}

export const deleteUser = async (req: express.Request, res: express.Response) => {
    try {

        const userId = req.params.id;
        if(!userId){
            return res.status(400).json({error: 'User ID is required'});
        }

        const deletedUser = await deleteUserById(userId);
        if(!deletedUser){
            return res.status(404).json({error: 'User not found'});
        }

        return res.status(200).json({
            success: true,
            user: 'User deleted successfully',
        });

    }catch(error) {
        console.log(error);
        return res.status(500).json({error: error.message});
    }
}

export const updateUser = async (req: express.Request, res: express.Response) => {
    try {
        const {id} = req.params;
        const {username} = req.body

        if(!id){
            return res.status(400).json({error: 'User ID is required'});
        }

        const user = await getUserById(id);
        if(!user){
            return res.status(404).json({error: 'User not found'});
        }

        if(!username){
            return res.status(400).json({error: 'Username is required'});
        }

        user.username = username;
        await user.save();

        return res.status(200).json({
            success: true,
            user: 'User updated successfully',
        }).end();

    }catch(error) {
        console.log(error);
        return res.status(500).json({error: error.message});
    }
}