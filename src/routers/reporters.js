const express = require('express')
const router = express.Router()
const Reporter = require('../models/reporters')
const auth = require('../middleware/auth')
const multer=require('multer')
const News = require('../models/news')



/////////////////////////////////////////////////////

//SignUp
router.post('/reporter',async(req,res)=>{
    try{
        const reporter = new Reporter(req.body)
        const token = await reporter.generateToken()
        await reporter.save()
        res.status(200).send({reporter,token})
    }
    catch(e){
        res.status(400).send(e.message)
    }
})


//login

router.post('/reporter/login',async(req,res)=>{
    try{
        const reporter = await Reporter.findByCredentials(req.body.email,req.body.password)
        const token  = await reporter.generateToken()
        res.status(200).send({reporter,token})
    }
    catch(e){
        res.status(400).send(e.message)
    }
})

//reporter profile

router.get('/reporter/profile',auth,async(req,res)=>{
    res.status(200).send(req.reporter)
})


//logout 

router.delete('/reporter/logout',auth,async(req,res)=>{
    try{
        console.log(req.reporter)
        req.reporter.tokens = req.reporter.tokens.filter((el)=>{
            return el !== req.token
        })
        await req.reporter.save()
        res.send('logout done successfuly')
    }
    catch(e){
        res.status(500).send(e)
    }
})

//logout all 

router.delete('/reporter/logoutAll',auth,async(req,res)=>{
    try{
        req.reporter.tokens = []
        await req.reporter.save()
        res.status(200).send('you loged out all tokens')
    }
    catch(e){
        res.status(500).send(e)
    }
})

//get reporter by id

router.get('/reporter/:id',auth,async(req,res)=>{
    try{
        const reporter=await Reporter.findOne({_id:req.params.id})
        if(!reporter) {
            return res.send(404).send('Cannot find reporter !')}
        res.status(200).send(reporter)
    }
    catch(e){
        res.status(400).send(e.message)
    }
})




router.get('/reporter', auth, async (req, res) => {
    try {
        const reporter = await Reporter.find({})
        if(!reporter){
            throw Error("there is no reporter")
        }
        res.status(200).send(reporter)
    } catch (error) {
        res.status(500).send(error)
    }
})

//update reporter his profile data

router.patch('/reporter/updateProfile',auth,async(req,res)=>{
    try{
        const updates = Object.keys(req.body)
        const reporter = req.reporter
        updates.forEach((update)=>(reporter[update]=req.body[update]))
        await reporter.save()

        res.status(200).send(reporter)
    }
    catch(e){
        res.status(400).send(e.message)
    }
})

//remove reporter his profile

router.delete('/reporter/removeProfile',auth,async(req,res)=>{
    try{
        req.reporter.remove(function () {
            res.status(200).send('deleted successfuly')
        })
    }
    catch(e){
        res.status(500).send(e)
    }
    })
/////////////////////////////////////////////////////////////////////////

    //upload imgFile function
    const uploads = multer({
        limits:{
            fileSize:1000000 
        },
        fileFilter(req,file,cb){
            if(!file.originalname.match(/\.(jpg|jpeg|png|jfif)$/)){
                return  cb(new Error('Please upload image!!!'))
    
            }
            cb(null,true)
    
        }
    })

    //add reporter photo

    router.post('/reporter/avatar',auth,uploads.single('avatar'),async(req,res)=>{
        try{
            req.reporter.avatar = req.file.buffer
            await req.reporter.save()
            res.status(200).send('your photo uploaded successfuly')
        }
        catch(e){
            res.send(e)
        }
    })

    //delete reporter photo

    router.delete('/reporter/avatarRemove',auth,async(req,res)=>{
        try{
            req.reporter.avatar=null
            await req.reporter.save()
            res.status(200).send('your photo deleted')
        }
        catch(e){
            res.status(400).send(e.message)
        }
    })







module.exports = router

