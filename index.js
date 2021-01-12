const express = require('express')
const path = require('path')
const mongoose = require('mongoose')
const app = express()
const session = require('express-session')
const Handlebars = require('handlebars')
const {allowInsecurePrototypeAccess} = require('@handlebars/allow-prototype-access')
const errorHandler = require('./middleware/error')
const flash = require('connect-flash')
const csrf = require('csurf')
const userMiddleware = require('./middleware/user')
const keys = require('./keys')
//const MONGODB_URI = 'mongodb+srv://katerina-nemka:IpgXO2jSQgIERcku@cluster0.94jzf.mongodb.net/shop'
const MongoStore = require('connect-mongodb-session')(session)
const exphbs = require('express-handlebars')
const homeRoutes = require('./routes/home')
const cardRoutes = require('./routes/card')
const addRoutes = require('./routes/add')
const catalogRoutes = require('./routes/catalog')
const authRoutes = require('./routes/auth')
const ordersRoutes = require('./routes/orders')
const varMiddleware = require('./middleware/variables')
const profileRouters = require('./routes/profile')
const fileMiddleware = require('./middleware/file')
const store = new MongoStore({
    collection:'sessions',
    uri:keys.MONGODB_URI

})

const hbs = exphbs.create({
    defaultLayout:'main',
    extname:'hbs',
    handlebars: allowInsecurePrototypeAccess(Handlebars),
    helpers:require('./utils/hbs-helpers')
})

app.engine('hbs',hbs.engine) //регистрируем движок
app.set('view engine','hbs') //используем
app.set('views','views')

/*app.use(async (req,res,next)=>{
    try{
       const user = await User.findById('5f5895460adcbb04805f9c2c')
    req.user = user 
    next()
    }catch(e){
        console.log(e)
    }
    
})*/

app.use(express.static(path.join(__dirname,'public')))
app.use('/images',express.static(path.join(__dirname,'images')))
app.use(express.urlencoded({extended:true}))

app.use(session({
    secret:keys.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store
}))
app.use(fileMiddleware.single('avatar'))
app.use(csrf())
app.use(flash())

app.use(varMiddleware)
app.use(userMiddleware)
app.use('/',homeRoutes)
app.use('/add',addRoutes)
app.use('/catalog',catalogRoutes)
app.use('/auth',authRoutes)
app.use('/card',cardRoutes)
app.use('/orders',ordersRoutes)
app.use('/profile',profileRouters)
app.use(errorHandler)

const PORT = process.env.PORT || 3000

async function start(){
    try{
       // const url = 'mongodb+srv://katerina-nemka:IpgXO2jSQgIERcku@cluster0.94jzf.mongodb.net/<dbname>?retryWrites=true&w=majority'
            await mongoose.connect(keys.MONGODB_URI,{
                useNewUrlParser:true,
                useFindAndModify: false
            })

          /*  const candidate = await User.findOne()
            if (!candidate){
                const user = new User({
                    email:'nemchinova-kate@mail.ru',
                    name:'Admin',
                    cart:{items:[]}
                })
                await user.save()
            }*/

            app.listen(PORT,() =>{
                console.log(`Server is running on ${PORT}`)
            })
    }catch(e){
        console.log(e)
    }
}

start()

//const password = 'IpgXO2jSQgIERcku'


