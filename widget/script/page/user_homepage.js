/**
 * Created by chaofanw on 2017/1/9.
 */
var SupplyItem = {
  template: '<li class="supply-list-item" @click="viewDetail">' +
  '  <div class="supply-list-item__left">' +
  '    <img :src="avatar" alt="">' +
  '  </div>' +
  '  <div class="supply-list-item__right">' +
  '    <div class="supply-list-item__param">' +
  '      供应名称：<span class="text-black">{{myData.skillName}}</span>' +
  '    </div>' +
  '    <div class="supply-list-item__param">' +
  '      供应价格：<strong class="text-warning">{{myData.smoney}}</strong>元' +
  '    </div>' +
  '    <div class="supply-list-item__param">' +
  '      供应状态：<span class="supply-status" v-html="getStateText(myData.State)"></span>' +
  '    </div>' +
  '    <div class="supply-item-desc">描述：{{myData.skilldetails}}</div>' +
  '  </div>' +
  '</li>',
  props: ['myData'],
  computed: {
    avatar: function() {
      return this.myData ? this.myData.sUsermodel[0].pheadimgUrl : ''
    },
  },
  methods: {
    getStateText: function(state) {
      switch(state) {
        case 1:
          return '审核中'
        case 2:
          return '<span class="text-success">通过</span>'
        case 3:
          return '<span class="text-warning">不通过</span>'
        default:
          return '已关闭'
      }
    },
    viewDetail: function() {
      Helper.openWin('supply_detail', { id: this.myData.skillID })
    },
  }
};

/* demand item */
var DemandItem = {
  template: '<li class="supply-list-item" @click="viewDetail">' +
            '  <div class="supply-list-item__left">' +
            '    <img :src="avatar" alt="">' +
            '  </div>' +
            '  <div class="supply-list-item__right">' +
            '    <div class="supply-list-item__param">' +
            '      需求名称：<span class="text-black">{{myData.demandTitle}}</span>' +
            '    </div>' +
            '    <div class="supply-list-item__param">' +
            '      需求价格：<strong class="text-warning">{{myData.dmoney}}</strong>元' +
            '    </div>' +
            '    <div class="supply-list-item__param">' +
            '      需求状态：<span class="supply-status">{{getStateText(myData.orderState)}}</span>' +
            '    </div>' +
            '    <div class="supply-item-desc">描述：{{myData.ddetails}}</div>' +
            '  </div>' +
            '</li>',
  props: ['myData'],
  data: function() {
    return {}
  },
  computed: {
    avatar: function() {
      return this.myData ? this.myData.Usermodel[0].pheadimgUrl : ''
    },
    canEdit: function() {
      return this.myData.orderState == 1 || this.myData.orderState == 3
    }
  },
  methods: {
    viewDetail: function() {
      Helper.openWin('demand_detail', { id: this.myData.demandorderId, user: 'self' })
    },
    getStateText: function(state) {
      switch(state) {
        case 1:
          return '待支付'
        case 2:
          return '审核中'
        case 3:
          return '发布中'
        case 4:
          return '进行中'
        case 5:
          return '供应完成'
        case 6:
          return '待评价'
        case 7:
          return '订单完成'
        case 8:
          return '已关闭'
        default:
          return '已删除'
      }
    }
  }
}

function initPage() {
  var vm = new Vue({
    el: '.wrapper',
    components: {
      'supply-box': SupplyItem,
      'demand-box': DemandItem
    },
    created: function () {
      this.getData();
      this.getDemands();
      this.getSupplies();
      this.getComments();
      this.checkIsFocus();
    },
    data: function () {
      return {
        userInfo: {},
        dynamic: null,
        skill: null,
        demands: [],
        supplies: [],
        uid: api.pageParam.uid,
        isMe: api.pageParam.uid === Helper.getUserId(),
        isFocus: false,
        comments: []
      }
    },
    computed: {
      avatarStyle: function() {
        return {
          'background-image': 'url(' + this.userInfo.pheadimgUrl + ')'
        }
      }
    },
    methods: {
      getData: function() {
        var self = this
        $.ajax({
          url: BaseService.apiUrl + 'getuserinfo',
          data: {
            uid: self.uid
          }
        }).then(function(res) {
          var data = ParseJson(res.data)[0]
          self.userInfo = data
          console.log(ParseJson(res.data)[0])
          if (data.Dynamicsmodel) {
            self.dynamic = data.Dynamicsmodel[0]
          }
          if (data.skillmodel) {
            self.skill = data.skillmodel[0]
            self.skill.pheadimgUrl = data.pheadimgUrl
          }
        })
      },
      getDemands: function() {
        var self = this;
        $.ajax({
          url: BaseService.apiUrl + 'getDemandOrder',
          data: {
            userid: self.uid,
            type: 2
          }
        }).then(function(res) {
          self.demands = JSON.parse(res.data).slice(0, 2);
        }, function(err) {
          alert(JSON.stringify(err))
        })
      },
      getSupplies: function() {
        var self = this
        $.ajax({
          url: BaseService.apiUrl + 'getuserSkill',
          data: { userid: self.uid, type: 2 }
        }).then(function(res) {
          if (res.key === 'true') {
            self.supplies = _.filter(JSON.parse(res.data), function(item) {
              return item.State === 2;
            }).slice(0, 2);
          }
        }, function(err) {
          console.log(JSON.stringify(err))
        })
      },
      getComments: function() {
        var self = this;
        $.ajax({
          url: BaseService.apiUrl + 'getEvaluate',
          data: {
            userid: self.uid
          }
        }).then(function(res) {
          self.comments = JSON.parse(res.data).slice(0, 2);
        })
      },
      checkIsFocus: function() {
        var self = this
        $.ajax({
          url: BaseService.apiUrl + 'chaksfgz',
          data: {
            hyuserid: self.uid,
            userid: Helper.getUserId()
          }
        }).then(function(res) {
          if (res.key === 'true') {
            self.isFocus = res.data == 1
          }
        }, function(err) {
          api.toast({
            msg: err.message
          });
        })
      },
      onFocus: function() {
        var self = this
        var uri = this.isFocus ? 'delFriends' : 'addFriends'
        $.ajax({
          url: BaseService.apiUrl + uri,
          data: {
            hyuserid: self.uid,
            userid: Helper.getUserId()
          }
        }).then(function(res) {
          if (res.key === 'true') {
            self.isFocus = !self.isFocus
            api.sendEvent({
              name: 'refreshFocusList',
            })
            api.sendEvent({
              name: 'refreshFriend'
            })
          } else {
            api.toast({
              msg: res.mage
            })
          }
        }, function(err) {
          api.toast({
            msg: err.message
          })
        })
      },
      goPage: function(pageName) {
        var pageParam = {
          uid: this.uid
        }
        Helper.openWin(pageName, pageParam)
      }
    }
  })
}

apiready = function() {
  initPage()
}