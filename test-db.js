
import "dotenv/config";
import connectToDB from "./src/config/db.js";
import mongoose from "mongoose";

try {
    await connectToDB();
} catch (error) {
    process.exitCode = 1;
} finally {
    await mongoose.disconnect();
}
