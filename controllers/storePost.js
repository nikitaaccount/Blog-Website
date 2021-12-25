const BlogPost = require('../models/BlogPost')
const path = require('path')

module.exports = async (req,res) =>{    
    let image = req.files.image
    image.mv(path.resolve(__dirname,'..','public/assets/img',image.name),
        async (error)=>{
            await BlogPost.create({
                ...req.body,
                image:'/assets/img/' + image.name,
                userid: req.session.userId

            })
            res.redirect('/')
        })

}