var Post = require("../models/post");
var middlewareObj = {};

middlewareObj.checkPostOwnership = function(req, res, next){
    if(req.isAuthenticated()){
        Post.findById(req.params.id, function(err,foundPost){
            if(err || !foundPost) {
                req.flash("flash", "Post not found");
                res.redirect("back");
            } else {
                if(foundPost.user.id.equals(req.user._id)){
                    //foundPost.user.id: mongoose obj
                    //req.user._id: string
                    next();
                } else {
                    req.flash("flash", "You don't have permission to do that");
                    res.redirect("back");
                }    
            }
        });
    } else {
        req.flash("flash", "You need to be logged in to do that");
        res.redirect("back");
    }
}



middlewareObj.isLoggedIn = function(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    req.flash("flash", "You need to be logged in to do that")
    res.redirect("/login");
}


module.exports = middlewareObj;