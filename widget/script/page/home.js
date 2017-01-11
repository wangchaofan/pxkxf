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
      onClickSearchButton: function() {
        api.openWin({
            name: 'search',
            url: 'widget://html/search.html',
            pageParam: {
                name: 'test'
            }
        });
      },
      onClickTabHead: function(tabId) {
        this.currentTab = tabId
        console.log(tabId)
        if (tabId === 'demand') {
          this.getList('demandList', 'getdemaorder')
        } else if (tabId === 'supply') {
          this.getList('supplyList', 'getSkill')
        } else {
          this.nearByList = _.clone(this.demandList)
          // this.getList('nearByList', 'getSkill')
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
      viewDemandDetail: function(data) {
        api.openWin({
            name: 'demand_detail',
            url: 'widget://html/demand_detail.html',
            pageParam: {
              id: data.demandorderId
            }
        });
      },
      viewSupplyDetail: function(data) {
        api.openWin({
            name: 'supply_detail',
            url: 'widget://html/supply_detail.html',
            pageParam: {
              id: data.skillID
            }
        });
      },
      getList: function(listId, uri) {
        var self = this
        if (self[listId].length > 0) return
        console.log(2)
        $.ajax({
          url: BaseService.apiUrl + uri,
          success: function(res) {
            self[listId] = JSON.parse(res.data)
          },
          error: function(err) {
            // alert(JSON.stringify(err))
          }
        })
      }
    }
  })
}
apiready = function() {
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