import { NextFunction, Request, Response } from 'express';
import { HydratedDocument } from 'mongoose';
import { UserFields } from '../types';
import User from '../models/User';

export interface RequestWithUser extends Request {
    user: HydratedDocument<UserFields>;
}

const auth = async (expressReq: Request, res: Response, next: NextFunction) => {
    const req = expressReq as RequestWithUser;
    const tokenData = req.get('Authorization');

    if (!tokenData) {
        return res.status(401).send({error: 'No token present'});
    }

    const [_, token] = tokenData.split(' ');

    const user = await User.findOne({token});

    if (!user) {
        return res.status(401).send({error: 'Wrong token!'});
    }

    req.user = user;
    next();
};

export default auth;