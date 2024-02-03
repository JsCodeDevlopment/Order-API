import { model, Schema } from 'mongoose'

export const Product = model('Product', new Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: false
    },
    imagePath: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    ingredients: {
        type: [{
            name: {
                type: String,
                required: false
            },
            icon: {
                type: String,
                required: false
            }
        }],
        required: false
    },
    category: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'Category'
    }
}))