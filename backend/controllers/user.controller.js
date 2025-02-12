import mongoose from 'mongoose';
import User from '../models/user.js';

export const createUser = async (req, res) => {
    const user = req.body; //get the user details from the request body 
    
    //check if all fields are filled
    if (!age || !year || !name || !email || !password || !confirmPassword) {
        return res.status(400).json({ error: 'All fields are required' });
    }

     // Check if user already exists
     const userExists = await User.findOne({ email }); // ✅ Fixed variable name
     if (userExists) {
         return res.status(400).json({ message: 'User already exists' });
     }

     // Check if password and confirmPassword match
     if (password !== confirmPassword) {
         return res.status(400).json({ message: 'Passwords do not match' });
     }

     // Check if password is at least 8 characters long
     if (password.length < 8) {
         return res.status(400).json({ message: 'Password should be at least 8 characters long' });
     }

     const newUser = new User(user);

        try {
            await newUser.save();
            res.status(201).json({ message: 'User created successfully' });
        } catch (error) {
            console.log("Error in creating user", error);
            res.status(409).json({ message: error.message });
        }
}