export class AuthCodeFactory {
    constructor(private username: string, private password: string) {

    }

    public create(): string {
        let creds = `${this.username}:${this.password}`
        return btoa(creds);
    }
}