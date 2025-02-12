import mongoose from "mongoose";

export const connectDB = async () => {
    try {
            //database connection
            const conn = await mongoose.connect(process.env.MONGO_URI).then(() => {
    console.log("Database connected")}).catch((err) => console.log("Database connection failed", err));
    
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
}