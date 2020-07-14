import { IAuthProvider } from "../AuthProvider/IAuthProvider";

export interface IUser {
    id?: number;
    username?: string;
    password? :string;
    token?: string;
}

export class User implements IUser {
    public id: number;
    public username: string;
    public password: string;
    public token: string;

    public fIsLogin(): boolean {
        return Boolean(this.token);
    }

    public async fLogin(provider: IAuthProvider) {
        this.token = await provider.faLogin(this.username, this.password);
    }

    public async fLogout(provider: IAuthProvider) {
        await provider.faLogout(this.token);
        this.token = null;
    }

    public async fRegister(provider: IAuthProvider) {

    }
}