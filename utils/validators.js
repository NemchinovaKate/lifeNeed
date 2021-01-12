const {body} = require('express-validator/check')
const User = require('../models/user')

exports.registerValidators = [
    body('email')
    .isEmail().withMessage('Введите корректный Email!')
    .custom( async (value,{req})=>{
        try{
            const user = await User.findOne({email:value})
            if (user){
                return Promise.reject('Такой Email уже занят!')
            }
        }catch(e){
            console.log(e)
        }
    })
    .normalizeEmail(),
    body('password','Пароль должен быть минимум 6 символов')
    .isLength({min:6, max:56})
    .isAlphanumeric()
    .trim(),
    body('confirm').custom((value,{req})=>{
        if (value !== req.body.password){
            throw new Error('Пароли должны совпадать')
        }
        return true
    })
    .trim(),
    body('name')
    .isLength({min:3}).withMessage('Имя должно содержать минимум три символа!')
    .trim()
]


exports.productValidators = [
    body('title').isLength({min:3}).withMessage('Минимальная длина назваиния - 3 символа')
    .trim(),
    body('price').isNumeric().withMessage('Введите корректную цену'),
    body('img','Введите корректный URL картинки')
    .isURL()
]