import { RequestHandler } from "express";
import { promises as fs, createReadStream } from "fs";

interface IGetVideoParams{
    video_id:string; //expected parameter
}

//request handler : request has no body (unknown); response has no body (unknown) 
export const getVideo:RequestHandler<IGetVideoParams,unknown, unknown> = async (req,res) =>{
    const videoId = req.params.video_id  //obtain video id - in my case name of the video 
    console.log(`Getting videoId ${videoId}`);

    const path = `./src/assets/${videoId}`; //path to the video

    // info about the video file 
    const stat = await fs.stat(path);

    const fileSize = stat.size; //file size 
    console.log(`Video file size is ${fileSize} bytes`)

    const { range } = req.headers;
    console.log('range');
    console.log(range);

    //if range exists - user has started watching the video and I want next bit of it 
    if (range){

        const parts = range.replace(/bytes=/,'').split('-'); //get start and end of the videos //array of length 2 
        console.log(parts);
        //starting byte 
        const start  = parseInt(parts[0],10); //specifying this is a base 10 number 

        //ending byte 
        const end = parts[1] //check if end has been specified 
        ? parseInt(parts[1],10) //if yes get the num 
        : fileSize -1; //if not go to end of vid 

        //size of video-chunk
        const chunksize = (end-start)+1;

        const file = createReadStream(path,{start,end}); //creating a stream of data that is ready to 'flow to user's browser

        //add headings to the response 
        const headers = {
            //tell the range we are sending 
            'Content-Range':`bytes ${start}-${end}/${fileSize}`,
            //thell it the range we'll get in header is number of bytes 
            'Accept-Ranges':'bytes',
            'Content-Length':chunksize,
            //type of file for the browser 
            'Content-Type':'video/mp4',
        };

        res.writeHead(206,headers); //resp statuscode 206 = successful, partial content 
        
        file.pipe(res);

        console.log(`Sending video with range ${start} to ${end}`)


    }
    //no range specified - user hasn't started watching yet 
    else{
        //headers to add to the response - basic info bout video 
        const headers = {
            'Content-Length':fileSize,
            'Content-Type':'video/mp4',
        };

        res.writeHead(200,headers);
        createReadStream(path).pipe(res);
        console.log('sending whole video')

    }

}







