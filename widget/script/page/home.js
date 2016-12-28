/**
 * Created by chaofanw on 2016/12/23.
 */
$(function() {
  var mySwiper = new Swiper('.swiper-container', {
    loop: true,
    autoplay: 3000,

    // 如果需要分页器
    pagination: '.swiper-pagination'
  })

  var $header = $('.top-banner-bottom');
  var ScorllTop = 272 * window.innerWidth / 720

  $(window).on('scroll', function() {
  	if (window.scrollY >= ScorllTop) {
  		$header.addClass('fixed')
  	} else {
  		$header.removeClass('fixed')
  	}
  })

  apiready = function(){
    var vm = new Vue({
	  	el: 'body',
	  	created: function() {
	  		// api.ajax({
	  		//     url: 'http://120.26.116.143:809/WebServer/userServer.asmx/getSkill',
	  		//     method: 'post',
	  		//     dataType: 'json'
	  		// },function(ret, err){
	  		//     if (ret) {
	  		//         alert( JSON.stringify( ret ) );
	  		//     } else {
	  		//         alert( JSON.stringify( err ) );
	  		//     }
	  		// });
	  		// $.ajax({
	  		// 	type: 'POST',
	  		// 	dataType: 'json',
	  		// 	url: 'http://120.26.116.143:809/WebServer/userServer.asmx/getSkill',
	  		// 	success: function(res) {
	  		// 		alert(1)
	  		// 		alert(res)
	  		// 		// alert(JSON.stringify(res))
	  		// 	},
	  		// 	error: function(err) {
	  		// 		alert(2)
	  		// 		alert(JSON.stringify(err))
	  		// 	}
	  		// })
	  	}
	  })
  }
})