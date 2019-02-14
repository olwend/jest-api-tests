export class HeadersHelper {

    static createAuth(value: string): object {
        let headers = {
            'Accept': 'application/json',
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': `Basic ${value}`
        }
        // console.log(headers);
        return headers;
    }

    static createBearer(value: string): object {
        let headers = {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${value}`
        };
        // console.log(headers);
        return headers;
    }
}