
let Origins = [
  'http://localhost:3000',
  'http://localhost:5173',
  'http://localhost:3500',
];

let withCredentials = (req , res , next)=>{
let origin = req.headers.origin
if(Origins.includes(origin)){
	res.header("Access-Control-Allow-Credentials" , true)
}
next()
}
module.exports = withCredentials