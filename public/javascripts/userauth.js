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
$('.register-form').attr('action', '/signup/?referer='+getUrlVars()["referer"]); 
$('.login-form').attr('action', '/login/?referer='+getUrlVars()["referer"]); 
$('#facebookform').attr('action', '/facebook/?referer='+getUrlVars()["referer"]); 

$('.message a').click(function(){
   $('form').animate({height: "toggle", opacity: "toggle"}, "slow");
});

$('.reset-password a').click(function(){
   $('#reset-error').hide();
   $('.reset-section').show();
   $('.login-section').hide();
});

$('.reset-signin a').click(function(){
   $('#reset-error').hide();
   $('.reset-section').hide();
   $('.login-section').show();
});


$('#btn-reset').on("click", function() {
    $('#btn-reset').text("Please wait...");
    var email = $('#reset-email').val();
    if(email==null || email == '' ) return;
    var jsonSubmit = {
      "email": email
    }
    $.ajax({
                  url: "/api/users/forgot",
                  type: "POST",
                  data: JSON.stringify(jsonSubmit),
                  contentType: "application/json",
                  success: function(response) {
                      $('#btn-reset').text("SEND RESET LINK");
                      $('.reset-form').hide();
                      $('#reset-error').hide();
                      $('.header-reset').text("We have sent a reset password link to your email account.");
                  },
                  error: function (XMLHttpRequest, textStatus, errorThrown) {
                    $('#btn-reset').text("SEND RESET LINK");
                    $('#reset-error').show();
                    var res = JSON.parse(XMLHttpRequest.responseText);
                    $('#reset-error .error-user').text(res.error.message.message);
                  }
              });
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



  function getSlug(value) {
    return value
        .toLowerCase()
        .replace(/ /g,'-')
        .replace(/[^\w-]+/g,'')
        ;
}

function isNumberKey(evt){
    var charCode = (evt.which) ? evt.which : event.keyCode
    if (charCode > 31 && (charCode < 48 || charCode > 57))
        return false;
    return true;
}

function getUrlVars()
{
    var vars = [], hash;
    var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
    for(var i = 0; i < hashes.length; i++)
    {
        hash = hashes[i].split('=');
        vars.push(hash[0]);
        vars[hash[0]] = hash[1];
    }
    return vars;
}
  

















