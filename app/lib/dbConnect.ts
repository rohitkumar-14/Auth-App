// app/lib/dbConnect.ts
import mongoose from 'mongoose';

const dbConnect = async () => {
    if (mongoose.connection.readyState >= 1) {
        return;
    }

    try {
        await mongoose.connect(process.env.MONGODB_URI || '', {
            useUnifiedTopology: true,
        });
        console.log('MongoDB connected');
    } catch (error) {
        console.error('MongoDB connection error:', error);
    }
};

export default dbConnect;
