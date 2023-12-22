const express=require('express');
const app=express();
const expressLayouts = require("express-ejs-layouts");
const bodyparser = require('body-parser');
const cookieParser = require("cookie-parser");
const dotenv = require("dotenv");

const cron = require('node-cron');
const { extract_call_details } = require('./Controller/call_controller');
const cronSchedule = '* * * * *'; // Runs every 1 minutes
console.log('running a task every minute');

// Create a cron job
var jobcron = cron.schedule(cronSchedule, async () => {
  try {
    await extract_call_details();
    console.log("call executed");
  } catch (error) {
    console.error(error);
  }
});



//app.use(signup)
app.set('view engine','ejs');
app.use(express.urlencoded({extended: false}));



app.use('/login',require('./Router/index'))
app.use('/flying',require('./Router/index'))
app.use('/',require('./Router/index'))
app.use('/api',require('./Router/index'))
app.use('/upload',require('./Router/index'))
app.use('/pilotprofile',require('./Router/index'))
app.use('/result',require('./Router/index'))
app.use('/editprofile',require('./Router/index'))
app.use('/insertnewprofile',require('./Router/index'))
app.use('/update/:id',require('./Router/index'))
app.use('/pilotflightdetails',require('./Router/index'))
app.use('/pilotcrashdetails',require('./Router/index'))
app.use('/insert_damaged_parts',require('./Router/index'))
app.use('/cost_details',require('./Router/index'))

app.use('/view_flight_form',require('./Router/flight_schedule_router'))
app.use('/reschedule_flight',require('./Router/flight_schedule_router'))
app.use('/add_flight_schedule',require('./Router/flight_schedule_router'))
app.use('/',require('./Router/flight_schedule_router'))

//admin dashboard
app.use('/admin',require('./Router/admin_dashboard_router'))
app.use('/',require('./Router/admin_dashboard_router'))

app.use('/',require('./Router/member_dashboard_router'))
app.use('/member_dashboard',require('./Router/admin_dashboard_router'))

//admin access to pilot profile
app.use('/pilotprofile',require('./Router/index'))


//flight details
app.use('/addflightdetails',require('./Router/admin_flightdetails_router'))
app.use("/",require("./Router/admin_flightdetails_router"));
app.use('/view_flight_details',require('./Router/admin_flightdetails_router'))
app.use('/add_flightdetails',require('./Router/admin_flightdetails_router'))
app.use('/all_flightdetails',require('./Router/admin_flightdetails_router'))
app.use('/newflightdetails',require('./Router/admin_flightdetails_router'))
app.use('/crashdetails',require('./Router/admin_flightdetails_router')) 
app.use('/edit_succesfulflightdetails',require('./Router/admin_flightdetails_router'))
app.use('/',require('./Router/admin_flightdetails_router')) 
app.use('/edit_crashdetails',require('./Router/admin_flightdetails_router'))
app.use('/flightdetails',require('./Router/admin_flightdetails_router'))
app.use('/add_successful_flight_details',require('./Router/admin_flightdetails_router'))
app.use('/add_crash_details',require('./Router/admin_flightdetails_router'))

//flight schedules
app.use('/scheduleflights',require('./Router/admin_flightschedule_router'))
app.use("/",require("./Router/admin_flightschedule_router"));
app.use('/view_flight_forms',require('./Router/admin_flightschedule_router'))
app.use('/add_flight',require('./Router/admin_flightschedule_router'))
app.use('/all_schedules',require('./Router/admin_flightschedule_router'))


/*for pilot profile*/
app.use(express.json());

// const Images = mongoose.model('Images');
//const signup=require('./Router/index')



//app.use(signup)
app.use(express.urlencoded({extended: false}));


/*mongodb*/






// app.use('/admin',require('./Router/admin_dashboard_router')) 







dotenv.config();

var mongoose = require('mongoose')
const objectId = require('mongodb')._id;
  
var fs = require('fs');
var path = require('path');
require('dotenv/config');


  
mongoose.connect(process.env.MONGO_URL,
    { useNewUrlParser: true, useUnifiedTopology: true }, err => {
        console.log('Mongodb connected')
    });


    app.use(express.urlencoded({ extended: true }));
//bodyparser
app.use(bodyparser.urlencoded({extended : false}));
app.use(bodyparser.json());







    var multer = require('multer');
  
    var storage = multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, 'uploads')
        },
        filename: (req, file, cb) => {
            cb(null, file.fieldname + '-' + Date.now())
        }
    });
    var upload = multer({ storage: storage });

    var imgModel = require('./model');

  
    app.get('/insertpilot', (req, res) => {
        imgModel.find({}, (err, items) => {
            if (err) {
                console.log(err);
                res.status(500).send('An error occurred', err);
            }
            else {
                res.render('insertnewpilot', { items: items });
            }
        });
    });
    app.get('/all_pilots', (req, res) => {
        imgModel.find({}, (err, items) => {
            if (err) {
                console.log(err);
                res.status(500).send('An error occurred', err);
            }
            else {
                res.render('pilotlist', { items: items });
            }
        });
    });
    
    app.post('/insertpilot', upload.single('image'), (req, res, next) => {
  
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
              data: fs.readFileSync(path.join(__dirname + '/uploads/' + req.file.filename)),
              contentType: 'image/png'
          }
      }
      imgModel.create(obj, (err, items) => {
          if (err) {
              console.log(err);
          }
          else {
              // item.save();
              console.log("project details inserted succesfully")
              res.redirect("/all_pilots");
          }
      });
  });
  
app.use(expressLayouts);
app.set("views", "./views");
app.set("view engine", "ejs");

app.use(cookieParser());

app.use(express.json());

/*for delete*/
app.get('/delete', (req, res) => {
    imgModel.find({}, (err, items) => {
        if (err) {
            console.log(err);
            res.status(500).send('An error occurred', err);
        }
        else {
            res.redirect("/all_pilots");
        }
    });
});

  app.post('/delete', function(req, res, next) {
    var id = req.body.id;
    console.log("hhhhhhhhhhhhhhhhhhhhhhh........................")
    console.log(id)
    console.log("hhhhhhhhhhhhhhhhhhhhhhh........................")

    imgModel.findByIdAndRemove(id).exec();
    console.log("project details deleted succesfully")
    res.redirect('/all_pilots');
  });
  

  /*update record*/
  app.get('/updatedoc',(req, res)=>{
    a=req.body;
    console.log('qqqqqqqqqqqqqqqqqqqqqqqqqq')
    console.log(a)
    console.log('qqqqqqqqqqqqqqqqqqqqqqqqqq')
    console.log('hi');
    res.render("updatedoc",{ layout: false,list:a})
  
  });
  app.post('/updatedoc', function(req, res, next) {
    var id = req.body.id;
  
    imgModel.findById(id, function(err, doc) {
      if (err) {
        console.error('error, no entry found');
      }
      doc.name= req.body.name;
      doc.emailid= req.body.emailid;
      doc.mobileno= req.body.mobileno;
      doc.dob = req.body.dob;
      doc.type_of_drone_experience=req.body.type_of_drone_experience;
      doc.honors_and_achievements=req.body.honors_and_achievements;
      doc.img=req.body.img
      doc.save();
    })
    console.log("pilot details updated succesfully")
    res.redirect('/insertpilot');
  });

  /*update the documents*/
//   app.get('/edit/:id', async (req, res) => {
//     const objectIdToEdit = new ObjectId(req.params.id);
//     console.log("firsttttttttttttttttttttttttttttt")
//     console.log(objectIdToEdit)
//     console.log('secondtttttttttttttttttttttttttttttt')
  
//     try {
//       const document = await imgModel.findOne({ _id: objectIdToEdit });
//       console.log("yyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyy")
//     console.log(document)
//     console.log('thissssssssssssssssssssssssssssssssssssss')
  
//       if (document) {
//         res.render('updatedoc', { document: document }); // Pass the document to the template
//       } else {
//         res.status(404).send('Document not found.');
//       }
//     } catch (error) {
//       console.error('Error fetching document:', error);
//       res.status(500).send('An error occurred while fetching the document.');
//     }
//   });


app.get('/edit/:id', async (req, res) => {
  try {
    const objectIdToEdit = req.params.id;

    const document = await imgModel.findById(objectIdToEdit);

    if (document) {
      res.render('updatedoc', { layout: false, document: document, aa: req.params.id });
    } else {
      res.status(404).send('Document not found.');
    }
  } catch (error) {
    console.error('Error fetching document:', error);
    res.status(500).send('An error occurred while fetching the document.');
  }
});

app.post('/edit/:id', upload.single('image'), async (req, res) => {
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

    const result = await imgModel.findByIdAndUpdate(objectIdToUpdate, updatedData);

    if (result) {
      res.redirect('/all_pilots');
    } else {
      res.status(404).send('Document not found.');
    }
  } catch (error) {
    console.error('Error updating document:', error);
    res.status(500).send('An error occurred while updating the document.');
  }
});

  
/*psqland mongodb interconnection*/
const pg = require('pg');
const { MongoClient } = require('mongodb');

// PostgreSQL connection configuration
const pgConfig = {
  user: 'qfxwijux',
  host: 'mouse.db.elephantsql.com',
  database: 'qfxwijux',
  password: 'sGtZVyXqp9PIG1EaLpZNdZX9qO1RceyE',
  port: 5432,

};

// MongoDB connection configuration
const mongoConfig = {
  url: 'mongodb+srv://webportal:LockheedSR-71@webportal.lx0pbn0.mongodb.net/trial',
  dbName: 'trial',
  collectionName: 'images',
};

// Create a PostgreSQL client
const pgClient = new pg.Client(pgConfig);

// Create a MongoDB client
const mongoClient = new MongoClient(mongoConfig.url);

async function synchronizeData() {
  try {
    // Connect to PostgreSQL and MongoDB
    await pgClient.connect();
    console.log('Connected to PostgreSQL.');

    await mongoClient.connect();
    console.log('Connected to MongoDB.');

    // Retrieve data from PostgreSQL
    const query = `SELECT emailid, sum(duration) as duration1 FROM flight_description where mode ='testing' group by emailid`;
    ;
    const result = await pgClient.query(query);
    const pgData = result.rows;

    // Transform and update data in MongoDB
    const mongoCollection = mongoClient.db(mongoConfig.dbName).collection(mongoConfig.collectionName);

    for (const row of pgData) {
      const emailId = row.emailid;
      const duration1 = row.duration1;


      // Retrieve duration2 value from PostgreSQL
      const query2 = `SELECT sum(duration) as duration2 FROM flight_description where mode='simulation'and emailid = $1`;
      const result2 = await pgClient.query(query2, [emailId]);
      const duration2 = result2.rows[0].duration2;

      // Update the corresponding document in MongoDB
      await mongoCollection.updateOne({ emailid: emailId }, { $set: { duration1, duration2 } });
    }

    console.log('Data synchronization complete.');

  } catch (error) {
    console.error('Error:', error);

  } finally {
    // Close the PostgreSQL and MongoDB connections
    await pgClient.end();
    await mongoClient.close();
  }
}

// Run the synchronization process
synchronizeData();












const PORT=process.env.PORT||1200;
app.listen(PORT,()=>{
    console.log(`Server Started at Port ${PORT}`);
});