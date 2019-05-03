var express                 =require("express");
var app                     =express();
var bodyParser              =require("body-parser");
var mongoose                =require("mongoose");
var flash                   =require("connect-flash");
var passport                =require("passport");
var passportLocalMongoose   =require("passport-local-mongoose");
var LocalStrategy           =require("passport-local");
var methodOverride          =require("method-override");
var Campground              =require("./models/campground");
var Comment                 =require("./models/comment");
var User                    =require("./models/user");
var seedDB                  =require("./seeds");

// requiring routes
var commentRoutes           =require("./routes/comments");
var campgroundsRoutes       =require("./routes/campgrounds");
var indexRoutes             =require("./routes/index");
// seedDB();
mongoose.connect("mongodb://localhost:27017/yelp_camp_v12",{useNewUrlParser: true});
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public")); 
app.use(methodOverride("_method"));
app.use(flash());
//passport config
app.use(require("express-session")({
    secret:"AMS NEVE",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// mandar la variable con el id de usuario a todos los templates
app.use(function(req,res,next){
    res.locals.currentUser =req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
});

//poner /campgrounds toma todas las rutas del archivo campgrounds.js y les anexa la direccion antes
app.use(indexRoutes);
app.use("/campgrounds", campgroundsRoutes);
app.use("/campgrounds/:id/comments",commentRoutes);




app.listen(process.env.PORT, process.env.IP, function(){
    console.log("YelpCamp started");
});

