
import cors from "cors";
import express, { json } from "express";
import { PORT } from "./config/server.conf";
import { configureServer } from "./services/server/configureServer";


async function main(){
    const app = express();
    console.log('started')

    const server = configureServer();
    server.listen(PORT) 
}

main();


