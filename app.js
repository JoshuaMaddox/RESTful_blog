/*======================================================
   |     |     REQs
======================================================*/

var methodOverride  = require("method-override"),
    bodyParser      = require("body-parser"),
    mongoose        = require("mongoose"),
    express         = require("express"),
    app             = express();
    
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
//Using method-override then pass in an argument that tells MO what to look for in the URL
app.use(methodOverride("_method"))

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

/*======================================================
   |     |    INDEX ROUTE
======================================================*/


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

/*======================================================
   |     |   NEW & CREAYE ROUTES
======================================================*/


//The NEW route that renders the form to add in new DB entry
app.get("/blogs/new", function(req, res){
    res.render("new")
});

//The CREATE route the sends the form data to the DB
app.post("/blogs", function(req, res){
    //CREATE the DB Entry
    // .create(data, callback)
    //data is referenced by req.body. and then whatever name we used in our form's name="" attribute in the new.ejs file
    Blog.create(req.body.blog, function(err, newBlog){
        if(err){
            //MUST HANDLE THIS ERROR - CHANGE ME************
            res.render("new");
        } else {
            //Redirect to /index 
            res.redirect("/blogs");
        }
    }); 
});

/*======================================================
   |     |  SHOW ROUTE
======================================================*/

app.get("/blogs/:id", function(req, res){
    //Uses the findById mongoose method and then passes in the id from :id to req.params.id
    //Stores the DB entry intot the callback var foundBlog which gets passed into 
    //the else statement's res.render's object. the key name "blog" could be anything
    Blog.findById(req.params.id, function(err, foundBlog){
        if(err){
             //MUST HANDLE THIS ERROR - CHANGE ME************
            res.redirect("/blogs");
        } else {
            res.render("show", {blog: foundBlog});
        }
    });
});

/*======================================================
   |     |  EDIT ROUTE
======================================================*/

app.get("/blogs/:id/edit", function(req, res){
    Blog.findById(req.params.id, function(err, foundBlog){
       if(err){
            //MUST HANDLE THIS ERROR - CHANGE ME************
            res.redirect("/blogs");
       } else {
           //Use the blog key to pass the edit information
           //to the edit.ejs file.
           res.render("edit", {blog: foundBlog});
       }
    });
});

/*======================================================
   |     |  UPDATE ROUTE
======================================================*/

app.put("/blogs/:id", function(req, res){
    //takes 3 arguements (id, newData, callback)
    //newData should be called whatever we called the data in our form in the edit.ejs file
    //In this case it is blog, so req.body.blog
    Blog.findByIdAndUpdate(req.params.id, req.body.blog, function(err, updatedBlog){
        if(err){
            //MUST HANDLE THIS ERROR - CHANGE ME************
            res.redirect("/blogs");
        } else {
            res.redirect("/blogs/" + req.params.id);
        }
    }) 
});


//Starts express and confirms the server has started
app.listen(process.env.PORT, process.env.IP, function(){
    console.log("Blog Server Has Started")
});