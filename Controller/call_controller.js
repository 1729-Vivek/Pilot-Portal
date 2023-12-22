//var time = today.getHours()
const pool  = require("../database");
from_number=`+12179878755`


const accountSid = 'AC155e2c82a0ce12983c86dca122fbd123';
const authToken = 'e2a8f2e0e79e3f4cddf90f16c080caac';
const client = require('twilio')(accountSid, authToken);


call=async(number)=>{
    console.log(number);
    client.calls.create({
        url:'https://handler.twilio.com/twiml/EH658003a3bc7e0f32191549410f0d00e6',
        to: number,
        from: `+12179878755`
    }, function(err,call){
        if(err){
            console.log(err);
        } else{
            console.log(call.sid);
            console.log("call excecuted")
            /*This has to be fixed*/
            pool.query(`UPDATE schedule SET called = true FROM signup 
            WHERE schedule.email = signup.emailid 
            and phone_number= $1 and schedule.date=current_date and schedule.time<=current_time+ interval '1 hour'`,[number]);

        }
    });
}





module.exports.extract_call_details = async() =>{
  try{   
    
    
      const phone_numbers=await pool.query(`select su.phone_number 
                                            from signup su, schedule sc 
                                            where su.emailid = sc.email 
                                            and sc.date = current_date 
                                          
                                            and sc.time <= current_time + interval '1 hour' 
                                            and called = false`);

      for(let i=0; i<phone_numbers.rows.length;i++){
          const phone=phone_numbers.rows[i];
          await call(phone.phone_number);
          var number = phone.phone_number;
      }
      
  }
  
  catch(err){
      console.log(err);
  }
}



