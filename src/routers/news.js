const express = require('express');
const auth = require('../middleware/auth');
const News= require('../models/news');
const router= express.Router();
const multer=require('multer')



//add news

router.post('/news',auth,async(req,res)=>{

    try{
        const news=new News({...req.body,host:req.reporter._id})
        await news.save()
        res.status(200).send(news)
    }
    catch(e){
        res.status(400).send(e.message)
    }
})

//get all news

router.get('/news',auth,async(req,res)=>{
    try{

        await req.reporter.populate('News')
        res.status(200).send(req.reporter.News)
    }
    catch(e){
        res.status(500).send(e.message)
    }
})


//get new by id

router.get('/news/:id',async(req,res)=>{
    try{
        const news = await News.findById(req.params.id)
        if(!news){
          return  res.status(404).send('no news with this id ')
        }
        res.send(news)
    }
    catch(e){
        res.status(500).send(e.message)
    }
})

// update news by id

router.patch('/news/update/:id',async(req,res)=>{
    try{
        const _id = req.params.id
        const news = await News.findByIdAndUpdate({_id},req.body,{
            new:true,
            runvalidators:true
        })
        if(!news){
            return res.status(404).send('no news have this id')
        }
        res.status(200).send(news)
    }
    catch(e){
        res.status(500).send(e.message)
    }
})

router.delete('/news/removeNew/:id',async(req,res)=>{
    try{
        const news = await News.findByIdAndDelete(req.params.id)
        if(!news){
            res.status(404).send('no news have this id')
        }
        res.status(200).send(news)
    }
    catch(e){
        res.status(500).send(e.message)
    }
})

//get news host info 

router.get('/news/host/:id',auth,async(req,res)=>{
    try{
        const _id = req.params.id
        const news = await News.findOne({_id,host:req.reporter._id})
        if(!news){
            return res.status(404).send('No news')
        }
        await news.populate('host') // refrence 
        res.status(200).send(news.host)
    }
    catch(e){
        res.status(500).send(e)
    }
})


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

    //add news img

    router.post('/news/img/:id',auth,uploads.single('image'),async(req,res)=>{
        try{
            const _id=req.params.id 
            const news=await News.findOne({_id,host:req.reporter._id})
            if(!news){ 
                return res.status(404).send('no news have this id')}
            news.image=req.file.buffer
            news.save()
            res.status(200).send("uploded done ")
    
        }
        catch(e){
            res.status(400).send(e.message)
        }
    
    })

    

module.exports = router
