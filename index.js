// use path module
const path = require('path');
// use express module
const express = require('express');
// use hbs view engine
const hbs = require('hbs');
// use bodyParser middleware
const bodyParser = require('body-parser');
// use database module
const mysql = require('mysql');
const app = express();


//create mysql database connection

const conn = mysql.createConnection({
	host: 'localhost',
	user: 'root',
	password: '123',
	database: 'node_curd'
});

// connect to database 
conn.connect((err) => {
	if (err) throw err;
	console.log('mysql connected........!');
});
//set views file
app.set('views', path.join(__dirname, 'views'));
//set view engine
app.set('view engine', 'hbs');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
// set public folder as static folder for static file
app.use('/assets', express.static(__dirname+'/public'));

app.get('/' ,(req, res) => {
	let sql = "select * from product";
	let query = conn.query(sql, (err, results)=> {
		if (err) throw err;
		res.render('product_view',{
			results: results
		});
	});
});

app.post('/save', (req, res) => {
	let data = {product_name: req.body.product_name, product_price: req.body.product_price};
	let sql = "INSERT INTO product SET ?";
	let query = conn.query(sql, data,(err, results) => {
	  if(err) throw err;
	  res.redirect('/');
	});
});

//route for update data
app.post('/update',(req, res) => {
  let sql = "UPDATE product SET product_name='"+req.body.product_name+"', product_price='"+req.body.product_price+"' WHERE product_id="+req.body.id;
  let query = conn.query(sql, (err, results) => {
    if(err) throw err;
    res.redirect('/');
  });
});

app.post('/delete', (req, res) => {
	let sql = "DELETE FROM product WHERE product_id="+req.body.product_id+"";
	let query = conn.query(sql, (err, results) => {
		if (err) throw err;
		res.redirect('/');
	});
});

app.listen(8000, () => {
	console.log("Server is running at port 8000");
});