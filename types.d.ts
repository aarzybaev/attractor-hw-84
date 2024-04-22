import mongoose, {Model} from "mongoose";

export interface UserFields {
    username: string;
    password: string;
    token: string;
}
enum Status {
    s1 = 'new',
    s2 = 'in_progress',
    s3 = 'complete'
}


export interface TaskFields {
    user: mongoose.Types.ObjectId
    title: string;
    description: string;
    status: Status;
}



export interface UserMethods {
    checkPassword(password: string): Promise<boolean>;
    generateToken(): void;
}

export type UserModel = Model<UserFields, {}, UserMethods>;

