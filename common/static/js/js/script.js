/////////////////Variables are like Vegetables
 var x = 0;



/* Button Shake */

var animating = false;

function periodical() {
  $('#sign_up_button').effect('shake', { times:3 }, 150, function() {
  });
}

/* Icon Bounce */

function compass_bounce(){
  $('#compass').effect("bounce", { times:2, distance:40}, 300);
}

function phone_bounce(){
  $('#phone').effect("bounce", { times:2, distance:20}, 300);
}

function checkin_bounce(){
  $('#checkin').effect("bounce", { times:2, distance:30}, 300);
}

function coin_bounce(){
  $('#coin').effect("bounce", { times:2, distance:35}, 300);
}

/* Map Resize */

function resize(){
	var height = $(window).height();
	var el_height = 160;
	var map_height = height - el_height;

	$('#map').attr('height',map_height+'px');
}
var resizeTimer;
$(window).resize(function(){
	clearTimeout(resizeTimer);
    resizeTimer = setTimeout(resize, 1);	
});

$(document).ready(resize());

$(document).ready(function(){
	
	/* About Dropdown */
	
	$('#about h4 a').click(function(){
		$('#about_text').slideToggle(100);
		});
	

	/* Button Shaker */

  	var shake = setInterval(periodical, 5000);
  
  
   $('#sign_up_button').mouseenter(function() {
    clearInterval(shake);
   });
   
  
  
  $('#sign_up_button').click(function(){x++});
  
   $('#sign_up_button').mouseleave(function() {
	   console.log(x)
	   if(x<1)
   {
	   
     var shake = setInterval(periodical, 5000);
	 
	} 
   });

   /* Icon Bouncer */
   
    var bounce = setInterval(compass_bounce, 13000);
	var bounce2 = setInterval(phone_bounce, 14000);
	var bounce3 = setInterval(checkin_bounce, 15000);
	var bounce4 = setInterval(coin_bounce, 16000);
  
  
  	/* Login Drop */
	var z =1;
	$('#login_button').click(function(){
		
		if (z){	
		$('#register_hide').css({display:'none'});
		$('#login_form').stop(true,true).slideDown(400);
		
		z=0;
		}else{
		$('#login_form').stop(true,true).slideUp(400);	
		$('#register_hide').css({display:'block'});
		z++;
		}
		
	});
  
	/* Sign-up Drop */
	var i = 1;
	$('#sign_up_button').click(function(){
		if (i){
			$('.sep1_a').toggleClass('sep1_b');
			$('#sign_up_dropdown').stop(true,true).slideToggle(200,function(){
	
				});
			i = 0;	
		}else{
			$('#sign_up_dropdown').stop(true,true).slideToggle(200,function(){
					$('.sep1_a').toggleClass('sep1_b');
			});
			i++;
		}
					
		});
		
	/***************************************** HOME PAGE ********************************************/	

	/* Profile Hover */

	
	$('#user_profile_holder').mouseenter(
		function(){
			$('#user_profile').css({height:'26px',zIndex:'200',borderLeft:'1px solid #bbbbbb',borderRight:'1px solid #f3f3f3'});
			$('#welcome').css({borderRight:'1px solid #f3f3f3'});
			$('header').css({borderRight:'1px solid #bbbbbb'});
			$('#user_profile_menu').css('display','block');
		}).mouseleave(
		function(){
			$('#user_profile').css({height:'23px',zIndex:'10',borderLeft:'1px solid #e7e7e7',borderRight:'1px solid #e7e7e7'});
			$('#welcome').css({borderRight:'1px solid #e7e7e7'});
			$('header').css({borderRight:'1px solid #ececec'});
		    $('#user_profile_menu').css('display','none');
		}
	);
	
	/* Notifications Legend */
	
	$('#notifications_holder').mouseenter(function(){
		
			console.log('stop on enter');
			$('#legend').stop(true, true).animate({opacity:'1', width:'142px'}, 200 , function(){
				console.log('animating', $('#requests_legend'));
				$('#requests_legend').css('visibility','visible');
				
				/* Arat Notificarile pe Hover */
				
				$('li', '#requests_legend').mouseenter(function(){ 
					console.log('li enter');
					$('.notifications_body',$(this)).css({display:'block'}); 	
					
					}).mouseleave(function(){
					console.log('li leave');
					$('.notifications_body',$(this)).css({display:'none'}); 		
						
				});
				
				}).css('overflow', 'visible'); ;
								
			}).mouseleave(
			
				/* Hide */
				
				function(){
					
				$('#requests_legend').css('visibility','hidden');
					console.log('stop on leave');
					$('#legend').stop().animate({opacity:'1', width:'1px'}, 200) ;
						
				});
				
	
	/*Sidebars */
	
	/*Sidebar Left*/
	var left_toggle = false;
	
	$('#sidebar_left_handle').click(function(){
		
			if(left_toggle){
				
				$('#sidebar_left').stop(true,true).animate({width:'0px'},200)
					left_toggle = false;
		
			}else{
		
			$('#sidebar_left').stop(true,true).animate({width:'50%'},200)
					left_toggle = true;
			
			}
	});
	
	/*Sidebar Right*/
	var right_toggle = false;
	
	$('#sidebar_right_handle').click(function(){
		
			if(right_toggle){
				
				$('#sidebar_right').stop(true,true).animate({width:'0px'},200)
					right_toggle = false;
		
			}else{
		
			$('#sidebar_right').stop(true,true).animate({width:'50%'},200)
					right_toggle = true;
			
			}
	});
	
		
	
	
	
	/* Widget */
	
	/* Widget opacity */
	
	$('#widget').mouseenter(function(){
		$(this).animate({opacity:1},100);
		});
		
	$('#widget').mouseleave(function(){
		$(this).animate({opacity:0.9},100);
		});	
	
	/* Widget start + stop position */
	
	$('#widget').draggable({

    // Find original position of dragged image.
    start: function(event, ui) {

        // Show start dragged position of image.
        var start_position = $(this).position();
        console.log("START: \nLeft: "+ start_position.left + "\nTop: " + start_position.top);
    },

    // Find position where image is dropped.
    stop: function(event, ui) {

        // Show dropped position.
        var stop_position = $(this).position();
        console.log("STOP: \nLeft: "+ stop_position.left + "\nTop: " + stop_position.top);
    }
	, containment: "#map_holder", scroll: false});

}); //document ready

























