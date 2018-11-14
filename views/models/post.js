var mongoose = require("mongoose");


var postSchema = new mongoose.Schema({
    name: String,
    sumary:String,
    description: String,
    user: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        username: String
    },
    
    
    createdAt: { type: Date, default: Date.now },
    
});

module.exports = mongoose.model("Post", postSchema);