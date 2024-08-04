$(document).ready(function(){

    let active=localStorage.getItem("activeuser");
    $("#inputEmail4").val(active);
    $("#inputEmail4").prop("readonly",true);

    
        let obj={
            type:"get",
            url:"/search-client",
            data:{
                email:$("#inputEmail4").val()
            }
        }

        $.ajax(obj).done(function(jsonAry){
            if(jsonAry.length==0)
            {
                $("#save").prop("disabled",false);
                $("#prev").prop("src","Iamges/user.jpg");
            }
            
            else{
                $("#inputName").val(jsonAry[0].cname);
                $("#inputDate").val(jsonAry[0].dob);
                $("#inputGender").val(jsonAry[0].gender);
                $("#inputCity").val(jsonAry[0].city);
                $("#inputContact").val(jsonAry[0].contact);
                $("#update").prop("disabled",false);
                $("#prev").prop("src",jsonAry[0].ppic);
                $("#hdn").val(jsonAry[0].ppic);
            }

            
            
        })
    })
