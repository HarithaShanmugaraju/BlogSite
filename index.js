import express from "express";
import bodyParser from "body-parser";

const app = express();

const port = process.env.PORT || 3000;

app.use(express.static("public"));

app.use(express.urlencoded({ extended: true }));

let blogList = [];

app.get("/", (req, res) => {
    res.render("index.ejs");
});

app.get("/home", (req, res) => {
    res.render("blogList.ejs", {
        blogList: blogList
    });
});

app.post("/home", (req, res) => {
    const blogTitle = req.body.blogTitle;
    const blogdes = req.body.blogDes;

    // Check if a blog with the same title and description already exists
    const blogExists = blogList.some((blog) => blog.title === blogTitle && blog.description === blogDes);

    // If the blog already exists, don't add it again
    if (blogExists) {
        return res.render("blogList.ejs", {
            blogList: blogList, // Render the list without adding a duplicate blog
        });
    }

    blogList.push({
        id: generateID(),
        title: blogTitle,
        description: blogdes
    });

    res.render("blogList.ejs", {
        blogList: blogList
    });


});



app.get("/blogDetails/:id", (req, res) => {
    const blogId = req.params.id;
    const blogDetails = blogList.find((blog) => blog.id === parseInt(blogId));

    res.render("viewBlogDetails.ejs", {
        blogDetails: blogDetails
    });
});


app.get("/edit/:id", (req, res) => {

    const blogId = req.params.id;
    const blogDetails = blogList.find((blog) => blog.id === parseInt(blogId));
    res.render("index.ejs", {
        isEdit: true,
        blogDetails: blogDetails,
    });
})


app.post("/edit/:id", (req, res) => {
    const blogId = req.params.id;
    const editBlog = blogList.findIndex((blog) => blog.id === parseInt(blogId));
    if (editBlog === -1) {
        res.send("<h1> Something went wrong </h1>");

    }

    const updatedTitle = req.body.blogTitle;

    const updatedDescription = req.body.blogDes;


    blogList[editBlog].title = updatedTitle;
    blogList[editBlog].description = updatedDescription;

    res.render("blogList.ejs", {
        isEdit: true,
        blogList: blogList,
    })

})

app.post("/delete/:id", (req, res) => {
    const blogId = req.params.id;

    blogList = blogList.filter((blog) => blog.id !== parseInt(blogId));
    res.send('<script> alert("Blog deleted successfully!");window.location="/home"</script>');

    //res.redirect("/home");

})



function generateID() {
    return Math.floor(Math.random() * 1000);
}
app.listen(port, () => {
    console.log(`Server is running on port ${port}
  http://localhost:${port}/`);
});
