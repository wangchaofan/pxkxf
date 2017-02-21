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
      /*　获取消息数量　*/
      getMessageCount: function() {
        var self = this
        var rong = api.require('rongCloud2');
        rong.getTotalUnreadCount(function(ret, err) {
          if (ret.status === 'success') {
            self.messageCount = ret.result
          }
        });
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
        var UIActionSelector = api.require('UIActionSelector');
        UIActionSelector.open({
          datas: 'widget://res/city.json',
          layout: {
            row: 5,
            col: 2,
            height: 40,
            size: 14,
            sizeActive: 14,
            rowSpacing: 5,
            colSpacing: 10,
            maskBg: 'rgba(0,0,0,0.2)',
            bg: '#fff',
            color: '#888',
            colorActive: '#e4353a',
            colorSelected: '#e4353a'
          },
          animation: true,
          cancel: {
            text: '取消',
            size: 14,
            w: 90,
            h: 35,
            bg: '#ddd',
            bgActive: '#ddd',
            color: '#fff',
            colorActive: '#fff'
          },
          ok: {
            text: '确定',
            size: 14,
            w: 90,
            h: 35,
            bg: '#e4353a',
            bgActive: '#e4353a',
            color: '#fff ',
            colorActive: '#fff'
          },
          title: {
            text: '请选择',
            size: 14,
            h: 44,
            bg: '#eee',
            color: '#333'
          }
        }, function(ret, err) {
          self.city = ret.level2;
        });
      },
      viewDemandDetail: function(data) {
        Helper.openWin('demand_detail', {id: data.demandorderId});
      },
      viewSupplyDetail: function(data) {
        Helper.openWin('supply_detail', {id: data.skillID, user: data.sUserId === Helper.getUserId() ? 'self' : ''});
      },
      getDemandList: function() {
        var self = this;
        var postData = {
          type: this.type,
          userid: Helper.getUserId(),
          num: this.demandNum
        };
        $.ajax({
          url: BaseService.apiUrl + 'getdemaorder',
          data: postData,
          success: function(res) {
            var data = JSON.parse(res.data);
            data = _.filter(data, function(u) {
              return u.fUserId !== data.userid;
            });
            if (postData.num === 1) {
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
        var postData = {
          type: this.type,
          userid: Helper.getUserId(),
          num: this.supplyNum
        };
        $.ajax({
          url: BaseService.apiUrl + 'getSkill',
          data: postData,
          success: function(res) {
            var data = JSON.parse(res.data);
            data = _.filter(data, function(u) {
              return u.sUserId !== data.userId;
            });
            if (postData.num === 1) {
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
