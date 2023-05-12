const express = require('express');
const app = express();
const cors = require('cors');
const path = require('path');
const errorHandler = require('./middleware/errorHandler');

const PORT = process.env.PORT || 3500;

//custom middlewares
app.use((req, res, next) => {
    console.log(`${req.method}\t${req.headers.origin},${req.path}`);
    next();
})
//cors = cross origin resourse sharing
const whightList = ['https://www.google.com', 'https://localhost:3500'];
const corsOptions = {
    origin: (origin, callback) => {
        if (whightList.indexOf(origin) !== -1|| !origin) {
            callback(null, true);
        } else {
            callback(new Error("Access denied by cors"))
        }
    },
    optionsSuccessStutus: 200

}
app.use(cors(corsOptions))
//built-in middleware to handle urlencoded data
//in other words ,FORM data
//`content-type: application/x-www.form-urlencoded`

app.use(express.urlencoded({ extended: false }));

//built-in middleware for json
app.use(express.json());

//serve static files
app.use(express.static(path.join(__dirname, '/public')));

app.get('^/$|/index(.html)?', (req, res) => {
    //res.sendFile('./views/index.html',{root: __dirname})
    res.sendFile(path.join(__dirname, 'views', 'index.html'))
});
app.get('/new-page(.html)?', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'new-page.html'))
});
app.get('/old-page(.html)?', (req, res) => {
    res.redirect(301, '/new-page.html')
});

app.get('/home(.html)?', (req, res, next) => {
    console.log("Attemted to access home.html");
    next();
}, (req, res) => {
    res.send('Hello world')
})

app.all('*', (req, res) => {
    res.status(404)
    if(res.accepts('html')){
        res.sendFile(path.join(__dirname, 'views', '404.html'));
    }
    else if(res.accepts('json')){
        res.json({error: '404 Not Found'})
    }else{
        res.type('txt').send('404 Not Found')
    }
    
})

app.use(errorHandler)

app.listen(PORT, () => console.log(`server is running on PORT ${PORT}`));