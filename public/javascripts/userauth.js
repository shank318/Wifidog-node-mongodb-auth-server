$(document).ready(function() {
    
      var navpos = $('#mainnav').offset();
        $(window).bind('scroll', function() {
          if ($(window).scrollTop() > navpos.top) {
           $('#mainnav').addClass('navbar-fixed-top');
           }
           else {
             $('#mainnav').removeClass('navbar-fixed-top');
           }
        });




$('#example').popover();
var footerHeight = $('.color_footer').height();
$('#content-wrapper-body').css('padding-bottom', footerHeight);

//   $.ajax({
//         url: "/api/categories",
//         success: function(result) {
//           data = result.success.data;
//           //change_bgimg(data.home_background);
//           var htmlrow;  
//           var categoriesDropdown= $("#menu-items")
//             var htmlrow;
//             categoriesDropdown.append('<li><a href="/" id="text2">HOME</a></li>');
//             data.categories.forEach(function(category,index) {
//                // if(category.is_published){
//               categoriesDropdown.append('<li><a href="/category/'+getSlug(category.slug+" "+category._id)+'">'+(category.category_name).toUpperCase()+'</a></li>');
//             //}
//             });
// }

// });
});

var email = $('#email_quiz').val();
    if (email == null || email == "") {
        alert("Please enter your email");
        return false;
    } else{
      var atpos = email.indexOf("@");
      var dotpos = email.lastIndexOf(".");
      if (atpos<1 || dotpos<atpos+2 || dotpos+2>=email.length) {
        alert("Please enter a valid email");
        return false;
      }else{
        return true;
      }
    }

function validateForm() {
    var name = document.forms["login_form"]["name"].value;
    var email = document.forms["login_form"]["email"].value;
    var phone = document.forms["login_form"]["phone"].value;


    if( name==null || name == "") {
        alert("Please enter your name");
        return false;
    } else if(phone == null || phone == "" || phone.length != 10 ){
      alert("Please enter a valid mobile number");
        return false;
    }else{
      var atpos = email.indexOf("@");
      var dotpos = email.lastIndexOf(".");
      if (atpos<1 || dotpos<atpos+2 || dotpos+2>=email.length) {
        alert("Please enter a valid email");
        return false;
      }else{
        return true;
      }
    }
}

function isNumberKey(evt){
    var charCode = (evt.which) ? evt.which : event.keyCode
    if (charCode > 31 && (charCode < 48 || charCode > 57))
        return false;
    return true;
}















