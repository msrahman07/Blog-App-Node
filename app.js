let methodOverride = require("method-override"),
    bodyParser = require("body-parser"),
    mongoose = require("mongoose"),
    express = require("express"),
    expressSanitizer = require("express-sanitizer"),
    app = express();

mongoose.connect("mongodb://localhost/restful_blog_app");
app.set("view engine", "ejs");
app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended: true, useNewUrlParser: true, useUnifiedTopology: true}));
app.use(expressSanitizer());
app.use(methodOverride("_method"));
let blogSchema = new mongoose.Schema({
    title: String,
    image: String,
    body: String,
    created: {type: Date, default: Date.now}
});
let Blog = mongoose.model("Blog", blogSchema);

// Blog.create({
//     title: "Test Blog",
//     image: "https://images.unsplash.com/photo-1554415707-6e8cfc93fe23?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1050&q=80",
//     body: "Hello This is Blog Post!!"
// });
//Routes

//index route
app.get("/", (req, res)=>{
    res.redirect("/blogs");
});

app.get("/blogs", (req, res)=>{
    Blog.find({}, (err, blogs)=>{
        if(err){
            console.log("error");
        }
        else{
            res.render("index", {blogs: blogs});
        }
    })
    //res.render("index");
});

// new page route
app.get("/blogs/new", (req, res)=>{
    res.render("new");
});

// CREATE route
app.post("/blogs", (req, res)=>{
    for(let key in req.body.blog){
        req.body.blog[key] = req.sanitize(req.body.blog[key]);
    }
    
    Blog.create(req.body.blog, (err, newBlog)=>{
        if(err){
            console.log("ERROR CREATING NEW BLOG!!");
        }
        else{
            res.redirect("/blogs")
        }
    });
});

// Show Page route
app.get("/blogs/:id", (req, res)=>{
    Blog.findById(req.params.id, (err, foundBlog)=>{
        if(err){
            console.log("ERROR!! Blog Not Found: "+err);
            res.redirect("/blogs");
        }
        else{
            res.render("show", {blog: foundBlog});
        }
    })
    console.log(req.params.id)
});

// Edit Page Route
app.get("/blogs/:id/edit", (req,res)=>{
    Blog.findById(req.params.id, (err, blog)=>{
        if(err){
            console.log("Error!! Cannot find the Blog");
            res.redirect("/blogs");
        }
        else{
            res.render("edit", {blog: blog});
        }
    });
});

// UPDATE route
app.put("/blogs/:id", (req, res)=>{
    for(let key in req.body.blog){
        req.body.blog[key] = req.sanitize(req.body.blog[key]);
    }
    Blog.updateOne({_id: req.params.id}, req.body.blog, (err, blog)=>{
        if(err){
            console.log("ERROR: "+err);
            res.redirect("/blogs/"+req.params.id);
        }
        else{
            res.redirect("/blogs/"+req.params.id);
        }
    });
});

// DELETE route
app.delete("/blogs/:id", (req, res)=>{
    Blog.deleteOne({_id: req.params.id}, (err, blog)=>{
        if(err){
            res.redirect("/blogs/"+req.params.id);
        }
        else{
            res.redirect("/blogs")
        }
    });
});

app.listen(3000, ()=>{
    console.log("server is running");
});

