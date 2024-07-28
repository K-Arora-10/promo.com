$(document).ready(function(){
    $("#sign").click(function(){

        if($("#exampleInputEmail1sign").val()=="")
            {
                $("#exampleInputEmail1sign").css("border-color","red");
                $("#e").html("Fill your Email");
                return;
            }
            else
            {
                $("#exampleInputEmail1sign").css("border-color","grey");
                $("#e").html("");
            }
            if($("#exampleInputPassword1sign").val()=="")
            {
                $("#exampleInputPassword1sign").css("border-color","red");
                $("#p").html("Set your password");
                return;
            }
            else
            {
                $("#exampleInputPassword1sign").css("border-color","grey");
                $("#p").html("");
            }
            if($("#utype").val()=="--Select--")
                {
                    $("#utype").css("border-color","red");
                    $("#u").html("Fill the user type");
                    return;
                }
                else
                {
                    $("#utype").css("border-color","grey");
                    $("#u").html("");
                }



        let obj={
            type:"get",
            url:"/send-to-database",
            data:{
                txtEmail:$("#exampleInputEmail1sign").val(),
                pwd:$("#exampleInputPassword1sign").val(),
                utype:$("#utype").val(),
                status:1
            }
        }

        $.ajax(obj).done(function(resp){
            alert(resp);
        }).fail(function(err){
            alert(err.statusText);
        })
    })


    // ==============================================================================================


    $("#login").click(function(){

        if($("#exampleInputEmail1login").val()=="")
        {
            $("#exampleInputEmail1login").css("border-color","red");
            $("#fe").html("Fill your registered Email");
            return;
        }
        else
        {
            $("#exampleInputEmail1login").css("border-color","grey");
            $("#fe").html("");
        }
        if($("#exampleInputPassword1login").val()=="")
        {
            $("#exampleInputPassword1login").css("border-color","red");
            $("#ip").html("Fill your password");
            return;
        }
        else
        {
            $("#exampleInputPassword1login").css("border-color","grey");
            $("#ip").html("");
        }


        let obj={
            type:"get",
            url:"/chk-from-database",
            data:{
                txtEmail:$("#exampleInputEmail1login").val(),
                pwd:$("#exampleInputPassword1login").val(),
            }
        }

        $.ajax(obj).done(function(resp){
            if(resp==="Influencer")
            {
                location.href="inf-dash.html";
                localStorage.setItem("activeuser",$("#exampleInputEmail1login").val());
            }
            else if(resp==="Collaborator"){
                location.href="client-dash.html";
                localStorage.setItem("activeuser",$("#exampleInputEmail1login").val());
            }
            else if(resp=="Incorrect Password")
            {
                $("#exampleInputPassword1login").css("border-color","red");
                $("#ip").html(resp);
            }
            else
            alert(resp);
                
            
        }).fail(function(err){
            alert(err.statusText);
        })
    })

//=================================================================================================================
    $("#forgot").click(function(){
        
        if($("#exampleInputEmail1login").val()=="")
            {
                $("#exampleInputEmail1login").css("border-color","red");
                $("#fe").html("Fill your registered Email");
                return;
            }
            else
        {
            $("#exampleInputEmail1login").css("border-color","grey");
            $("#fe").html("");
        }

        let obj={
            type:"get",
            url:"/forgot-pass",
            data:{
                email:$("#exampleInputEmail1login").val(),
            }
        }
    
        $.ajax(obj).done(function(resp){
            alert(resp);
        }).fail(function(err){
            alert(err.statusText);
        })
    })

})





