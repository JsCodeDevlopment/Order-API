import { Document } from 'mongoose'
export interface IRegister extends Document {
    name: string
    email: string
    password: string
    imagePath: string
    rule: string
    isVerified: boolean
    verificationToken: string
    resetPasswordToken: string | null
    resetPasswordExpires: Date | null
}