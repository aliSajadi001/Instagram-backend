let mongoose = require("mongoose")

let comment =new mongoose.Schema({
	createBy : {
		type :mongoose.Schema.Types.ObjectId,
		ref : "User",
		required : true
	},
	text : {
		type :String,
		required : true
	},
	postId : {
		type :mongoose.Schema.Types.ObjectId,
		ref : "Post",
		required : true
	},

} , {timestamps : true})

let commentModel = mongoose.model("Comment" , comment)
module.exports = commentModel