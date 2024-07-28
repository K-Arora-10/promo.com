$(document).ready(function(){

  if(localStorage.getItem("activeuser")==null)
    {
      location.href="index.html";
      return;
    }


  let active=localStorage.getItem("activeuser");
  $("#wlcm").html("Welcome  "+active);
  $("#exampleInputEmail1").val(active);
  $("#exampleInputEmail1").prop("readonly",true);
  $("#emailsetting").val(active);
  $("#emailsetting").prop("readonly",true);

    $("#Post").click(function(){
      let obj={
      type:"post",
      url:"/infl-events",
      data:{
        email:$("#exampleInputEmail1").val(),
        title:$("#event-title").val(),
        doe:$("#event-date").val(),
        tos:$("#event-time").val(),
        city:$("#event-city").val(),
        venue:$("#event-venue").val(),
      }
    }

    

    $.ajax(obj).done(function(resp){
      $("#posted").html(resp);
    }).fail(function(err){
      alert(err.statusText);
    })
    })

    //=======================================================================

    $("#update").click(function(){
        if($("#newpass").val()==$("#confirmnewpass").val())
        {
            $("#okay").css("display","block");
            $("#errpass").html("");
        }
        else
           { $("#errpass").html("Confirmed password does not match with new password.");
            $("#okay").css("display","none");
            return;
           }
        
           let obj={
            type:"post",
            url:"/infl-settings",
            data:{
              email:$("#emailsetting").val(),
              oldpass:$("#oldpass").val(),
              newpass:$("#newpass").val(),
              confirmnewpass:$("#confirmnewpass").val(),
            }
          }

          $.ajax(obj).done(function(resp){
            alert(resp);
          }).fail(function(err){
            alert(err.statusText);
          })
        
    })

    $("#logout").click(function(){
      localStorage.removeItem("activeuser");
      location.href="index.html";
    })



  })