var express    = require("express");
var router     = express.Router();
var Post       = require("../models/post");
var User       = require("../models/user");
var middleware = require("../middleware") //index.js
var mongoose   = require("mongoose");



//latest posts
router.get("/latest",function(req,res){
    Post.find({}).sort({"_id":-1}).limit(5).exec(function(err,foundPosts){
        if(err){
            console.log(err);
        }else{
            var data = "";
            foundPosts.forEach(function(post){
               title = "<span><a href='" + post.id + "'>" + post.name + "</a></span>"; 
                excerpt = "<span>" + post.description + "</span>";                 
                data += "<div class='latest-item'>" + title + excerpt + "</div>";
            })
            res.send(data);
        }
    });
});


//INDEX

router.get("/",function(req,res){
    Post.find({},function(err,allPosts){
        if(err){
            console.log("failed to get all posts");
            console.log(err);
        }else{
            res.render("index",{list:allPosts});
        }
    });
    
});

//NEW

router.get("/new",middleware.isLoggedIn, function(req,res){
    res.render("newpost");
})

//CREATE
router.post("/",middleware.isLoggedIn, function(req,res){
    var name = req.sanitize(req.body.name) || "Untitled Post";
    var description = req.sanitize(req.body.description) || "No description";
    var user = { id: req.user._id, username: req.user.username};
    var newPost = {name:name, description:description, user:user};
    Post.create(newPost,function(err,created){
        if(err){
            console.log(err);
        }
    });
    res.redirect("/posts");
});

//SHOW
router.get("/:id",function(req,res){
    Post.findById(req.params.id).populate("comments").exec(function(err,foundPost){
        if(err || !foundPost) {
            console.log(err);
        } else {
            res.render("show",{post:foundPost});
        }
    });
});

//EDIT
router.get("/:id/edit", middleware.checkPostOwnership, function(req,res){
        Post.findById(req.params.id, function(err,foundPost){
            if(err) {
                console.log(err);
            } else {
                res.render("editpost",{post:foundPost});
                
            }
        });
});

//UPDATE
router.put("/:id", middleware.checkPostOwnership, function(req, res){
    var name = req.sanitize(req.body.post.name) || "Untitled Post";
    var description = req.sanitize(req.body.post.description) || "No description";
    var user = { id: req.user._id, username: req.user.username};
    var editedPost = {name:name, description:description, user:user};
    
    Post.findByIdAndUpdate(req.params.id, editedPost, function(err, updatedPost){
        if(err){
            res.redirect("/posts/" + req.params.id);
        } else {
            res.redirect("/posts/" + req.params.id);
        }
    });
});

//DESTROY
router.delete("/:id", middleware.checkPostOwnership, function(req, res){
    Post.findByIdAndRemove(req.params.id, function(err){
        if(err){
            res.redirect("/posts");
        } else {
            res.redirect("/posts");
        }
    });
});



module.exports = router;