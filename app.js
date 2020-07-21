let bodyParser = require("body-parser"),
    mongoose = require("mongoose"),
    express = require("express"),
    app = express();

mongoose.connect("mongodb://localhost/restful_blog_app");
app.set("view engine", "ejs");
app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended: true, useNewUrlParser: true, useUnifiedTopology: true}));

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

app.get("/blogs/new", (req, res)=>{
    res.render("new");
});

app.post("/blogs", (req, res)=>{
    Blog.create(req.body.blog, (err, newBlog)=>{
        if(err){
            console.log("ERROR CREATING NEW BLOG!!");
        }
        else{
            res.redirect("/blogs")
        }
    });
    console.log(req.body.blog)
});

app.get("/blogs/:id", (req, res)=>{
    Blog.findById(req.params.id, (err, foundBlog)=>{
        if(err){
            console.log("ERROR!! Blog Not Found");
            res.redirect("/blogs");
        }
        else{
            res.render("show", {blog: foundBlog});
        }
    })
    //res.send("Show Page of: "+req.params.id);
    console.log(req.params.id)
})

app.listen(3000, ()=>{
    console.log("server is running");
});

