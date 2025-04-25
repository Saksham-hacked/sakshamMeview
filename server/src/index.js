import dotenv from 'dotenv';
dotenv.config({
    path:"./.env"
});
import app from './app.js';
import connectDb from './db/index.js';


connectDb().then(()=>{
    app.listen(process.env.PORT||5000,()=>{
        console.log("Server is running on port",process.env.PORT||5000);
    })
}).catch(err=>{
    console.log("Error connecting to database",err);
    process.exit(1);
}
)

