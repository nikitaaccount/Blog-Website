const bcrypt = require('bcrypt')
const User = require('../models/User')

module.exports = (req,res) =>{
    const { username,password } = req.body
    
    User.findOne({username: username},function(error,user){        
        if(user){
            bcrypt.compare(password, user.password, (error,same)=>{
                if(same){
                    req.session.userId = user._id
                    res.redirect('/')
                }
                else{
                    res.render('login',{alertMsg:"Username or password is wrong"})
                }
            })
        }
        else{
            res.render('login', {alertMsg:"No user exits with this username"})
        }
    })
}