export interface IAuthProvider {
    faLogin: (login: string, password: string) => Promise<string>;
    faRegister: (login: string, password: string) => Promise<string>;
    faLogout: (token: string) => Promise<boolean>;
}