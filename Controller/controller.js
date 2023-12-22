const express=require('express');
const uuid = require('uuid');
const jwt=require("jsonwebtoken");
const app=express();

const bodyParser = require("body-parser");
const cookieParser = require('cookie-parser')
const router=express.Router();
router.use(bodyParser.urlencoded({extended:true}))
router.use(bodyParser.json())
router.use(cookieParser())


const pool=require("../database");
const { cookie } = require('express/lib/response');
const { use } = require('../Router');
require('dotenv').config();
module.exports.datahere=async(req,res)=>{
    try{
        const k=await pool.query("select * from signup");
        return k.rows;

    }
    catch(err){
        console.log(err)
    }

}

const bcrypt = require('bcrypt');
module.exports.signup=async(req,res)=>{
    try {
        console.log("User Authentication");
        let errors=[];
        let {name,emailid,password,cpassword,phone_number}=req.body;

        console.log({
            name,emailid,password,cpassword,phone_number
        })
       
        if(!name||!emailid||!password||!cpassword||phone_number){
            errors.push({message:"Please enter all fields"})
        }
        if(password.length<=6){
            console.log('not 6 characters')
            errors.push({message:"Password should be of at least 6 characters"});
        }
        if(password!=cpassword){
            errors.push({message:"Password do not match"})
        }
        if(errors.length>0){
            //Forms Validation has passed

            pool.query(`SELECT * FROM signup WHERE emailid=$1`,[emailid],async(err,results)=>{
                if(err){
                    throw err;
                }
                console.log(results.rows);
                if(results.rows.length>0){
                    errors.push({message:"email already registered "})
                    console.log(errors)
                    res.render("signup",{errors})
                    
                }else{
                  try{
                    const hashedpassword= await bcrypt.hash(password,10);
                    const hashedcpassword= await bcrypt.hash(cpassword,10);
                    pool.query("insert into signup (name,emailid,password,cpassword,phone_number)values($1,$2,$3,$4,$5)",[name,emailid,hashedpassword,hashedcpassword,phone_number]);
                    res.redirect('/login')
                  }catch(error){
                    console.log("here is the error");
                    throw error;
                  }
                    
                }
            })
        }
      }
      catch(err){
          console.log(err)
      }
  
  }

module.exports.logincheck = async (req, res) => {
  try {
      console.log("Checking Login Credentials");
      let { emailid, password } = req.body;
      console.log({
          emailid,
          password,
      });

      if (emailid === "infinitydronesadmin@gmail.com" && password === "Admin@2023@infinitydrones") {
          console.log("Admin login successful");
          const token = jwt.sign({ emailid }, 'sfhsfhsfhfsiofhiosghiogjiogjdoghfioghioghfodiofghdfiogh');

          console.log(token);
          res.cookie('authcookie', token, { maxAge: 120 * 60 * 1000, httpOnly: true });
          res.cookie('email', emailid);
          res.redirect('/admin');
        } else {
            pool.query(
                'SELECT * FROM signup WHERE emailid = $1',
                [emailid],
                async (err, results) => {
                    if (err) {
                        throw err;
                    } else {
                        if (results.rows.length > 0) {
                            const storedHashedPassword = results.rows[0].password;
                            const isPasswordMatch = await bcrypt.compare(password, storedHashedPassword);
                            if (isPasswordMatch) {
                                console.log("Successful");
                                const userEmail = results.rows[0].emailid;
                                console.log(userEmail);
                                const token = jwt.sign({ emailid }, 'sfhsfhsfhfsiofhiosghiogjiogjdoghfioghioghfodiofghdfiogh');
                              console.log("tokenhere")
                                console.log(token);
                                console.log("tokenhere2")
                                res.cookie('authcookie', token, { maxAge: 120 * 60 * 1000, httpOnly: true });
                              
                                res.cookie('email', userEmail);
                                console.log("logincheck")
                                res.redirect('/member_dashboard');
                            } else {

                                console.log("Wrong Email password");
                                res.render('login');
                            }
                        } else {
                            console.log("User not found");
                            res.render('login');
                        }
                    }
                }
            );
        }
    } catch (err) {
        console.log(err);
    }
};  



module.exports.flightdata=async(req,res)=>{
    try{
        const k=await pool.query("select * from flight_description");
        return k.rows;

    }
    catch(err){
        return{k:[]}
    }

}

module.exports.flying=async(req,res)=>{
    try{
        const answer=req.body.answer;
        console.log(answer)
        const selectedDroneId=req.body.drone_id;  
        console.log(selectedDroneId)
        const [drone_name,droneId]=selectedDroneId.split('-');
        console.log(drone_name,droneId)
        
        
            const query1= await pool.query(`SELECT drone_id FROM drones WHERE drone_name=$1`,[drone_name]);
            console.log(query1.rows);
            console.log(query1[2])

        if(answer==='yes'){
        console.log("let's fly");
        var{flight_id,emailid,copilot,duration,date,mode,batteryid,takeoffvoltage,landingvoltage,windspeed,winddirection,drone_id,flightdescription,result}=req.body
        console.log(req.body)
        var result=true;
        var y=await pool.query(`INSERT INTO flight_description (flight_id,emailid,copilot,duration,date,mode,batteryid,takeoffvoltage,landingvoltage,windspeed,winddirection,drone_id,flightdescription,result) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14)`,[flight_id,emailid,copilot,duration,date,mode,batteryid,takeoffvoltage,landingvoltage,windspeed,winddirection,drone_id,flightdescription,result]);
        console.log(y);
        res.redirect('/pilotflightdetails')
        }
        else if(answer==='no'){
            var{flight_id,emailid,copilot,duration,date,mode,batteryid,takeoffvoltage,landingvoltage,windspeed,winddirection,drone_id,flightdescription,result}=req.body
            var result=false;
            var n=await pool.query(`INSERT INTO flight_description (flight_id,emailid,copilot,duration,date,mode,batteryid,takeoffvoltage,landingvoltage,windspeed,winddirection,drone_id,flightdescription,result) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14)`,[flight_id,emailid,copilot,duration,date,mode,batteryid,takeoffvoltage,landingvoltage,windspeed,winddirection,drone_id,flightdescription,result]);
            console.log("Insertion Successful")
        console.log(n);
        const email=req.cookies.email
        console.log(email);
        const autoid=req.cookies.autoid
        console.log(autoid)
        const selectedDroneId=req.body.drone_id;  
        console.log(selectedDroneId)
        const rest=await pool.query(`select drone_name from drones WHERE drone_id=$1`,[drone_id]);
        const drone_name = rest.rows[0].drone_name;
        console.log(drone_name);
        
       
    
          res.render('crash', {
            email: email,
            autoid: autoid,
            drone_name: drone_name, // Pass the retrieved drone_name to the template
          });
        } else {
          res.status(400).send("Invalid answer");
        }
      } catch (err) {
        console.log(err);
        
        res.status(500).send("Internal Server Error");
      }
    }
  



//         const query=pool.query(`SELECT drone_name FROM drones WHERE drone_id=?`,[req.body.drone_id]);
//         const [rows] = query(query, [drone_id]);
//         if (rows.length > 0) {
//           const drone_name = rows[0].drone_name;
//           res.render('crash', {
//             email: email,
//             autoid: autoid,
//             drone_name: drone_name, // Pass the retrieved drone_name to the template
//           });

//         }
//             // res.render('crash',{email:email,autoid:autoid,});
//         }
//         else{
//             res.status(400).send("Invalid answer'")
//         }
//     }
//     catch(err){
//         console.log(err)
//     }
// }
module.exports.droneslistdata=async(req,res)=>{
    
    if(!req.cookies.authcookie)
    {
        return res.status(403).render('login', {message: 'Token Expired'});

    }
    else {
        const authcookie=await jwt.verify(req.cookies.authcookie,'sfhsfhsfhfsiofhiosghiogjiogjdoghfioghioghfodiofghdfiogh')
        console.log(authcookie)
        if(authcookie.iat - new Date().getTime() < 60000){

    try{
        const {rows}=await pool.query("SELECT drone_name,drone_id FROM drones");
        console.log({rows})
        const {rows:batteries}=await pool.query("SELECT batteryid FROM batterylist");
        console.log({rows:batteries})
        const{rows:winddirection}=await pool.query("SELECT winddirection FROM winddirection");
        console.log({rows:winddirection})
        console.log("Hi")
        // const list=rows.map(row=>row.drone_id);
        const list = rows.map(row => ({ droneName: row.drone_name, droneId: row.drone_id }))
        console.log(list)
        const email=req.cookies.email
        console.log(email);
        const userId = uuid.v4()
        res.cookie('autoid',userId);
        res.render('flying',{options:list,email:email,userId:userId,batteries:batteries,direction:winddirection})
        /*function generateShortId() {
            const timestamp = Date.now().toString(36); // Convert current timestamp to base36 string
            const randomNumber = Math.floor(Math.random() * 10000).toString(36); // Generate random number and convert to base36 string
            const id = timestamp + randomNumber; // Combine timestamp and random number
            return id;
          }
          
          // Usage
          const userId = generateShortId();
          console.log(userId);
          */
          
    }
    catch(err){
        console.log(err)
    }
    }
    else
    {
        return res.send({code:404 ,message:'Token Expired'})
    }
}

}
module.exports.crashdetails=async(req,res)=>{
    try{
        console.log("Crash Details Submission");
        let {drone_name,emailid,pilot_id,flight_id,reason}=req.body;
        console.log({
            drone_name,emailid,pilot_id,flight_id,reason
        })
        pool.query('INSERT INTO crash (drone_name,emailid,flight_id,reason)values($1,$2,$3,$4)',[drone_name,emailid,flight_id,reason]);
        console.log("Submission Successful");
        res.redirect('/pilotcrashdetails');
    }
    catch(err){
        console.log(err)
    }
}
module.exports.imageupload=async(req,res,next)=>{
    try{
    const imageData=req.file.buffer;
    const query={
        text:'INSERT INTO image (image_data) values ($1)',
        values:[imageData]
    };
    const result=await pool.query(query);
    res.json({id:result.rows[0].id})
}

catch(err){
next(err);
    // pool.query(query)
    // .then(result=>res.json({id:result.rows[0].id}))
    // .catch(err=>next(err));
}
};

module.exports.viewdetails=async(req,res)=>{
    try{
        const email=req.cookies.email
        console.log(email);
        const k=await pool.query(`SELECT * FROM flight_description WHERE emailid=$1`,[email]);
        return k.rows;
    }
    catch(err){
        console.log(err);
    }
}
module.exports.dashboard = async (req, res) => {
    try {
      const email = req.cookies.email;
      console.log(email);
  
      // Get all drone IDs and names
      const droneQuery = await pool.query(`SELECT drone_id, drone_name FROM drones`);
      const drones = droneQuery.rows;
  
      // Get flight durations for each drone and calculate the total duration
      const results = [];
      let totalDuration = 0;
  
      for (const drone of drones) {
        const planeId = drone.drone_id;
        const droneName = drone.drone_name;
  
        const durationQuery = await pool.query(
          `SELECT duration FROM flight_description WHERE drone_id = $1 AND emailid = $2`,
          [planeId, email]
        );


  
        const durations = durationQuery.rows.map(row => parseInt(row.duration, 10));
        const droneDuration = durations.reduce((acc, curr) => acc + curr, 0);
  
        results.push({
          planeId,
          droneName,
          duration: droneDuration, // Modified: Use the sum of durations for the drone
        });
  
        totalDuration += droneDuration;
      }
  
      console.log(results);
      console.log(totalDuration);
        const query4=await pool.query(`SELECT
        fd.flight_id,
        fd.mode,
        fd.date,
        fd.drone_id,
        fd.emailid,
        fd.duration,
        fd.result,
        fd.batteryid,
        fd.takeoffvoltage,
        fd.landingvoltage,
        fd.windspeed,
        fd.winddirection,
        d.drone_name
      FROM
        flight_description fd
      JOIN
        drones d ON d.drone_id = fd.drone_id
      WHERE
        fd.result = true
        AND fd.emailid = '${email}';
      `);
        console.log(query4)
        const crashDetails=query4.rows;
        const droneId=crashDetails[0].drone_id;
        const crashdetails = await pool.query(`
  SELECT
    flight_description.drone_id,
    drones.drone_name,
    flight_description.flight_id,
    flight_description.mode,
    flight_description.date,
    flight_description.duration,
    flight_description.emailid,
    flight_description.result,
   
  FROM
    flight_description
  JOIN
    drones ON flight_description.drone_id = drones.drone_id
  WHERE
    flight_description.emailid = '${email}' AND
    flight_description.result = false
`);

const items_cost=await pool.query('select * from cost_details');

        console.log("me here")
        console.log(crashdetails)
        // const crashdetails1=await pool.query(`SELECT * FROM crash where emailid=$1`,[email]);
        // var damagedParts="";
        console.log("H")
        console.log("H")
        console.log("h")
        // crashdetails1.rows.forEach(row => {
        //     damagedParts = row.damaged_parts;
        //     console.log(damagedParts)
        //     // Process each row's damaged_parts value
        //   });
        // console.log(damagedParts)
        // const mergedCrashDetails = {
        //     ...crashdetails,
        //     rows: crashdetails.rows.map(row => ({ ...row })),
        //     damagedParts: damagedParts
        //   };
        const crashdetailsrows=crashdetails.rows;
        console.log("checking crash details.......................")
        console.log(crashdetailsrows)
        
        // console.log("H")
        console.log(query4.drone_id);
        console.log(droneId)
        console.log("here controller",crashdetailsrows)
        return {totalDuration,results,crashDetails,crashdetailsrows};
        // let query3;
        // for(let i=0;i<query2.rows.length;i++)
        // {
        //     const dur=query2.rows[i];
        //     query3=await pool.query(`SELECT duration FROM flight_description WHERE drone_id=$1`,[dur]);
        // }
        
        // return k.rows;
        

    }
    catch(err)
    {
        console.log(err);
        return {totalDuration:0,results:[],query4:[],crashdetails:[]}
    }
}


module.exports.datahere=async(req,res)=>{
    try{
        const k=await pool.query("select * from signup");
        return k.rows;

    }
    catch(err){
        console.log(err)
    }

}


module.exports.signup=async(req,res)=>{
    try {
        console.log("User Authentication");
        let errors=[];
        let {name,emailid,password,cpassword,phone_number}=req.body;

        console.log({
            name,emailid,password,cpassword,phone_number
        })
       
        if(!name||!emailid||!password||!cpassword||phone_number){
            errors.push({message:"Please enter all fields"})
        }
        if(password.length<=6){
            console.log('not 6 characters')
            errors.push({message:"Password should be of at least 6 characters"});
        }
        if(password!=cpassword){
            errors.push({message:"Password do not match"})
        }
        if(errors.length>0){
            //Forms Validation has passed

            pool.query(`SELECT * FROM signup WHERE emailid=$1`,[emailid],async(err,results)=>{
                if(err){
                    throw err;
                }
                console.log(results.rows);
                if(results.rows.length>0){
                    errors.push({message:"email already registered "})
                    console.log(errors)
                    res.render("signup",{errors})
                    
                }else{
                  try{
                    const hashedpassword= await bcrypt.hash(password,10);
                    const hashedcpassword= await bcrypt.hash(cpassword,10);
                    pool.query("insert into signup (name,emailid,password,cpassword,phone_number)values($1,$2,$3,$4,$5)",[name,emailid,hashedpassword,hashedcpassword,phone_number]);
                    res.redirect('/login')
                  }catch(error){
                    console.log("here is the error");
                    throw error;
                  }
                    
                }
            })
        }
      }
      catch(err){
          console.log(err)
      }
  
  }



       
module.exports.logincheck = async (req, res) => {
  try {
      console.log("Checking Login Credentials");
      let { emailid, password } = req.body;
      console.log({
          emailid,
          password,
      });

      if (emailid === "infinitydronesadmin@gmail.com" && password === "Admin@2023@infinitydrones") {
          console.log("Admin login successful");
          const token = jwt.sign({ emailid }, 'sfhsfhsfhfsiofhiosghiogjiogjdoghfioghioghfodiofghdfiogh');

          console.log(token);
          res.cookie('authcookie', token, { maxAge: 120 * 60 * 1000, httpOnly: true });
          res.cookie('email', emailid);
          res.redirect('/admin');
        } else {
            pool.query(
                'SELECT * FROM signup WHERE emailid = $1',
                [emailid],
                async (err, results) => {
                    if (err) {
                        throw err;
                    } else {
                        if (results.rows.length > 0) {
                            const storedHashedPassword = results.rows[0].password;
                            const isPasswordMatch = await bcrypt.compare(password, storedHashedPassword);
                            if (isPasswordMatch) {
                                console.log("Successful");
                                const userEmail = results.rows[0].emailid;
                                console.log(userEmail);
                                const token = jwt.sign({ emailid }, 'sfhsfhsfhfsiofhiosghiogjiogjdoghfioghioghfodiofghdfiogh');
                              console.log("tokenhere")
                                console.log(token);
                                console.log("tokenhere2")
                                res.cookie('authcookie', token, { maxAge: 120 * 60 * 1000, httpOnly: true });
                              
                                res.cookie('email', userEmail);
                                console.log("logincheck")
                                res.redirect('/member_dashboard');
                            } else {

                                console.log("Wrong Email password");
                                res.render('login');
                            }
                        } else {
                            console.log("User not found");
                            res.render('login');
                        }
                    }
                }
            );
        }
    } catch (err) {
        console.log(err);
    }
};  


module.exports.damageditemscostgraph= async (req, res) => {
  try {
    const email = req.cookies.email;
   console.log("hello welcome..................")
   var itemcost = await pool.query('SELECT cost_details.items_name as label, SUM(cost_details.items_cost) AS value FROM cost_details AS cost_details JOIN crash AS crash ON cost_details.items_name = crash.damaged_parts WHERE crash.emailid =$1 GROUP BY cost_details.items_name',[email]);
    return itemcost.rows;
    
  }
  catch (e) {
    console.error(e)
    res.json({
      errors: 'Invalid'
    });

  }
}




module.exports.flightdata=async(req,res)=>{
    try{
        const k=await pool.query("select * from flight_description");
        return k.rows;

    }
    catch(err){
        return{k:[]}
    }

}

module.exports.flying=async(req,res)=>{
    try{
        const answer=req.body.answer;
        console.log(answer)
        const selectedDroneId=req.body.drone_id;  
        console.log(selectedDroneId)
        const [drone_name,droneId]=selectedDroneId.split('-');
        console.log(drone_name,droneId)
        
        
            const query1= await pool.query(`SELECT drone_id FROM drones WHERE drone_name=$1`,[drone_name]);
            console.log(query1.rows);
            console.log(query1[2])

        if(answer==='yes'){
        console.log("let's fly");
        var{flight_id,emailid,copilot,duration,date,mode,batteryid,takeoffvoltage,landingvoltage,windspeed,winddirection,drone_id,flightdescription,result}=req.body
        console.log(req.body)
        var result=true;
        var y=await pool.query(`INSERT INTO flight_description (flight_id,emailid,copilot,duration,date,mode,batteryid,takeoffvoltage,landingvoltage,windspeed,winddirection,drone_id,flightdescription,result) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14)`,[flight_id,emailid,copilot,duration,date,mode,batteryid,takeoffvoltage,landingvoltage,windspeed,winddirection,drone_id,flightdescription,result]);
        console.log(y);
        res.redirect('/pilotflightdetails')
        }
        else if(answer==='no'){
            var{flight_id,emailid,copilot,duration,date,mode,batteryid,takeoffvoltage,landingvoltage,windspeed,winddirection,drone_id,flightdescription,result}=req.body
            var result=false;
            var n=await pool.query(`INSERT INTO flight_description (flight_id,emailid,copilot,duration,date,mode,batteryid,takeoffvoltage,landingvoltage,windspeed,winddirection,drone_id,flightdescription,result) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14)`,[flight_id,emailid,copilot,duration,date,mode,batteryid,takeoffvoltage,landingvoltage,windspeed,winddirection,drone_id,flightdescription,result]);
            console.log("Insertion Successful")
        console.log(n);
        const email=req.cookies.email
        console.log(email);
        const autoid=req.cookies.autoid
        console.log(autoid)
        const selectedDroneId=req.body.drone_id;  
        console.log(selectedDroneId)
        const rest=await pool.query(`select drone_name from drones WHERE drone_id=$1`,[drone_id]);
        const drone_name = rest.rows[0].drone_name;
        console.log(drone_name);
        
       
    
          res.render('crash', {
            email: email,
            autoid: autoid,
            drone_name: drone_name, // Pass the retrieved drone_name to the template
          });
        } else {
          res.status(400).send("Invalid answer");
        }
      } catch (err) {
        console.log(err);
        
        res.status(500).send("Internal Server Error");
      }
    }
  



//         const query=pool.query(`SELECT drone_name FROM drones WHERE drone_id=?`,[req.body.drone_id]);
//         const [rows] = query(query, [drone_id]);
//         if (rows.length > 0) {
//           const drone_name = rows[0].drone_name;
//           res.render('crash', {
//             email: email,
//             autoid: autoid,
//             drone_name: drone_name, // Pass the retrieved drone_name to the template
//           });

//         }
//             // res.render('crash',{email:email,autoid:autoid,});
//         }
//         else{
//             res.status(400).send("Invalid answer'")
//         }
//     }
//     catch(err){
//         console.log(err)
//     }
// }
module.exports.droneslistdata=async(req,res)=>{
    
    if(!req.cookies.authcookie)
    {
        return res.status(403).render('login', {message: 'Token Expired'});

    }
    else {
        const authcookie=await jwt.verify(req.cookies.authcookie,'sfhsfhsfhfsiofhiosghiogjiogjdoghfioghioghfodiofghdfiogh')
        console.log(authcookie)
        if(authcookie.iat - new Date().getTime() < 60000){

    try{
        const {rows}=await pool.query("SELECT drone_name,drone_id FROM drones");
        console.log({rows})
        const {rows:batteries}=await pool.query("SELECT batteryid FROM batterylist");
        console.log({rows:batteries})
        const{rows:winddirection}=await pool.query("SELECT winddirection FROM winddirection");
        console.log({rows:winddirection})
        console.log("Hi")
        // const list=rows.map(row=>row.drone_id);
        const list = rows.map(row => ({ droneName: row.drone_name, droneId: row.drone_id }))
        console.log(list)
        const email=req.cookies.email
        console.log(email);
        const userId = uuid.v4()
        res.cookie('autoid',userId);
        res.render('flying',{options:list,email:email,userId:userId,batteries:batteries,direction:winddirection})
        /*function generateShortId() {
            const timestamp = Date.now().toString(36); // Convert current timestamp to base36 string
            const randomNumber = Math.floor(Math.random() * 10000).toString(36); // Generate random number and convert to base36 string
            const id = timestamp + randomNumber; // Combine timestamp and random number
            return id;
          }
          
          // Usage
          const userId = generateShortId();
          console.log(userId);
          */
          
    }
    catch(err){
        console.log(err)
    }
    }
    else
    {
        return res.send({code:404 ,message:'Token Expired'})
    }
}

}
module.exports.crashdetails=async(req,res)=>{
    try{
        console.log("Crash Details Submission");
        let {drone_name,emailid,pilot_id,flight_id,reason}=req.body;
        console.log({
            drone_name,emailid,pilot_id,flight_id,reason
        })
        pool.query('INSERT INTO crash (drone_name,emailid,flight_id,reason)values($1,$2,$3,$4)',[drone_name,emailid,flight_id,reason]);
        console.log("Submission Successful");
        res.redirect('/pilotcrashdetails');
    }
    catch(err){
        console.log(err)
    }
}
module.exports.imageupload=async(req,res,next)=>{
    try{
    const imageData=req.file.buffer;
    const query={
        text:'INSERT INTO image (image_data) values ($1)',
        values:[imageData]
    };
    const result=await pool.query(query);
    res.json({id:result.rows[0].id})
}

catch(err){
next(err);
    // pool.query(query)
    // .then(result=>res.json({id:result.rows[0].id}))
    // .catch(err=>next(err));
}
};

module.exports.viewdetails=async(req,res)=>{
    try{
        const email=req.cookies.email
        console.log(email);
        const k=await pool.query(`SELECT * FROM flight_description WHERE emailid=$1`,[email]);
        return k.rows;
    }
    catch(err){
        console.log(err);
    }
}
module.exports.dashboard = async (req, res) => {
    try {
      const email = req.cookies.email;
      console.log(email);
  
      // Get all drone IDs and names
      const droneQuery = await pool.query(`SELECT drone_id, drone_name FROM drones`);
      const drones = droneQuery.rows;
  
      // Get flight durations for each drone and calculate the total duration
      const results = [];
      let totalDuration = 0;
  
      for (const drone of drones) {
        const planeId = drone.drone_id;
        const droneName = drone.drone_name;
  
        const durationQuery = await pool.query(
          `SELECT duration FROM flight_description WHERE drone_id = $1 AND emailid = $2`,
          [planeId, email]
        );


  
        const durations = durationQuery.rows.map(row => parseInt(row.duration, 10));
        const droneDuration = durations.reduce((acc, curr) => acc + curr, 0);
  
        results.push({
          planeId,
          droneName,
          duration: droneDuration, // Modified: Use the sum of durations for the drone
        });
  
        totalDuration += droneDuration;
      }
  
      console.log(results);
      console.log(totalDuration);
        const query4=await pool.query(`SELECT
        fd.flight_id,
        fd.mode,
        fd.date,
        fd.drone_id,
        fd.emailid,
        fd.duration,
        fd.result,
        fd.batteryid,
        fd.takeoffvoltage,
        fd.landingvoltage,
        fd.windspeed,
        fd.winddirection,
        fd.flightdescription,
        d.drone_name
      FROM
        flight_description fd
      JOIN
        drones d ON d.drone_id = fd.drone_id
      WHERE
        fd.result = true
        AND fd.emailid = '${email}';
      `);
        console.log(query4)
        const crashDetails=query4.rows;
        const droneId=crashDetails[0].drone_id;
        const crashdetails = await pool.query(`
  SELECT
    flight_description.drone_id,
    drones.drone_name,
    flight_description.flight_id,
    flight_description.mode,
    flight_description.date,
    flight_description.duration,
    flight_description.emailid,
    flight_description.result,
   
  FROM
    flight_description
  JOIN
    drones ON flight_description.drone_id = drones.drone_id
  WHERE
    flight_description.emailid = '${email}' AND
    flight_description.result = false
`);

const items_cost=await pool.query('select * from cost_details');

        console.log("me here")
        console.log(crashdetails)
        // const crashdetails1=await pool.query(`SELECT * FROM crash where emailid=$1`,[email]);
        // var damagedParts="";
        console.log("H")
        console.log("H")
        console.log("h")
        // crashdetails1.rows.forEach(row => {
        //     damagedParts = row.damaged_parts;
        //     console.log(damagedParts)
        //     // Process each row's damaged_parts value
        //   });
        // console.log(damagedParts)
        // const mergedCrashDetails = {
        //     ...crashdetails,
        //     rows: crashdetails.rows.map(row => ({ ...row })),
        //     damagedParts: damagedParts
        //   };
        const crashdetailsrows=crashdetails.rows;
        console.log("checking crash details.......................")
        console.log(crashdetailsrows)
        
        // console.log("H")
        console.log(query4.drone_id);
        console.log(droneId)
        console.log("here controller",crashdetailsrows)
        return {totalDuration,results,crashDetails,crashdetailsrows};
        // let query3;
        // for(let i=0;i<query2.rows.length;i++)
        // {
        //     const dur=query2.rows[i];
        //     query3=await pool.query(`SELECT duration FROM flight_description WHERE drone_id=$1`,[dur]);
        // }
        
        // return k.rows;
        

    }
    catch(err)
    {
        console.log(err);
        return {totalDuration:0,results:[],query4:[],crashdetails:[]}
    }
}

    


module.exports.insertdamagedparts = async (req,res) => {
  try {
    console.log("Crash item details submission");
    var { flightId, selectedItems } = req.body;
    console.log({
      flightId,
      selectedItems
    });

    // Convert single item into an array
    if (typeof selectedItems === 'string') {
      selectedItems = [selectedItems];
    }
    await pool.query(`delete from flight_crash_items where flight_id=$1`,[flightId]);
    for (var item of selectedItems) {
      
      await pool.query('INSERT INTO flight_crash_items (flight_id, items_name) VALUES ($1, $2)', [flightId, item]);
    }

    console.log("Submission Successful");
    res.redirect('/pilotcrashdetails');
  } catch (err) {
    console.log(err);
  }
};


//succesful flights
module.exports.flightdetails = async (req, res) => {
  try {
    const email = req.cookies.email;
    console.log(email);

    // Get all drone IDs and names
    const droneQuery = await pool.query(`SELECT drone_id, drone_name FROM drones`);
    const drones = droneQuery.rows;

    // Get flight durations for each drone and calculate the total duration
    const results = [];
    let totalDuration = 0;

    for (const drone of drones) {
      const planeId = drone.drone_id;
      const droneName = drone.drone_name;

      const durationQuery = await pool.query(
        `SELECT duration FROM flight_description WHERE drone_id = $1 AND emailid = $2`,
        [planeId, email]
      );
      
      const durations = durationQuery.rows.map(row => parseInt(row.duration, 10));
      const droneDuration = durations.reduce((acc, curr) => acc + curr, 0);

      results.push({
        planeId,
        droneName,
        duration: droneDuration, // Modified: Use the sum of durations for the drone
      });

      totalDuration += droneDuration;
    }

    console.log(results);
    console.log(totalDuration);

    const trueCountQuery = await pool.query(
      "SELECT COUNT(flight_id) AS trueCount FROM flight_description WHERE result='true' AND emailid=$1",
      [email]
    );
    const falseCountQuery = await pool.query(
      "SELECT COUNT(flight_id) AS falseCount FROM flight_description WHERE result='false' AND emailid=$1",
      [email]
    );

    const trueCount = trueCountQuery.rows[0].truecount;
    const falseCount = falseCountQuery.rows[0].falsecount;
     
    const itemcostQuery = await pool.query('SELECT cost_details.items_name as label, SUM(cost_details.items_cost) AS value FROM cost_details AS cost_details JOIN crash AS crash ON cost_details.items_name = crash.damaged_parts WHERE crash.emailid =$1 GROUP BY cost_details.items_name', [email]);
    const itemcost = itemcostQuery.rows.map(item => ({
      label: item.label,
      value: parseFloat(item.value)
    }));
    
    console.log(itemcost);

    const query4 = await pool.query(`
      SELECT
        fd.flight_id,
        fd.mode,
        fd.date,
        fd.drone_id,
        fd.emailid,
        fd.duration,
        fd.result,
        fd.batteryid,
        fd.takeoffvoltage,
        fd.landingvoltage,
        fd.windspeed,
        fd.winddirection,
        fd.copilot,
        fd.flightdescription,
        d.drone_name
      
      FROM
        flight_description fd
      JOIN
        drones d ON d.drone_id = fd.drone_id
      WHERE
        fd.result = true
        AND fd.emailid = $1;
    `, [email]);
    console.log("ssusssuuuuiiiiiii");
    console.log(query4);
    const crashDetails = query4.rows;
    const droneId = crashDetails[0].drone_id;

    const crashdetails = await pool.query(`
      	
	
	
	SELECT
  fd.drone_id,
  d.drone_name,
  fd.flight_id,
  fd.mode,
  fd.date,
  fd.duration,
  fd.emailid,
  fd.result,
  fd.copilot,
  fd.takeoffvoltage,
  fd.landingvoltage,
  fd.flightdescription,
  c.total_cost
FROM
  flight_description fd
JOIN
  drones d ON fd.drone_id = d.drone_id
LEFT JOIN
  (
      SELECT
          SUM(c.items_cost) AS total_cost,
          f.flight_id
      FROM
          cost_details c
      JOIN
          flight_crash_items f ON f.items_name = c.items_name
      GROUP BY
          f.flight_id
  ) AS c ON c.flight_id = fd.flight_id
WHERE
  fd.emailid = $1
  AND fd.result = false;
    `, [email]);

    const items_name=(await pool.query('select items_name from cost_details')).rows;

    const crashdetailsrows = crashdetails.rows;
    console.log("hello this is crash details...........")
    console.log(crashdetailsrows);
    console.log("hello this is crash details...........")
    const flighttime = await pool.query(
      'SELECT drone_name AS label, SUM(duration) AS count FROM flight_description, drones WHERE flight_description.drone_id = drones.drone_id AND emailid = $1 GROUP BY drones.drone_name',
      [email]
    );
    console.log("items_name in controller........")
    console.log(items_name)
    console.log("items_name in controller........")
    

    return { totalDuration, results, crashDetails, crashdetailsrows, trueCount, falseCount, itemcost,flighttime ,items_name};
  } catch (err) {
    console.log('In controller catch..............')
    console.log(err);
    return { totalDuration: 0, results: [], query4: [], crashdetails: [], trueCount: 0, falseCount: 0, itemcost: [] ,flighttime:[]};
  }
};




//succesful flights
module.exports.flightdetails = async (req, res) => {
  try {
    const email = req.cookies.email;
    console.log(email);

    // Get all drone IDs and names
    const droneQuery = await pool.query(`SELECT drone_id, drone_name FROM drones`);
    const drones = droneQuery.rows;

    // Get flight durations for each drone and calculate the total duration
    const results = [];
    let totalDuration = 0;

    for (const drone of drones) {
      const planeId = drone.drone_id;
      const droneName = drone.drone_name;

      const durationQuery = await pool.query(
        `SELECT duration FROM flight_description WHERE drone_id = $1 AND emailid = $2`,
        [planeId, email]
      );
      
      const durations = durationQuery.rows.map(row => parseInt(row.duration, 10));
      const droneDuration = durations.reduce((acc, curr) => acc + curr, 0);

      results.push({
        planeId,
        droneName,
        duration: droneDuration, // Modified: Use the sum of durations for the drone
      });

      totalDuration += droneDuration;
    }

    console.log(results);
    console.log(totalDuration);

    const trueCountQuery = await pool.query(
      "SELECT COUNT(flight_id) AS trueCount FROM flight_description WHERE result='true' AND emailid=$1",
      [email]
    );
    const falseCountQuery = await pool.query(
      "SELECT COUNT(flight_id) AS falseCount FROM flight_description WHERE result='false' AND emailid=$1",
      [email]
    );

    const trueCount = trueCountQuery.rows[0].truecount;
    const falseCount = falseCountQuery.rows[0].falsecount;
     
    const itemcostQuery = await pool.query('SELECT cost_details.items_name as label, SUM(cost_details.items_cost) AS value FROM cost_details AS cost_details JOIN crash AS crash ON cost_details.items_name = crash.damaged_parts WHERE crash.emailid =$1 GROUP BY cost_details.items_name', [email]);
    const itemcost = itemcostQuery.rows.map(item => ({
      label: item.label,
      value: parseFloat(item.value)
    }));
    
    console.log(itemcost);

    const query4 = await pool.query(`
      SELECT
        fd.flight_id,
        fd.mode,
        fd.date,
        fd.drone_id,
        fd.emailid,
        fd.duration,
        fd.result,
        fd.batteryid,
        fd.takeoffvoltage,
        fd.landingvoltage,
        fd.windspeed,
        fd.winddirection,
        fd.copilot,
        fd.flightdescription,
        d.drone_name
      
      FROM
        flight_description fd
      JOIN
        drones d ON d.drone_id = fd.drone_id
      WHERE
        fd.result = true
        AND fd.emailid = $1;
    `, [email]);
    console.log("SSSSUIIIIII")
    console.log(query4);
    const crashDetails = query4.rows;
    const droneId = crashDetails[0].drone_id;

    const crashdetails = await pool.query(`
      	
	
	
	SELECT
  fd.drone_id,
  d.drone_name,
  fd.flight_id,
  fd.mode,
  fd.date,
  fd.duration,
  fd.emailid,
  fd.result,
  fd.copilot,
  fd.takeoffvoltage,
 fd.landingvoltage,
 fd.flightdescription,
  c.total_cost
FROM
  flight_description fd
JOIN
  drones d ON fd.drone_id = d.drone_id
LEFT JOIN
  (
      SELECT
          SUM(c.items_cost) AS total_cost,
          f.flight_id
      FROM
          cost_details c
      JOIN
          flight_crash_items f ON f.items_name = c.items_name
      GROUP BY
          f.flight_id
  ) AS c ON c.flight_id = fd.flight_id
WHERE
  fd.emailid = $1
  AND fd.result = false;
    `, [email]);

    const items_name=(await pool.query('select items_name from cost_details')).rows;

    const crashdetailsrows = crashdetails.rows;
    console.log("hello this is crash details...........")
    console.log(crashdetailsrows);
    console.log("hello this is crash details...........")
    const flighttime = await pool.query(
      'SELECT drone_name AS label, SUM(duration) AS count FROM flight_description, drones WHERE flight_description.drone_id = drones.drone_id AND emailid = $1 GROUP BY drones.drone_name',
      [email]
    );
    console.log("items_name in controller........")
    console.log(items_name)
    console.log("items_name in controller........")
    

    return { totalDuration, results, crashDetails, crashdetailsrows, trueCount, falseCount, itemcost,flighttime ,items_name};
  } catch (err) {
    console.log('In controller catch..............')
    console.log(err);
    return { totalDuration: 0, results: [], query4: [], crashdetails: [], trueCount: 0, falseCount: 0, itemcost: [] ,flighttime:[]};
  }
};


module.exports.damageditemscostgraph= async (req, res) => {
  try {
    const email = req.cookies.email;
   console.log("hello welcome..................")
   var itemcost = await pool.query('SELECT cost_details.items_name as label, SUM(cost_details.items_cost) AS value FROM cost_details AS cost_details JOIN crash AS crash ON cost_details.items_name = crash.damaged_parts WHERE crash.emailid =$1 GROUP BY cost_details.items_name',[email]);
    return itemcost.rows;
    
  }
  catch (e) {
    console.error(e)
    res.json({
      errors: 'Invalid'
    });

  }
}

