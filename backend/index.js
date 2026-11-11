import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import connectDB from "./utils/db.js";
import userRoute from "./routes/user.route.js";
import postRoute from "./routes/post.route.js";
import messageRoute from "./routes/message.route.js";
import { app,server } from "./socket/socket.js";
import path from "path";
import { fileURLToPath } from "url";


dotenv.config();




const PORT = process.env.PORT || 3000;
const __dirname=path.dirname(fileURLToPath(import.meta.url));
const frontendDistPath=path.resolve(__dirname,"..","frontend","dist");

app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}));

app.use("/api/v1/user",userRoute);
app.use("/api/v1/post",postRoute);
app.use("/api/v1/message",messageRoute);

app.use(express.static(frontendDistPath));
app.get("/{*path}",(req,res)=>{
    res.sendFile(path.join(frontendDistPath,"index.html"));
})

const startServer = async () => {
    try {
        await connectDB();

        server.listen(PORT, () => {
            console.log(`Server listening on port ${PORT}`);
        });
    } catch (error) {
        console.error("Failed to start server:", error.message);
        process.exit(1);
    }
};

startServer();