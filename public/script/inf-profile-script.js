$(document).ready(function(){

    let active=localStorage.getItem("activeuser");
    $("#inputEmail4").val(active);
    $("#inputEmail4").prop("readonly",true);

    
        let obj={
            type:"get",
            url:"/search-infl",
            data:{
                email:$("#inputEmail4").val()
            }
        }

        $.ajax(obj).done(function(jsonAry){
            if(jsonAry.length==0)
            {
                $("#save").prop("disabled",false);
                $("#prev").prop("src","Images/user.jpg");
            }
            // $("#pp").val();
            else{
                $("#inputName").val(jsonAry[0].iname);
            $("#inputDate").val(jsonAry[0].dob);
            $("#inputGender").val(jsonAry[0].gender);
            $("#inputAddress").val(jsonAry[0].address);
            $("#inputCity").val(jsonAry[0].city);
            $("#inputContact").val(jsonAry[0].contact);
            $("#inputWork").val(jsonAry[0].field.split(","));
            // $("#pp").val(jsonAry[0].ppic);
            $("#inputInsta").val(jsonAry[0].insta);
            $("#inputFb").val(jsonAry[0].fb);
            $("#inputYt").val(jsonAry[0].yt);
            $("#update").prop("disabled",false);
            $("#prev").prop("src","uploads/"+jsonAry[0].ppic);
            }

            
            
        })
    })
