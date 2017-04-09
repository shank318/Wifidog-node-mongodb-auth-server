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



















