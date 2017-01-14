/**
 * Created by chaofanw on 2016/12/23.
 */
function initPage() {
  var vm = new Vue({
    el: '#mainPage',
    created: function() {
      this.getList('demandList', 'getdemaorder')
      this.getMessageCount()
    },
    data: function() {
      return {
        demandList: [],
        supplyList: [],
        nearByList: [],
        currentTab: 'demand',
        city: '成都',
        type: '',
        messageCount: ''
      }
    },
    methods: {
      goViewMessage: function() {
        api.openWin({
            name: 'message',
            url: 'widget://html/message.html',
            pageParam: {

            }
        });
      },
      getMessageCount: function() {
        var self = this
        $.ajax({
          url: BaseService.apiUrl + 'getXSchat',
          data: {userid: Helper.getUserId()}
        }).then(function(res) {
          self.messageCount = ParseJson(res.data).length
        })
      },
      onClickType: function(t) {
        this.type = t
        this.getList('supplyList', 'getSkill', true)
        this.getList('demandList', 'getdemaorder', true)
      },
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
        })
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
      getList: function(listId, uri, refresh) {
        var self = this
        if (self[listId].length > 0 && !refresh) return
        $.ajax({
          url: BaseService.apiUrl + uri,
          data: {type: self.type},
          success: function(res) {
            self[listId] = JSON.parse(res.data)
            console.log(JSON.parse(res.data))
          },
          error: function(err) {
            // alert(JSON.stringify(err))
          }
        })
      }
    }
  })
}

/* === 测试使用 === */
setTimeout(function() {
  if (!window.api) {
    initPage()
  }
}, 500)

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