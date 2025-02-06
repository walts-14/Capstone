import User from '../models/user.js';

const test = (req, res) => {
    res.send('Hello from the test server!');
}

const signupUser = async (req, res) => {
    try {
        // Destructure the data received from the client
        const { age, year, name, username, email, password } = req.body;
    console.log(age, year, name, username, email, password);
    // Check if all fields are filled
    if(!age || !year || !name || !username || !email || !password) {
        return res.status(400).json({ message: 'All fields are required' })}
    // Check if user already exists
    const userExists = await User.findOne({ email });
    if(userExists) {
        return res.status(400).json({ message: 'User already exists' })}
        // Check if password and confirmPassword match
        if(password !== confirmPassword) {
            return res.status(400).json({ message: 'Passwords do not match' })}
            // Check if password is at least 8 characters
            if(password.length < 8) {
                return res.status(400).json({ message: 'Password should be at least 8 characters long' })}

                // Create a new user
                const user = await User.create({ age, year, name, username, email, password });
               return res.status(201).json({ message: 'User created successfully', user });


    } catch (error) {
        
    }
}

export { test, signupUser };