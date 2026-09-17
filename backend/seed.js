import bcrypt from 'bcrypt';
import User from './models/User.js';
import connectToDB from './db/connection.js';
import dotenv from "dotenv";
dotenv.config();

const register = async () => {
    try {
        connectToDB();
        const hashPassword = await bcrypt.hash("admin", 10);
        const newUser = new User({
            name: "admin",
            email: "admin@gmail.com",
            password: hashPassword,
            address: "admin-address",
            role: "admin"
        })

        await newUser.save();
        console.log("Admin user created successfully")
    } catch (error) {
        console.log(error);
    }
}
register();