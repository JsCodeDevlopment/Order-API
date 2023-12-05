export interface IMailSettings {
    service: string
    auth: {
        user: string | undefined
        pass: string | undefined
    }
}