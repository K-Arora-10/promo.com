var express=require("express");
let app=express();
let mysql2=require("mysql2");
var nodemailer = require("nodemailer");
var fileuploader=require("express-fileupload");


app.use(express.static("public"));
app.use(fileuploader());
app.use(express.urlencoded("true"));

//============================================================

app.listen(2024,function(){
    console.log("Server Started");
})

//============================================================

app.get("/",function(req,resp){
    let path=__dirname+"/public/index.html";
    resp.sendFile(path);
})

//============================================================

let config={
    host:"b3esjb7kwpmuz6ekf5yj-mysql.services.clever-cloud.com",
    user:"uomk722jncwih3pa",
    password:"vjswLqVO8TnxCnes63ty",
    database:"b3esjb7kwpmuz6ekf5yj",
    dateStrings:true,
    keepAliveDelay : 10000,
    enableKeepAlive : true, 
}

var mysql=mysql2.createConnection(config);

mysql.connect(function(err){
    if(err)
        console.log(err.message);
    else
        console.log("Connected to Database");
})


//=============================================================

app.get("/send-to-database",function(req,resp){
    let txtEmail=req.query.txtEmail;
    let pwd=req.query.pwd;
    let utype=req.query.utype;
    let status=req.query.status;

    mysql.query("insert into users values(?,?,?,?)",[txtEmail,pwd,utype,status],function(err){
        if(err)
            resp.send(err.message);
        else
            resp.send("Signed Up");
    })
})

//==============================================================

app.get("/chk-from-database",function(req,resp){
    let txtEmail=req.query.txtEmail;
    let pwd=req.query.pwd;

    mysql.query("select * from users where email=? and status=?",[txtEmail,'1'],function(err,resultJsonAry){
    
        if(err!=null)
            {
                resp.send(err.message);
                return;
            }
 
            if(resultJsonAry.length==1)
            {
                if(resultJsonAry[0].pwd==pwd)
                    resp.send(resultJsonAry[0].utype);
                else
                    resp.send("Incorrect Password");
            }
                
            else
            {
                mysql.query("select * from users where email=? and status=?",[txtEmail,'0'],function(err,resultJsonAry){
    
                    if(err!=null)
                        {
                            resp.send(err.message);
                            return;
                        }
                    if(resultJsonAry.length==1)
                        resp.send("You are Blocked");
                    else
                    resp.send("Wrong User Credentials");
                })
            }
            
    })

    
})

//==============================================================================================================

app.get("/inf-dash",function(req,resp){
    let path=__dirname+"/public/inf-dash.html";
    resp.sendFile(path);
})

//===================================================================================================================

app.get("/inf-profile",function(req,resp){
    let path=__dirname+"/public/inf-profile.html"
    resp.sendFile(path);
})

//===========================================================================================================

app.post("/inf-profile-save-process",function(req,resp){
    let email=req.body.email;
    let iname=req.body.iname;
    let dob=req.body.dob;
    let gender=req.body.gender;
    let address=req.body.address;
    let city=req.body.city;
    let contact=req.body.contact;
    let field=req.body.field;
    let insta=req.body.insta;
    let fb=req.body.fb;
    let yt=req.body.yt;
    let fileName=req.files.ppic.name;

    //!!!!!--Replaced this all by  .toString()-----!!!!!
    // let str;
    // if(Array.isArray(field))
    //     {
    //      str="";
    // for(i=0;i<field.length;i++)
    //     {
    //         str+=field[i]+",";
    //     }
    //     }
    //     else
    //     str=field;

    let path=__dirname+"/public/uploads/"+fileName;
    req.files.ppic.mv(path);

    mysql.query("insert into inprofile values(?,?,?,?,?,?,?,?,?,?,?,?)",[email,iname,dob,gender,address,city,contact,field.toString(),insta,fb,yt,fileName],function(err){
        if(err)
            resp.send(err.message);
    })
})

//====================================================================================================================================================================================

app.get("/search-infl",function(req,resp){
    let email=req.query.email;

    mysql.query("select * from inprofile where email=?",[email],function(err,resultJsonAry){
        if(err)
            console.log(err.message);
        else
        {
            resp.send(resultJsonAry);
        }
    })
})

//========================================================================================================

app.post("/infl-events",function(req,resp){
    let email=req.body.email;
    let title=req.body.title;
    let date=req.body.doe;
    let time=req.body.tos;
    let city=req.body.city;
    let venue=req.body.venue;

    mysql.query("insert into events values(?,?,?,?,?,?)",[email,title,date,time,city,venue],function(err){
        if(err)
            resp.send(err.message);
        else
            resp.send("Event Posted!");
    })

})

//========================================================================================================================

app.post("/infl-settings",function(req,resp){
    let email=req.body.email;
    let oldpass=req.body.oldpass;
    let newpass=req.body.newpass;
    let confirmnewpass=req.body.confirmnewpass;

   mysql.query("select * from users where email=? and pwd=?",[email,oldpass],function(err,resultJsonAry){
    if(err)
        resp.send(err.message);
    if(resultJsonAry.length==0)
    {
        resp.send("Wrong User Credentials")
    }
    else{
    mysql.query("update users set pwd=? where email=? and pwd=?",[newpass,email,oldpass],function(err){
        if(err)
            resp.send(err.message);
        else
            resp.send("Password Changed Successfully");
    
    })
    }
   })
})

//==============================================================================================================================

var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'krishmaur10@gmail.com',
      pass: 'krgb kfis bjyo diiq'
    }
  });
  



  
  app.get("/forgot-pass",function(req,resp){

    let email=req.query.email;
    let pass="";
    // resp.send(email);

    mysql.query("select * from users where email=?",[email],function(err,resultJsonAry){
        if(resultJsonAry.length==0)
            resp.send("You are not an existing user.");
        else{
             pass=resultJsonAry[0].pwd;
             //resp.send(pass);
            // resp.send("Check your Email inbox for password.");

                var mailOptions = {
        from: 'krishmaur10@gmail.com',
        to: email,
        subject: 'Your Password',
        text: "Your password is : "+pass
      };
  
  transporter.sendMail(mailOptions, function(error, info){
    if (error) {
      console.log(error);
    } else {
      resp.send('Check your Email inbox for password.');
    }
  })
            
        }
    })
    


}) 

//========================================================================================================================

app.get("/admin-dash",function(req,resp){

    let path=__dirname+"/public/admin-dash.html";
    resp.sendFile(path);
})

//=========================================================================================================================

app.get("/admin-user-manager",function(req,resp){
    let path=__dirname+"/public/admin-user-manager.html";
    resp.sendFile(path);
})

//====================================================================================================

app.get("/fetch-all",function(req,resp){

    mysql.query("select * from users",function(err,resultJsonAry){
        if(err)
        {
            console.log(err.message);
        }
        else
        resp.send(resultJsonAry);
    })
})

//======================================================================================================

app.get("/do-block",function(req,resp){
    mysql.query("update users set status=? where email=?",[0,req.query.email],function(err)
{
    if(err)
        console.log(err.message);
    else
    resp.send("Blocked");
})
})

//==========================================================================================================

app.get("/do-unblock",function(req,resp){
    mysql.query("update users set status=? where email=?",[1,req.query.email],function(err)
{
    if(err)
        console.log(err.message);
    else
    resp.send("Unblocked");
})
})

//==========================================================================================================

app.get("/do-delete",function(req,resp){
    mysql.query("delete from users where email=?",[req.query.email],function(err)
{
    if(err)
        console.log(err.message);
    else
    resp.send("Deleted");
})
})

//===========================================================================================================

app.get("/admin-influencer-console",function(resq,resp){
    let path=__dirname+"/public/admin-influencer-console.html";
    resp.sendFile(path);
})

//===========================================================================================================

app.get("/show-inf-profile-data",function(req,resp){

    mysql.query("select * from inprofile",function(err,resultJsonAry){
        if(err)
        {
            console.log(err.message);
        }
        else
        resp.send(resultJsonAry);
    })
})

//=============================================================================================================

app.get("/influ-finder",function(req,resp){
    let path=__dirname+"/public/influ-finder.html";
    resp.sendFile(path);
})

//============================================================================================================

app.get("/findacc-field-city",function(req,resp){

    let field="%"+req.query.field+"%";
    let city=req.query.city;


    mysql.query("select * from inprofile where field like ? and city=?",[field,city],function(err,resultJsonAry){
        if(err)
        {
            console.log(err.message);
        }
        else
        resp.send(resultJsonAry);
    })
})

//====================================================================================================================

app.get("/findacc-name",function(req,resp){

    let name=req.query.name;


    mysql.query("select * from inprofile where iname=?",[name],function(err,resultJsonAry){
        if(err)
        {
            console.log(err.message);
        }
        else
        resp.send(resultJsonAry);
    })
})

//==========================================================================================================================

app.get("/inf-event-manager",function(req,resp){
    let path=__dirname+"/public/inf-event-manager.html";
    resp.sendFile(path);
})

//==========================================================================================================================

app.get("/show-future-events",function(req,resp){
    let email=req.query.email;


    mysql.query("select * from events where email=? and doe>=current_date()",[email],function(err,resultJsonAry){
        if(err)
        {
            console.log(err.message);
        }
        else
        resp.send(resultJsonAry);
    })
})

//====================================================================================================================================


app.get("/show-past-events",function(req,resp){
    let email=req.query.email;


    mysql.query("select * from events where email=? and doe<=current_date()",[email],function(err,resultJsonAry){
        if(err)
        {
            console.log(err.message);
        }
        else
        resp.send(resultJsonAry);
    })
})
//===================================================================================================================================

app.get("/show-all-events",function(req,resp){
    let email=req.query.email;


    mysql.query("select * from events where email=?",[email],function(err,resultJsonAry){
        if(err)
        {
            console.log(err.message);
        }
        else
        resp.send(resultJsonAry);
    })
})

//==========================================================================================================================

app.get("/delete-event",function(req,resp){
    mysql.query("delete from events where email=? and doe=? and tos=?",[req.query.email,req.query.doe,req.query.tos],function(err)
{
    if(err)
        console.log(err.message);
    else
    resp.send("Deleted");
})
})

//======================================================================================================================================================

app.get("/client-dash",function(req,resp){

    let path=__dirname+"/public/client-dash.html";
    resp.sendFile(path);
})

//================================================================================================================================================================
app.get("/client-profile",function(req,resp){

    let path=__dirname+"/public/client-profile.html";
    resp.sendFile(path);
})

//========================================================================================================================================================================

app.get("/search-infl",function(req,resp){
    let email=req.query.email;

    mysql.query("select * from clprofile where email=?",[email],function(err,resultJsonAry){
        if(err)
            console.log(err.message);
        else
        {
            resp.send(resultJsonAry);
        }
    })
})

//================================================================================================================

app.post("/cl-profile-save-process",function(req,resp){
    let email=req.body.email;
    let cname=req.body.cname;
    let dob=req.body.dob;
    let gender=req.body.gender;
    let city=req.body.city;
    let contact=req.body.contact;
    let fileName=req.files.ppic.name;

    //!!!!!--Replaced this all by  .toString()-----!!!!!
    // let str;
    // if(Array.isArray(field))
    //     {
    //      str="";
    // for(i=0;i<field.length;i++)
    //     {
    //         str+=field[i]+",";
    //     }
    //     }
    //     else
    //     str=field;

    let path=__dirname+"/public/uploads/"+fileName;
    req.files.ppic.mv(path);

    mysql.query("insert into clprofile values(?,?,?,?,?,?,?)",[email,cname,dob,gender,city,contact,fileName],function(err){
        if(err)
            resp.send(err.message);
    })
})

//==========================================================================================================================================

app.get("/search-client",function(req,resp){
    let email=req.query.email;

    mysql.query("select * from clprofile where email=?",[email],function(err,resultJsonAry){
        if(err)
            console.log(err.message);
        else
        {
            resp.send(resultJsonAry);
        }
    })
})

//===========================================================================================================================

app.post("/inf-profile-update-process",function(req,resp){
    let email=req.body.email;
    let iname=req.body.iname;
    let dob=req.body.dob;
    let gender=req.body.gender;
    let address=req.body.address;
    let city=req.body.city;
    let contact=req.body.contact;
    let field=req.body.field;
    let insta=req.body.insta;
    let fb=req.body.fb;
    let yt=req.body.yt;
    let fileName=req.files.ppic.name;

    let path=__dirname+"/public/uploads/"+fileName;
    req.files.ppic.mv(path);

    mysql.query("update inprofile set iname=?,dob=?,gender=?,address=?,city=?,contact=?,field=?,insta=?,fb=?,yt=?,ppic=? where email=?",[iname,dob,gender,address,city,contact,field.toString(),insta,fb,yt,fileName,email],function(err){
        if(err)
            resp.send(err.message);
    })

})

//============================================================================================================================================================================================================================================================

app.post("/cl-profile-update-process",function(req,resp){
    let email=req.body.email;
    let cname=req.body.cname;
    let dob=req.body.dob;
    let gender=req.body.gender;
    let city=req.body.city;
    let contact=req.body.contact;
    let fileName=req.files.ppic.name;

    let path=__dirname+"/public/uploads/"+fileName;
    req.files.ppic.mv(path);

    mysql.query("update clprofile set cname=?,dob=?,gender=?,city=?,contact=?,ppic=? where email=?",[cname,dob,gender,city,contact,fileName,email],function(err){
        if(err)
            resp.send(err.message);
    })
})

//=========================================================================================================================================================================================


  



  
  app.get("/send-mail",function(req,resp){

    let cemail=req.query.cemail;
    let iemail=req.query.iemail;
    
    // resp.send(email);

    mysql.query("select * from clprofile where email=?",[cemail],function(err,resultJsonAry){
        
             

                var mailOptions = {
        from: 'krishmaur10@gmail.com',
        to: iemail,
        subject: 'Collaboration Opportunity',
        html: 'We hope this message finds you well. <br>This email is from Promo.com reaching you out on behalf of a client. They are very interested in collaborating with you. <br>You can contact them through the information given below.<br>Name: '+resultJsonAry[0].cname+'<br>Email Id: '+resultJsonAry[0].email+'<br>Contact No.: '+resultJsonAry[0].contact+'<br>City: '+resultJsonAry[0].city
                };      
  
  transporter.sendMail(mailOptions, function(error, info){
    if (error) {
      console.log(error);
    } else {
      resp.send('Email sent to the influencer. We have shared your contact information with them. They will contact you soon.');
    }
  })
            
})
    })
    


