import { model, Schema } from 'mongoose'

export const Register = model('Register', new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    imagePath: {
        type: String,
        required: true
    },
    rule: {
        type: String,
        enum: ['ADM', 'USER'],
        default: 'USER',
        required: true
    },
}))