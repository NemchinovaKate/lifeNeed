/*const { v4: uuidv4 } = require('uuid')
const fs = require('fs')
const path = require('path')

class Product {
    constructor(title, price, img, description){
        this.title = title
        this.price = price
        this.img = img
        this.description = description
        this.id = uuidv4()
    }

    toJSON(){
        return{
            title: this.title,
            price: this.price,
            img: this.img,
            description: this.description,
            id: this.id
        }
    }

    async save() {
        const products = await Product.getAll()
    
        products.push(this.toJSON())
        return new Promise(
            (resolve,reject)=>{
                fs.writeFile(
                    path.join(__dirname,'..','data','products.json'),
                    JSON.stringify(products),
                    (err) =>{
                        if (err){
                            reject(err)
                        }else{
                            resolve()
                        }
                    }
                ) 
            }
        )
    }

    static async update(product){
        const products = await Product.getAll()
        const index = products.findIndex(c => c.id === product.id)
        products[index] = product
        return new Promise(
            (resolve,reject)=>{
                fs.writeFile(
                    path.join(__dirname,'..','data','products.json'),
                    JSON.stringify(products),
                    (err) =>{
                        if (err){
                            reject(err)
                        }else{
                            resolve()
                        }
                    }
                ) 
            }
        )
    }

    static getAll(){
        return new Promise((resolve,reject) =>{
            fs.readFile(
            path.join(__dirname,'..','data','products.json'),
            'utf-8',
            (err,content)=>{
                if (err) {
                    reject(err)
                }else{
                    resolve(JSON.parse(content))
                }
            })
        })
    }
    static async getById(id){
        const products = await Product.getAll()
        return products.find(c => c.id === id)
    }
}

module.exports = Product*/

const { Schema, model } = require('mongoose')
const product = new Schema({
    title: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    img: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
    },
})

product.method('toClient', function () {
    const product = this.toObject()
    product.id = product._id
    delete product._id
    return product
})

module.exports = model('Product', product)
