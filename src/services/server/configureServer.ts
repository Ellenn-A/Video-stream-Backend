import cors from "cors";
import express, { json, Request, Response } from "express";
import { DifferentVideos } from "../../routes/differentVids";
import { HelloWorld } from "../../routes/HelloWorld";
import { getVideo } from "../../routes/VideStreaming";



export function configureServer() {
    const app = express();
    app.use(cors());
    app.use(json());
    app.get('/hello', HelloWorld)

    //calling the function 
    app.get('/video/:video_id',getVideo);

    //get all different videos
    app.get('/all-vids',DifferentVideos);

    return app;
}
