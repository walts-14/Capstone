import User from '../models/user.js';
import jwt from 'jsonwebtoken';
import { hashedPassword, comparePassword } from '../middlewares/auth.js';

/**
 * Creates a new user (account) in the database.
 * This is used by Admins (Teachers) to create Student accounts,
 * and by Super Admins (Subject Coordinators) to create Admin or Student accounts.
 * 
 * It expects the request to be authenticated so that req.user exists.
 * 
 * Required fields: age, year, name, email, password, confirmPassword.
 * For Super Admin, an optional `role` field can be provided (must be either 'user' or 'admin').
 */
export const createUser = async (req, res) => {
  const {name, username, email, password, confirmPassword, role } = req.body;

  // Validate required fields
  if (!name || !username || !email || !password || !confirmPassword) {
    return res.status(400).json({ 
      success: false,
      message: 'All fields are required'
    });
  }

  // Check if user already exists (by email)
  try {
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ 
        success: false,
        message: 'User already exists'
      });
    }

    // Validate password match
    if (password !== confirmPassword) {
      return res.status(400).json({ 
        success: false,
        message: 'Passwords do not match'
      });
    }

    // Validate password length
    if (password.length < 8) {
      return res.status(400).json({ 
        success: false,
        message: 'Password should be at least 8 characters long'
      });
    }

    // Determine the new user's role based on the caller's role
    let newUserRole = 'user'; // default for new accounts
    if (req.user.role === 'admin') {
      // Admin (Teacher) can only create Student accounts
      newUserRole = 'user';
    } else if (req.user.role === 'super_admin') {
      // Super Admin (Subject Coordinator) can create Admin or Student accounts.
      // If no role is provided, default to 'user'
      if (role) {
        if (role !== 'user' && role !== 'admin') {
          return res.status(400).json({ 
            success: false,
            message: 'Invalid role specified. Allowed roles: user, admin'
          });
        }
        newUserRole = role || 'admin'; // Default to 'admin' if no role is provided

      }
    } else {
      // If an unauthorized role somehow reaches here, return an error.
      return res.status(403).json({
        success: false,
        message: 'Unauthorized to create accounts'
      });
    }

    // Hash the password before saving (using your hashedPassword utility)
    const hashed = await hashedPassword(password);

    // Create and save new user
    const newUser = new User({
      name,
      username,
      email,
      password: hashed,
      role: newUserRole
    });

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

/**
 * Logs in an existing user.
 * This function verifies the user's credentials and returns a JWT token if successful.
 */
export const loginUser = async (req, res) => {
  const { email, password } = req.body;
  console.log("🔐 Login attempt for:", email);

  try {
    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      console.log("❌ No user found with this email");
      return res.status(400).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

        // 🔍 Debugging logs for password check
        console.log("Entered password:", password);
        console.log("Stored (hashed) password:", user.password);

    const match = await comparePassword(password, user.password);
    console.log("Password comparison result:", match);
    if (!match) {
      console.log("❌ Password does not match");
      console.log("Password comparison details:", {
        inputLength: password.length,
        storedLength: user.password.length,
        inputType: typeof password,
        storedType: typeof user.password
      });
      return res.status(400).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    console.log("✅ Login successful for:", email);

    res.status(200).json({
      status: "ok",
      success: true,
      message: "Login Successful",
      data: token,
      user: { name: user.name, email: user.email, role: user.role }
    });
  } catch (err) {
    console.error("🔥 Server error during login:", err.message);
    res.status(500).json({ error: "Server error: " + err.message });
  }
};

