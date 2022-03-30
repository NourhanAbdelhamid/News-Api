const mongoose= require('mongoose')

const time = {
    timestamps: {currentTime: () => new Date().setHours(new Date().getHours() + 2)}
}


const newsSchema = mongoose.Schema({

    title:{
        type:String,
        required:true,
        trim:true
    },
    discription:{
        type:String,
        required:true,
        trim:true
    },
    host:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref: 'Reporter'
    },
    image:{
        type:Buffer
    }
},time)



// newsSchema.methods.toJSON = function(){

//     // document
//     const news = this
//     // Convert the document to  object
//     const newsObject = news.toObject()
//     return newsObject;
// }

const News = mongoose.model('News', newsSchema)

module.exports = News