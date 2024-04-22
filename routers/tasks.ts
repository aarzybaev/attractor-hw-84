import express from "express";
import User from "../models/User";
import {Error} from "mongoose";
import Task from "../models/Task";
import auth, { RequestWithUser } from '../middleware/auth';


const tasksRouter = express.Router();

tasksRouter.post('/', auth, async (req, res, next) => {
    try {
        const task = new Task({
            user: req.body.user,
            title: req.body.title,
            description: req.body.description,
            status: req.body.status
        });

        await task.save();
        return res.send(task);
    } catch (error) {
        if (error instanceof Error.ValidationError) {
            return res.status(400).send(error);
        }
        return next(error);
    }
});

tasksRouter.get('/', auth, async (req, res, next) => {
    try {
        const user = (req as RequestWithUser).user;
        const tasks = await Task.find({user: user._id});
        return res.send(tasks);
    } catch (e) {
        next(e);
    }
});

tasksRouter.put('/:id', auth, async (req, res, next) => {
    try {
        const user = (req as RequestWithUser).user;
        const _id = req.params.id;
        const task = await Task.findById({_id});

        if (!task) {
            return res.status(400).send({error: 'Task is not found!'});
        }

        if (user._id.toString() !== task.user.toString()) {
            return res.status(403).send({error: 'This task belong other user!'});
        }

         task.overwrite({
            user: req.body.user,
            title: req.body.title,
            description: req.body.description,
            status: req.body.status
        });
        await task.save();
        return res.send(task);

    } catch (e) {
        next(e);
    }
});

tasksRouter.delete('/:id', auth,async (req, res, next) => {
    try {
        const user = (req as RequestWithUser).user;
        const _id = req.params.id;
        const task = await Task.findById({_id});

        if (!task) {
            return res.status(400).send({error: 'Task is not found!'});
        }

        if (user._id.toString() !== task.user.toString()) {
            return res.status(403).send({error: 'This task belong other user!'});
        }
        await Task.deleteOne({_id});
        return res.send({message: 'success'});
    } catch (e) {
        next(e);
    }
});
export default tasksRouter;