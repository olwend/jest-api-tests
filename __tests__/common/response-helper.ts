import * as request from "request";
//import { error } from "util";

export class ResponseHelper {

    static handleResponse(response: request.Response): Promise<string> {
        expect(response.statusCode).toBe(200);
        // console.log(response.statusCode);

        let data = '';
        return new Promise((resolve, reject) => {
            
            response.on('data', _data => (data += _data));
            
            response.on('end', () => {
                //console.log(data)
                //return data;
                //done();
                resolve(data)
            });
            //if (error) reject(error);
            //else resolve('anything');

        });
        
    }
}