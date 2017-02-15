/**
 * Created by chaofanw on 2016/12/23.
 */
var vm
function initPage() {
  vm = new Vue({
    el: '#mainPage',
    created: function() {
      this.getList();
      this.getMessageCount();
      this.getLocation();
      this.getWeather();
    },
    data: function() {
      return {
        demandList: [],
        supplyList: [],
        nearByList: [],
        currentTab: 'demand',
        city: '成都市',
        type: '',
        messageCount: '',
        weatherText: '',
        temperature: '',
        demandNum: 1,
        supplyNum: 1,
        nearByNum: 1
      }
    },
    filters: {
      number: function(val) {
        return parseFloat(val).toFixed(2)
      }
    },
    methods: {
      viewUserHomepage: function(user) {
        Helper.openWin('user_homepage', {uid: user.lUserId});
      },
      getLocation: function() {
        var self = this
        api.ajax({
          url: 'http://api.map.baidu.com/location/ip?ak=HSXjSbv4ZGFgRHwLwvje7tqo',
          method: 'get',
          timeout: 30,
          dataType: 'json',
          returnAll: false
        }, function (ret, err) {
          if (ret) {
            self.city = ret.content.address_detail.city
          }
        })
      },
      getWeather: function() {
        var self = this
        $.ajax({
          type: 'get',
          url: 'https://api.thinkpage.cn/v3/weather/now.json',
          data: {
            key: 'ugvl5p1eioqcd3lq',
            location: self.city,
            language: 'zh-Hans',
            unit: 'c'
          },
          dataType: 'json',
          dataFilter: function(res) {
            return res
          }
        }).then(function(res) {
          self.temperature = res.results[0].now.temperature
          self.weatherText = res.results[0].now.text
        })
      },
      goViewMessage: function() {
        Helper.openWin('message');
      },
      getMessageCount: function() {
        var self = this
        var rong = api.require('rongCloud2');
        rong.getTotalUnreadCount(function(ret, err) {
          if (ret.status === 'success') {
            self.messageCount = ret.result
          }
        })
        // $.ajax({
        //   url: BaseService.apiUrl + 'getXSchat',
        //   data: {userid: Helper.getUserId()}
        // }).then(function(res) {
        //   self.messageCount = ParseJson(res.data).length
        // })
      },
      onClickType: function(t) {
        Helper.openWin('category_list', {category: t})
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
          y: api.frameHeight / 1.6 + 50,
          titleImg: 'widget://image/topbar_bg.jpg',
          bgImg: 'widget://image/cityselector_bg.jpg',
          cancelImg: 'widget://image/button_cancel.jpg',
          enterImg: 'widget://image/button_ok.jpg',
          fontColor: '#666'
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
      getDemandList: function() {
        var self = this;
        var data = {
          type: this.type,
          userid: Helper.getUserId(),
          num: this.demandNum
        };
        $.ajax({
          url: BaseService.apiUrl + 'getdemaorder',
          data: data,
          success: function(res) {
            var data = JSON.parse(res.data);
            data = _.filter(data, function(u) {
              return u.fUserId !== data.userid;
            });
            if (data.num === 1) {
              self.demandList = data
            } else {
              self.demandList = self.demandList.concat(data);
            }
            self.demandNum += 1;
            console.log(JSON.parse(res.data))
            api.refreshHeaderLoadDone()
          },
          error: function(err) {
            // alert(JSON.stringify(err))
          }
        })
      },
      getSupplyList: function() {
        var self = this;
        var data = {
          type: this.type,
          userid: Helper.getUserId(),
          num: this.supplyNum
        };
        $.ajax({
          url: BaseService.apiUrl + 'getSkill',
          data: data,
          success: function(res) {
            var data = JSON.parse(res.data);
            data = _.filter(data, function(u) {
              return u.sUserId !== data.userId;
            });
            if (data.num === 1) {
              self.supplyList = data
            } else {
              self.supplyList = self.supplyList.concat(data)
            }
            self.supplyNum += 1;
            console.log(JSON.parse(res.data))
            api.refreshHeaderLoadDone()
          },
          error: function(err) {
            // alert(JSON.stringify(err))
          }
        })
      },
      getNearByList: function() {

      },
      getList: function(refresh) {
        if (this.currentTab === 'demand') {
          refresh && (this.demandNum = 1);
          this.getDemandList();
        } else if (this.currentTab === 'supply') {
          refresh && (this.supplyNum = 1);
          this.getSupplyList();
        } else {
          refresh && (this.nearByNum = 1);
          this.nearByList = _.clone(this.demandList)
        }
      }
    }
  })

  var rong = api.require('rongCloud2');
  Helper.getRongcloudToken().then(function(res) {
    rong.connect({
      token: res.data
    }, function(ret, err) {
      if (ret.status == 'success') {
        api.setPrefs({
          key: 'rongUserId',
          value: ret.result.userId
        })
      }
    })
  }, function(err) {
    alert(JSON.stringify(err))
  })

  api.addEventListener({
    name: 'scrolltobottom',
    extra:{
      threshold: 50     //设置距离底部多少距离时触发，默认值为0，数字类型
    }
  }, function (ret, err) {
    vm.getList()
  });
}

apiready = function() {
  initPage()

  api.setRefreshHeaderInfo({
    visible: true,
    loadingImg: 'widget://image/refresh.png',
    bgColor: '#ddd',
    textColor: '#333',
    textDown: '下拉刷新...',
    textUp: '松开刷新...',
    showTime: false
  }, function(ret, err) {
    vm.getList(true)
    vm.getList(true)
  })

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
