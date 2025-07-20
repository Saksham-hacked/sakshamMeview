import express from 'express';
const app = express();
import cookieParser from 'cookie-parser';
import cors from 'cors';


app.use(cors({
    origin :["http://localhost:5173","https://meview.onrender.com"],
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    

    credentials: true,
}))

app.use(express.json());
app.use(express.urlencoded({ extended: true, }));
app.use(express.static('public'));
app.use(cookieParser());



import userRouter from './routes/user.routes.js';
import reviewRouter from './routes/review.routes.js';
import topFiveRouter from './routes/topFive.routes.js';



app.use("/user",userRouter);
app.use("/review", reviewRouter);
app.use("/topfive", topFiveRouter);


export default app;
