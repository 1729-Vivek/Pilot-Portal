const express = require("express")
const { check } = require("express-validator");
const pool=require("../database");


const uuid = require('uuid');
const jwt=require("jsonwebtoken");


const bodyParser = require("body-parser");
const cookieParser = require('cookie-parser')
const router=express.Router();
router.use(bodyParser.urlencoded({extended:true}))
router.use(bodyParser.json())
router.use(cookieParser())

const { cookie } = require('express/lib/response');
const { use } = require('../Router');
require('dotenv').config();





module.exports.flight_schedule_insertmem=async (req,res)=>{
  try{
    const email = req.cookies.email;
      console.log(req.body)
      var { date, time, description, copilot}= req.body;
     var flight_schedule_insert = await pool.query("insert into schedule (email, date, time, description, copilot) values ($1, $2, $3, $4, $5)",[email, date, time, description, copilot])
  }
  catch (e) {
   console.error(e)
   res.json(500);}

} 
 

module.exports.flight_schedule_view=async (req,res)=>{
    try{
      const email = req.cookies.email;
      console.log("hello you should display email here")
        console.log(req.body)
        var {date, time, description, copilot}= req.body;
       var flight_schedule_display_list=await pool.query("select * from schedule where email=$1",[email]);
       console.log("hello world this is flight schedule");
       console.log(flight_schedule_display_list)
       console.log("hello world this is flight schedule")
       return flight_schedule_display_list.rows;
      
    }
    catch (e) {
     console.error(e)
     res.json(500);}
 
 }
 
 module.exports.reschedule_alter=async (req,res)=>{

  try{
    const email = req.cookies.email;
      console.log(req.body)
      var {flight_id, date, time, description, copilot}= req.body;
     var reschedule_alter=await pool.query(" UPDATE schedule  SET email =$1, date =$2, time =$3, description =$4, copilot =$5 WHERE flight_id =$6;",[email,date,time,description,copilot,flight_id]);
     let flight_schedule_view = await flight_schedule_controller.flight_schedule_view(req, res);
     res.render('form', { layout: false, flight_schedule_view_1: flight_schedule_view });
  }
  catch (e) {
   console.error(e)
   res.json(500);}

}


module.exports.edit_schedulesmem = async (req, res) => {
  try {
      var editData = req.body
      
      var edit_info = await pool.query("select * from schedule where flight_id=$1", [editData.editschedule]);
      console.log("edittinnng...")
      console.log(edit_info.rows);
      return edit_info.rows[0];

  }
  catch (e) {
      console.error(e)
      res.json({
          errors: 'Invalid'
      });

  }
}

///
module.exports.editschedulesmem = async (req, res) => {
  try {
    const email = req.body;
      var flightinfo = req.body
      console.log(flightinfo)
      console.log(flightinfo.flight_id+"helloworld12345")
      console.log("1")
      
      var edit_schedule = await pool.query("update schedule set email=$1,date=$2,time=$3,description=$4,copilot=$5,called=$6 where flight_id=$7", [flightinfo.email, flightinfo.date, flightinfo.time, flightinfo.description, flightinfo.copilot, flightinfo.called,flightinfo.flight_id])
      console.log(edit_schedule);
      console.log("edited")
      var after_edit_schedule_list = await pool.query("select flight_id, email, date, time, description, copilot, called  from schedule where email=$1",[email]);
      console.log(after_edit_schedule_list.rows);
      console.log("after")  
      return after_edit_schedule_list.rows;
  } catch (err) {
      console.log(err)
      res.status(401).json('Cannot Reschedule..........')
  }
};


module.exports.flightlistmem = async (req, res) => {
  try {
    console.log("please print email here..........")
    const email = req.cookies.email;
    console.log(email)
    console.log("please print email here..........")
   console.log("hello welcome..................")
    var flight_list = await pool.query("select flight_id, email, date, time, description, copilot, called from schedule where email=$1",[email]);
    console.log(flight_list.rows);
    console.log("hello nishmitha..................")
    console.log(flight_list.rows[0].flight_id+"hellonitte")
    return flight_list.rows;
  }
  catch(err)
  {
      console.log(err);
      return {flight_list:[]}
  }
}

module.exports.get_flightmem = async (req, res) => {
  try {
    var get_flight = await pool.query("select flight_id, email, date, time, description, copilot, called from schedule where flight_id=$1",[req.body.flight_id]);
    
   
    return get_flight.rows;
  }
  catch (e) {
    console.error(e)
    res.json({
      errors: 'Invalid'
    });

  }
}

module.exports.deleteschedulesmem = async (req, res) => {
  try {
    
    const email = req.cookies.email;
      var remove = []
      var Data = req.body;
      console.log(Data)
      console.log("qb")
      var schedules = await pool.query("select * from schedule where email=$1",[email])
      console.log(schedules.rows[0].flight_id)
      console.log("hello")
      var b = await pool.query("delete from schedule where flight_id =$1", [Data.deleteschedule])
        
          console.log(b)


      
  var new_list_after_delete = await pool.query("select flight_id, email, date, time, description, copilot, called  from schedule");
      console.log(new_list_after_delete.rows);
      console.log("New flight Schedules...")
      return new_list_after_delete.rows;

  } catch (err) {
      console.log(err)
      res.status(401).json("Cannot Delete a Schedule........")
  }
}


