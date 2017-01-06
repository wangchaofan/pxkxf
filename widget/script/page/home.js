/**
 * Created by chaofanw on 2016/12/23.
 */
function initPage() {
  var vm = new Vue({
    el: 'body',
    created: function() {
      this.getDemandList()
    },
    data: function() {
      return {
        demandList: [],
        currentTab: 'remand'
      }
    },
    methods: {
      getDemandList: function() {
        var self = this
        $.ajax({
          url: BaseService.apiUrl + 'getdemaorder',
          success: function(res) {
            res = JSON.parse(res)
            self.demandList = JSON.parse(res.data)
            console.log(JSON.parse(res.data))

          },
          error: function(err) {
            alert(JSON.stringify(err))
          }
        })
      }
    }
  })
}
$(function() {
  var mySwiper = new Swiper('.swiper-container', {
    loop: true,
    autoplay: 3000,
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

  initPage()
})

apiready = function(){
  initPage()
}