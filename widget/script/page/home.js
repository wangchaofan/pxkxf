/**
 * Created by chaofanw on 2016/12/23.
 */
function initPage() {
  var vm = new Vue({
    el: '#mainPage',
    created: function() {
      this.getList('demandList', 'getdemaorder')
    },
    data: function() {
      return {
        demandList: [],
        supplyList: [],
        nearByList: [],
        currentTab: 'demand',
        city: '成都'
      }
    },
    methods: {
      onClickTabHead: function(tabId) {
        this.currentTab = tabId
        if (tabId === 'demand') {
          this.getList('demandList', 'getdemaorder')
        } else if (tabId === 'supply') {
          this.getList('supplyList', 'getSkill')
        } else {
          this.getList('nearByList', 'getSkill')
        }
      },
      onSelectCity: function() {
        var self = this;
        var citySelector = api.require('citySelector');
        citySelector.open({
          y: api.frameHeight / 1.6 + 50
        }, function(ret, err) {
          self.city = ret.city;
        });
      },
      getList: function(listId, uri) {
        var self = this
        if (self[listId].length > 0) return
        $.ajax({
          type: 'POST',
          dataType: 'xml',
          url: BaseService.apiUrl + uri,
          success: function(res) {
            self[listId] = JSON.parse(Helper.xmlToJson(res).string['#text'])
          },
          error: function(err) {
            alert(JSON.stringify(err))
          }
        })
      }
    }
  })
}

apiready = function(){
  initPage()

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
}