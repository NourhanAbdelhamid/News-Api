const mongoose=require('mongoose')
const validator=require('validator')
const bcryptjs=require('bcryptjs')
const jwt=require('jsonwebtoken')

const time = {
    timestamps: {currentTime: () => new Date().setHours(new Date().getHours() + 2)}
}

const reporterSchema=new mongoose.Schema({
    name:{
        type:String,
        required:true,
        trim:true
    },
    email:{
        type:String,
        required:true,
        trim:true,
        lowercase:true,
        unique:true,
        validate(value){
            if(!validator.isEmail(value))
            throw new Error('Please enter valid email !!!')
        }
    },
    age:{
        type:Number,
        trim:true,
        default:25
    },
    password:{
        type:String,
        required:true,
        minlength:6,
        validate(value){
            var RegExpPass = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])");
            if(!RegExpPass.test(value))
            throw new Error('Enter Strong Passowrd that contains at least  6 chars(upercase and lowercase) ,spcial char and numbers')
        }
    },
    phone:{
        type:String,
        required:true,
        validate(value){
            if(!validator.isMobilePhone(value,'ar-EG'))
              throw new Error('enter valid phone number')
        }
    },
    avatar:{
        type:Buffer
    },
    tokens:[{
        type:String,
        required:true
    }]
},
 
    time
)

reporterSchema.pre('save',async function(){
    const reporter=this
    if(reporter.isModified('password'))
    {
        const hashedPassword=await bcryptjs.hash(reporter.password,8)
        reporter.password=hashedPassword
    }
})

reporterSchema.statics.findByCredentials=async function(email,password){

    const reporter=await Reporter.findOne({email})
    if(reporter){
        const pass=await bcryptjs.compare(password,reporter.password)
        if(pass)
         return reporter
        else
          throw new Error('Wrong Password')
    } 
    throw new Error('not found')
}

reporterSchema.methods.generateToken=async function(){
    const reporter=this
    const token= jwt.sign({_id:reporter._id.toString()},process.env.JWT_SECRET)
    reporter.tokens=reporter.tokens.concat(token)
    await reporter.save()
    return token
}

reporterSchema.methods.toJSON= function(){
    const reporter=this
    const reporterObj=reporter.toObject()
    delete reporterObj.password
    delete reporterObj.tokens
    return reporterObj
}

reporterSchema.virtual('News',{
    ref:'News',
    localField:'_id',
    foreignField:'host'
})

const Reporter=mongoose.model('Reporter',reporterSchema)
module.exports=Reporter