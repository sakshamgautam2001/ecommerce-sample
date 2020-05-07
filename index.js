const express=require("express");
const engine=require('ejs-locals') ;
const path=require('path') ;

const app=express() ;
const http=require('http');
const server=http.Server(app);

const bodyParser=require('body-parser');
const jsonParser = bodyParser.json();
const urlencodedParser = bodyParser.urlencoded({ extended: false })

const session = require('express-session');

const { Pool }=require('pg')

const pool = new Pool({
    ssl:{ rejectUnauthorized: false },
    connectionString:'postgres://avxtbpjzuhzqap:37442432cdf4c9a510e6be21cab413595f537093aa8b302964b77876bae95d50@ec2-50-17-21-170.compute-1.amazonaws.com:5432/dag03945u9ui3j',
  });

app.engine('ejs',engine) ;
app.set('view engine','ejs');
app.set('views', path.join(__dirname, 'views'));

app.use('/assets',express.static('assets'));

app.use(session({secret: 'ssshhhhh',saveUninitialized: true,resave: true, cookie:{maxAge:300000}}));
var Session;

app.get('/',(req,res)=>{
    res.render('landing');
});
app.get('/login',(req,res)=>{
    res.render('login')
});
app.post('/login',urlencodedParser,(req,res)=>{
    var dt=req.body
    var Query="select * from users where username='"+dt['username']+"' and password='"+dt['password']+"'" ;
    pool.query(Query,(err,result)=>{
        if(err) {
            throw err;
        }
        if(result.rowCount==1){
            Session=req.session;
            Session.user=dt['username']
            Session.pass=dt['password']
            res.redirect('/cart')
        }
        else{
            res.redirect('/login')
        }
    });
});

app.get('/logout',(req,res)=>{
    req.session.destroy((err)=>{
        if(err) throw err;
        res.redirect('/login')
    });
});

app.get('/cart',(req,res)=>{
    Session=req.session;
    if(Session.user){
        res.render('cart')
    }
    else{
        res.redirect('/login')
    }
});






server.listen(process.env.PORT || 7000,'0.0.0.0',()=>{
    //console.log(app.get('views'))
    
    console.log(`Express running→PORT 7000`);
});