import config from "./config";
import mongoose from "mongoose";
import User from "./models/User";
import Task from "./models/Task";
import {randomUUID} from "node:crypto";
const run = async () => {
    await mongoose.connect(config.mongoose.db);
    const db = mongoose.connection;

    try {
        await db.dropCollection('users');
        await db.dropCollection('tasks');
    } catch (e) {
        console.log('Collections were not present, skipping drop...');
    }
    const user1 = await User.create({
        username: "user1",
        password: "1@345qWert",
        token: randomUUID()
    });
    const user2 = await User.create({
        username: "user2",
        password: "1@345qWert",
        token: randomUUID()
    });
    await Task.create({
        user: user1._id,
        title: 'Buy milk',
        description: 'Buy some milk',
        status: 'new'
    }, {
        user: user1._id,
        title: 'Do homework',
        description: 'Homework',
        status: 'complete'
    },
        {
        user: user2._id,
            title: 'Running',
            description: 'Sport activities',
            status: 'new'
    },{
        user: user2._id,
        title: 'Fix car',
        description: 'Car service',
        status: 'in_progress'
    });

    await db.close();
}

run().catch(console.error);