import User from '../models/user.js';
import jwt from 'jsonwebtoken';
import { hashedPassword, comparePassword } from '../middlewares/auth.js';

/**
 * Creates a new user in the database
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */

export const createUser = async (req, res) => {
    const user = req.body;

    // Validate required fields
    if (!user.age || !user.year || !user.name || 
        !user.email || !user.password || !user.confirmPassword) {
        return res.status(400).json({ 
            success: false,
            message: 'All fields are required' 
        });
    }

    // Check if user already exists
    try {
        const userExists = await User.findOne({ email: user.email });
        if (userExists) {
            return res.status(400).json({ 
                success: false,
                message: 'User already exists' 
            });
        }

        // Validate password match
        if (user.password !== user.confirmPassword) {
            return res.status(400).json({ 
                success: false,
                message: 'Passwords do not match' 
            });
        }

        // Validate password length
        if (user.password.length < 8) {
            return res.status(400).json({ 
                success: false,
                message: 'Password should be at least 8 characters long' 
            });
        }

        // Create and save new user
        const newUser = new User(user);
        await newUser.save();
        
        res.status(201).json({ 
            success: true,
            message: 'User created successfully',
            data: newUser
        });
    } catch (error) {
        console.error("Error in creating user:", error);
        res.status(500).json({ 
            success: false,
            message: error.message 
        });
    }
};

export const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({
                success: false,
                message: 'Invalid email or password'
            });
        }

        // Compare passwords
        const match = await comparePassword(password, user.password);
        if (!match) {
            return res.status(400).json({
                success: false,
                message: 'Invalid email or password'
            });
        }

        // ✅ Generate JWT Token
        const token = jwt.sign(
            { id: user._id, email: user.email }, 
            process.env.JWT_SECRET, 
            { expiresIn: "1h" } // Token expires in 1 hour
        );

        // ✅ Return real JWT token
        res.status(200).json({
            status: "ok",
            success: true,
            message: "Login Successful",
            data: token  // Send real token instead of "fake-jwt-token"
        });

    } catch (err) {
        res.status(500).json({ error: "Server error: " + err.message });
    }
};

