import { IMailSettings } from "../../interfaces/IMailSettings";

export const mailSettings: IMailSettings = {
    service: "gmail",
    auth: {
        user: process.env.EMAIL,
        pass: process.env.PASS
    }
}