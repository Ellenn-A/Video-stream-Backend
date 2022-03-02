import { Request, Response } from "express";
import { videoMockData } from "../assets/vidInformation";

export const DifferentVideos = (req:Request,res:Response) =>{
    const allVidsInfo = videoMockData;
    console.log('hitting this')
    res.send(videoMockData);

}