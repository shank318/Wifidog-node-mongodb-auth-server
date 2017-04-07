function fb_login(){
    FB.login(function(response) {
        if (response.authResponse) {
            console.log('Welcome!  Fetching your information.... ');
            //console.log(response); // dump complete info
            access_token = response.authResponse.accessToken; //get access token
            user_id = response.authResponse.userID; //get FB UID
            testAPI();
        } else {
            //user hit cancel button
            console.log('User cancelled login or did not fully authorize.');
        }
    }, {
        scope: 'email'
    });
}

  // This function is called when someone finishes with the Login
  // Button.  See the onlogin handler attached to it in the sample
  // code below.
  function checkLoginState() {
    FB.getLoginStatus(function(response) {
      statusChangeCallback(response);
    });
  }

  function fbLogout() {
        FB.logout(function (response) {
            //Do what ever you want here when logged out like reloading the page
            window.location.reload();
        });
    }

  window.fbAsyncInit = function() {
  FB.init({
    appId      : '1194852527224750',
    cookie     : true,  // enable cookies to allow the server to access 
                        // the session
    xfbml      : true,  // parse social plugins on this page
    version    : 'v2.5', // use graph api version 2.5
    show_faces : false
  });

  // Now that we've initialized the JavaScript SDK, we call 
  // FB.getLoginStatus().  This function gets the state of the
  // person visiting this page and can return one of three states to
  // the callback you provide.  They can be:
  //
  // 1. Logged into your app ('connected')
  // 2. Logged into Facebook, but not your app ('not_authorized')
  // 3. Not logged into Facebook and can't tell if they are logged into
  //    your app or not.
  //
  // These three cases are handled in the callback function.

  FB.getLoginStatus(function(response) {
    statusChangeCallback(response);
  });

  };

  // Load the SDK asynchronously
  (function(d, s, id) {
    var js, fjs = d.getElementsByTagName(s)[0];
    if (d.getElementById(id)) return;
    js = d.createElement(s); js.id = id;
    js.src = "//connect.facebook.net/en_US/sdk.js";
    fjs.parentNode.insertBefore(js, fjs);
  }(document, 'script', 'facebook-jssdk'));

  // Here we run a very simple test of the Graph API after login is
  // successful.  See statusChangeCallback() for when this call is made.
  function testAPI() {
    console.log('Welcome!  Fetching your information.... ');
    FB.api('/me', { fields: 'name,email' }, function(response) {
      console.log('Successful login for: ' + response.email + response.name + response.id);
      $(document).ready(function(){
      $("#facebookform").submit( function(eventObj) {
      var catId = getUrlVars()["catId"];
      var regId = getUrlVars()["regId"];
      var gid = getUrlVars()["gid"];
      if(catId && regId && gid){
      $(this).append('<input type="hidden" name="catId" value="'+catId.replace('#','')+'" /> ');
      $(this).append('<input type="hidden" name="regId" value="'+regId.replace('#','')+'" /> ');
      $(this).append('<input type="hidden" name="gid" value="'+gid.replace('#','')+'" /> ');
      }
      $(this).append('<input type="hidden" name="facebook_id" value="'+response.id+'" /> ');
      $(this).append('<input type="hidden" name="name" value="'+response.name+'" /> ');
      $(this).append('<input type="hidden" name="email" value="'+response.email+'" /> ');
      return true;
  });
      $("#facebookform").submit();
      });
    });
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