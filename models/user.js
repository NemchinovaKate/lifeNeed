const { Schema, model } = require('mongoose')

const userSchema = new Schema({
    email: {
        type: String,
        required: true,
    },
    name: String,
    role: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    avatarUrl: String,
    resetToken: String,
    resetTokenExp: Date,
    cart: {
        items: [
            {
                count: {
                    type: Number,
                    require: true,
                    default: 1,
                },
                productId: {
                    type: Schema.Types.ObjectId,
                    ref: 'Product',
                    require: true,
                },
            },
        ],
    },
})

userSchema.methods.addToCart = function (product) {
    const items = this.cart.items.concat()
    const idx = items.findIndex((c) => {
        return c.productId.toString() === product._id.toString()
    })

    if (idx >= 0) {
        items[idx].count = items[idx].count + 1
    } else {
        items.push({
            productId: product._id,
            count: 1,
        })
    }

    const newCart = { items }
    this.cart = newCart
    return this.save()
}

userSchema.methods.removeFromCart = function (id) {
    let items = [...this.cart.items]
    const idx = items.findIndex((c) => {
        return c.productId.toString() === id.toString()
    })
    if (items[idx].count === 1) {
        items = items.filter((c) => c.productId.toString() !== id.toString())
    } else {
        items[idx].count--
    }
    this.cart = { items }
    return this.save()
}

userSchema.methods.clearCart = function () {
    this.cart = { items: [] }
    return this.save()
}

module.exports = model('User', userSchema)
