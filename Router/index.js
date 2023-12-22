
const express=require('express')
const jwt=require("jsonwebtoken");
const session = require('express-session');
const pool=require("../database");
// const app=express();
const bodyParser = require("body-parser");
const cookieParser = require('cookie-parser')
const router=express.Router();
const multer = require('multer');
const controller=require("../Controller/controller");
router.use(bodyParser.urlencoded({extended:true}))
router.use(bodyParser.json())
router.use(cookieParser())
const objectId = require('mongodb')._id;
  
var fs = require('fs');
var path = require('path');
require('dotenv/config');

router.get('/signup',async(req,res)=>{
    const z=await controller.datahere(req,res);
    console.log(z);
    res.render("signup")
})
router.get('/upload',async(req,res)=>{
    res.render("image")
})
router.get('/try',async(req,res)=>{
    res.render("try")
})
router.get('/result',async(req,res)=>{
    res.render("result")
})




/*view profile*/
const Image = require('../model'); // Import the Image model or use your own model

router.get('/profile', async (req, res) => {
    try {
      const email = req.cookies.email;
  
      // Retrieve the image document from MongoDB based on the email ID
      const image = await Image.findOne({ emailid: email });
  
      // Access the image data and content type from the document
      const imageData = image ? image.img.data : null;
      const imageContentType = image ? image.img.contentType : null;
      const name = image ? image.name : null;
      const mobile_no=image?image.mobile_no:null;
      const dob=image?image.dob:null;
      const type_of_drone_experience=image?image.type_of_drone_experience:null;
      const honors_and_achievements=image?image.honors_and_achievements:null;
      const duration1=image?image.duration1:null;
      const duration2=image?image.duration2:null;
      const id=image?image._id:null;

  
      console.log('This is the email check for profile');
  
      // Render the profile view with the appropriate data
      res.render('profile', {
        layout: false,
        email,
        imageData,
        name,
        imageContentType,
        mobile_no,
        dob,
        type_of_drone_experience,
        honors_and_achievements,
        duration1,
        duration2,
        id
      });
  
      console.log('This is the email check for profile');
    } catch (error) {
      // Handle any errors that occur during the process
      console.error(error);
      res.status(500).send('Internal Server Error');
    }
  });


/*edit profile*/
router.get('/editprofile', async (req, res) => {
    try {
      const email = req.cookies.email;
  
      // Retrieve the image document from MongoDB based on the email ID
      const image = await Image.findOne({ emailid: email });
  
      // Access the image data and content type from the document
      const imageData = image ? image.img.data : null;
      const imageContentType = image ? image.img.contentType : null;
      const name = image ? image.name : null;
      const mobile_no=image?image.mobile_no:null;
      const dob=image?image.dob:null;
      const type_of_drone_experience=image?image.type_of_drone_experience:null;
      const honors_and_achievements=image?image.honors_and_achievements:null;
      const duration1=image?image.duration1:null;
      const duration2=image?image.duration2:null;
      const id=image?image._id:null;

  
      console.log('This is the email check for profile');
  
     
      res.render('editprofile', {
        layout: false,
        email,
        imageData,
        name,
        imageContentType,
        mobile_no,
        dob,
        type_of_drone_experience,
        honors_and_achievements,
        duration1,
        duration2,
        id
      });
  
      console.log('This is the email check for profile');
    } catch (error) {
      // Handle any errors that occur during the process
      console.error(error);
      res.status(500).send('Internal Server Error');
    }
  });




  /*insert the record*/

  
  var storage = multer.diskStorage({
      destination: (req, file, cb) => {
          cb(null, 'uploads')
      },
      filename: (req, file, cb) => {
          cb(null, file.fieldname + '-' + Date.now())
      }
  });
  var upload = multer({ storage: storage });

  
  router.post('/insertnewprofile', upload.single('image'), (req, res, next) => {

    var obj = {
        name: req.body.name,
        emailid: req.body.emailid,
        mobile_no:req.body.mobile_no,
        dob:req.body.dob,
        duration1:req.body.duration1,
        duration2:req.body.duration2,
        type_of_drone_experience:req.body.type_of_drone_experience,
        honors_and_achievements:req.body.honors_and_achievements,
        
         
        img: {
            data: fs.readFileSync(path.join('uploads/' + req.file.filename)),
            contentType: 'image/png'
        }
    }
    Image.create(obj, (err, items) => {
        if (err) {
            console.log(err);
        }
        else {
            // item.save();
            console.log("Your details inserted succesfully")
            res.redirect("/profile");
        }
    });
});

/*update the pilot details*/
router.get('/update/:id', async (req, res) => {
  try {
    const objectIdToEdit = req.params.id;

    const document = await Image.findById(objectIdToEdit);

    if (document) {
      res.render('editprofile', { layout: false,document:document,aa:req.params.id});
    } else {
      res.status(404).send('Document not found.');
    }
  } catch (error) {
    console.error('Error fetching document:', error);
    res.status(500).send('An error occurred while fetching the document.');
  }
});


router.post('/update/:id', upload.single('image'), async (req, res) => {
  try {
    const objectIdToUpdate = req.params.id;
    const updatedData = req.body;

    // Check if a new image is uploaded
    if (req.file) {
      updatedData.img = {
        data: fs.readFileSync(req.file.path),
        contentType: req.file.mimetype
      };
      fs.unlinkSync(req.file.path);
    }
    console.log("uniiiqueee")
    await pool.query(`update signup set phone_number=$1 where emailid=$2`,[updatedData.mobile_no,updatedData.emailid]);
    console.log("uniiiqueee")
    const result = await Image.findByIdAndUpdate(objectIdToUpdate, updatedData);

    if (result) {
      res.redirect('/profile');
    } else {
      res.status(404).send('Document not found.');
    }
  } catch (error) {
    console.error('Error updating document:', error);
    res.status(500).send('An error occurred while updating the document.');
  }
});
router.get('/logout',(req,res)=>{
    const authcookie=req.cookies.authcookie
    const email=req.cookies.email
    res.clearCookie('authcookie');
    res.redirect('/login');
})





router.post('/signup',async(req,res)=>{
    // const n=await controller.check(req,res);
        
    const h=req.body;
        const y=await controller.signup(req,res);
        console.log(y);
        
        // res.render("signup")
        res.setHeader('ejs','signup')
});

router.post('/upload',upload.single('image_data'),async(req,res,next)=>{
    try{
    const x=await controller.imageupload(req,res,next);
    console.log(x);
    }
    catch(err)
    {
        next(err);
    }
})

router.get('/flying',checkToken,async(req,res)=>{
    
    const data=await controller.droneslistdata(req,res);
    console.log(data);
    const c=await controller.flightdata(req,res);
    console.log(c);
    // res.render("flying",{options:[]});
   
})

router.get('/viewdetails',checkToken,async(req,res)=>{
    
    console.log("working");
    const data=await controller.viewdetails(req,res);
    
    
    res.render('viewdetails',{data});
    
    
})

router.post('/flying',checkToken,async(req,res)=>{
    
    const h=req.body;
    console.log(h)
    console.log("Hi")
    const y=await controller.flying(req,res);
    console.log(y);
    // res.render("login");
    // res.send("Report Submission Done")
    // alert("done");
})

router.post('/crash',checkToken,async(req,res)=>{
    const p=req.body
    console.log(p);
    const t=await controller.crashdetails(req,res);
    console.log(t);
    
    // res.render('crash');
})

router.get('/login',(req,res)=>{
    res.render('login');
})
router.post('/login',async(req,res)=>{
    const h=req.body;
    const y=await controller.logincheck(req,res);
    console.log(y);

    
})

router.get('/api',checkToken,(req,res)=>{
   
    res.render('crash');
})
function checkToken(req,res,next){
    //get authcookie from request

    const authcookie=req.cookies.authcookie
    const email=req.cookies.email
    console.log(email)
    console.log(authcookie)

    //verify token which is in cookie value
    jwt.verify(authcookie,"sfhsfhsfhfsiofhiosghiogjiogjdoghfioghioghfodiofghdfiogh",(err,data)=>{
        if(err){
            res.sendStatus(403)
        }
        else {
           req.user=data;//Set the decoded data in the req.user object
           next();
            
        }
    })
}

  
router.post('/insert_damaged_parts', async (req, res) => {
  try {
    console.log("insert_damaged_parts_router");
    console.log("insert_damaged_parts_router1");
 
    var { flightId, selectedItems } = req.body;
    console.log(req.body);
    console.log("Flight ID:", flightId);
    console.log("Flight ID type:", typeof flightId);
    console.log("Selected Items:", selectedItems);
    // selectedItems = Array.from(selectedItems);
    var item= await controller.insertdamagedparts(req,res);
    
  } catch (err) {
    console.error('Error', err);
    
  }
});   

  router.get('/dashboard',checkToken,async(req,res)=>{
    
    try{
        console.log("Working");
        const { totalDuration,results,crashDetails,crashdetailsrows,trueCount,falseCount,itemcost,flighttime}=await controller.flightdetails(req,res);
        console.log(crashDetails);
        console.log(totalDuration);
        console.log("dashboard details.......")
        console.log(crashdetailsrows)
        console.log('nishmitha......................................')
        console.log(itemcost)
        console.log(flighttime)
        console.log('aditi......................................')
        res.render('dashboard',{totalDuration,results,query4:crashDetails,crashdetails:crashdetailsrows,trueCount,falseCount,itemcost,flighttime})
    }
    catch(err)
    {
        console.log(err);
        res.render('dashboard',{totalDuration:0,results:[],query4:[],crashdetails:[]});
    }
    
  })
  

router.get('/pilotflightdetails',checkToken,async(req,res)=>{
    
  try{
      console.log("Working");
      const { totalDuration,results,crashDetails,crashdetailsrows,cost}=await controller.flightdetails(req,res);
      
      console.log(crashDetails);
      console.log(totalDuration);
      res.render('member_successful_flight_details',{totalDuration,results,query4:crashDetails,crashdetails:crashdetailsrows,cost})
  }
  catch(err)
  {
      console.log(err);
      res.render('member_successful_flight_details',{totalDuration:0,results:[],query4:[],crashdetails:[]});
  }
  
})


router.get('/pilotcrashdetails',checkToken,async(req,res)=>{
    
  try{
      console.log("Working");
      const { totalDuration,results,crashDetails,crashdetailsrows,items_name}=await controller.flightdetails(req,res);
      console.log(crashDetails);
      console.log(totalDuration);
      console.log("hello pilot")
      console.log(crashdetailsrows)
      res.render('member_crash_details',{totalDuration,results,query4:crashDetails,crashdetails:crashdetailsrows,items_name})
  }
  catch(err)
  {
      console.log(err);
      res.render('member_crash_details',{totalDuration:0,results:[],query4:[],crashdetails:[]});
  }
  
})


/*damage cost of each plane*/
router.get('/cost_details', (req, res) => {
  const { flightId } = req.query;

  // Query the database to get the cost details
  const query = `
    SELECT
      SUM(c.items_cost) AS total_cost,
      f.items_name
    FROM
      cost_details c
    JOIN
      flight_crash_items f ON f.items_name = c.items_name
    WHERE
      f.flight_id = $1
    GROUP BY
      f.items_name;
  `;

  // Execute the query
  pool.query(query, [flightId], (err, result) => {
    if (err) {
      console.error('Error executing query:', err);
      res.status(500).json({ error: 'Error retrieving cost details' });
      return;
    }

    const rows = result.rows;

    // Extract the total cost and items name from the query results
    // const totalCost = rows.reduce((acc, row) => acc + row.total_cost, 0);
    const itemsName = rows.map(row => row.items_name);
    const totalCost = rows.map(row => row.total_cost);
    // Construct the response object with the retrieved data
    const responseData = {
      total_cost: totalCost,
      items_name: itemsName
    };

    res.json(responseData);
  });
});








/*admin realted*/
router.get('/pilotprofile',async(req,res)=>{
    res.render("pilotprofile")
})

module.exports=router;
