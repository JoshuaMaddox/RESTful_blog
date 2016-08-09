/*======================================================
   |     |     REQs
======================================================*/

var bodyParser  = require("body-parser"),
    mongoose    = require("mongoose"),
    express     = require("express"),
    app         = express();
    
/*======================================================
   |     |     APP CONFIG
======================================================*/
    
//Set mongoose to connect to mongo and create the DB jm_simple_)blog
mongoose.connect("mongodb://localhost/jm_simple_blog");
//Use ejs files in the views folder
app.set("view engine", "ejs");
//So we can serve static files such as client side js - css - images etc...
app.use(express.static("public"));
//Using body parser to help turn JSON into js objects
app.use(bodyParser.urlencoded({extended: true}));

/*======================================================
   |     |     MONGO/MONGOOSE CONFIG
======================================================*/

var blogSchema = new mongoose.Schema({
   title: String,
   image: String,
   body: String,
   created: {type: Date, default: Date.now}
});

//Converts the blogSchema into a mongoose model
var Blog = mongoose.model("Blog", blogSchema);

/*======================================================
   |     |     ROUTES
======================================================*/
//Redirects to the /blogs page which is the INDEX route
app.get("/", function(req, res){
    res.redirect("/blogs");
})


//The INDEX route that pulls from index.ejs
app.get("/blogs", function(req, res){
    //Gets the data coming back from the DB after .find, stores it in var "blogs"
    //then passes it down to the blogs object in the res.render.
    Blog.find({}, function(err, blogs){
        if(err){
            console.log(err);
        } else {
            //Renders the the data passed in via the "blogs" variable in the callback which is
            //stored in the object's value with a key we defined as "blogs". The key could've been any name.
            res.render("index", {blogs: blogs});
        }
    });
    
});




//Starts express and confirms the server has started
app.listen(process.env.PORT, process.env.IP, function(){
    console.log("Blog server has started");
});