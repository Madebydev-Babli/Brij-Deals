import jwt from 'jsonwebtoken';
import { UserModel } from '../models/user';

export async function verifyToken(req) {

    try {

        const token = req.headers.get('Authorization')?.split(' ')[1];

        if (!token) throw new Error('Please login');

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const user = await UserModel.findById(decoded._id);

        if (!user || !user.isLoggedIn) throw new Error('Please login');

        return user;

    } catch (error) {
        throw new Error(error.message);
    }
};


