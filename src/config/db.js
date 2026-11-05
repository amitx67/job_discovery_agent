import dns from "node:dns";
import mongoose from "mongoose";
import { config, requireEnv } from "./env.js";

if (config.dnsServers.length > 0) {
    dns.setServers(config.dnsServers);
}

const connectToDB = async () => {
    try {
        const uri = requireEnv("MONGODB_URI");

        const connection = await mongoose.connect(uri, {
            serverSelectionTimeoutMS: 15000,
        });

        console.log(
            `MongoDB connected successfully: ${connection.connection.host}`
        );

        return connection;
    } catch (error) {
        console.error("MongoDB connection failed:", error.message);
        throw error;
    }
};

export default connectToDB;
