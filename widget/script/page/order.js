var ListItem = {
  template: '<li class="supply-list-item" @click="viewDetail">' +
  '  <div class="supply-list-item__left" @click.stop="viewUserHomepage">' +
  '    <img :src="usermodel.pheadimgUrl" alt="">' +
  '  </div>' +
  '  <div class="supply-list-item__right">' +
  '    <div class="supply-list-item__param">' +
  '      供应用户名：<span class="text-black">{{usermodel.pnickname}}</span>' +
  '    </div>' +
  '    <div class="supply-list-item__param">' +
  '      供应名称：<span class="supply-status">{{skill.skillName}}</span>' +
  '    </div>' +
  '    <div class="supply-list-item__param">' +
  '      付款金额：<strong class="text-warning">{{myData.mmoney}}</strong>元' +
  '    </div>' +
  '    <div class="supply-list-item__param">' +
  '      邀约时间：{{myData.mtime | date("yyyy-MM-dd")}}' +
  '    </div>' +
  '    <div class="supply-list-item__param">' +
  '      订单状态：<span v-html="getStateText(myData.State)">' +
  '    </div>' +
  '    <div class="supply-item-desc">描述：{{skill.skilldetails}}</div>' +
  '  </div>' +
  '</li>',
  props: ['myData'],
  data: function() {
    return {}
  },
  computed: {
    usermodel: function() {
      return this.myData ? this.myData.Skillmodel[0].sUsermodel[0] : {}
    },
    skill: function() {
      return this.myData ? this.myData.Skillmodel[0] : {}
    }
  },
  methods: {
    viewDetail: function(item) {
      api.openWin({
        name: 'order_detail',
        url: 'widget://html/order_detail.html',
        pageParam: {
          id: this.myData.SillYYDDId
        }
      })
    },
    viewUserHomepage: function() {
      api.openWin({
        name: 'user_homepage',
        url: 'widget://html/user_homepage.html',
        pageParam: {
          uid: this.usermodel.lUserId
        }
      }) 
    },
    getStateText: function() {
      if (this.myData.fkstate == 1) {
        return '<span class="text-warning">待付款</span>'
      }
      switch(this.myData.mstate) {
        case 1: return '预约中';
        case 2: return '进行中';
        case 3: return '供应完成';
        case 4: return '待评价';
        case 5: return '订单完成';
        case 6: return '订单取消';
        default: return '订单拒绝';
      }
    }
  }
};


var ServiceListItem = {
  template: '<li class="supply-list-item" @click="viewDetail">' +
  '  <div class="supply-list-item__left" @click.stop="viewUserHomepage">' +
  '    <img :src="usermodel.pheadimgUrl" alt="">' +
  '  </div>' +
  '  <div class="supply-list-item__right">' +
  '    <div class="supply-list-item__param">' +
  '      预约用户：<span class="text-black">{{usermodel.pnickname}}</span>' +
  '    </div>' +
  '    <div class="supply-list-item__param">' +
  '      供应名称：<span class="supply-status">{{skill.skillName}}</span>' +
  '    </div>' +
  '    <div class="supply-list-item__param">' +
  '      付款金额：<strong class="text-warning">{{myData.mmoney}}</strong>元' +
  '    </div>' +
  '    <div class="supply-list-item__param">' +
  '      邀约时间：{{myData.mtime | date("yyyy-MM-dd")}}' +
  '    </div>' +
  '    <div class="supply-list-item__param">' +
  '      订单状态：{{getStateText(myData.State)}}' +
  '    </div>' +
  '    <div class="supply-item-desc">描述：{{skill.skilldetails}}</div>' +
  '  </div>' +
  '</li>',
  props: ['myData'],
  data: function() {
    return {}
  },
  computed: {
    usermodel: function() {
      return this.myData ? this.myData.usermodel[0] : {}
    },
    skill: function() {
      return this.myData ? this.myData.Skillmodel[0] : {}
    }
  },
  methods: {
    viewDetail: function(item) {
      Helper.openWin('service_order_detail', {id: this.myData.SillYYDDId});
    },
    viewUserHomepage: function() {
      Helper.openWin('user_homepage', {uid: this.usermodel.lUserId});
    },
    getStateText: function() {
      switch(this.myData.mstate) {
        case 1: return '预约中';
        case 2: return '进行中';
        case 3: return '供应完成';
        case 4: return '待评价';
        case 5: return '订单完成';
        case 6: return '订单取消';
        default: return '订单拒绝';
      }
    }
  }
};

var InviteItem = {
  template: '<li class="supply-list-item" @click="viewDetail">' +
  '  <div class="supply-list-item__left">' +
  '    <img :src="avatar" alt="">' +
  '  </div>' +
  '  <div class="supply-list-item__right">' +
  '    <div class="supply-list-item__param">' +
  '      需求名称：<span class="text-black">{{demand.demandTitle}}</span>' +
  '    </div>' +
  '    <div class="supply-list-item__param">' +
  '      需求价格：<strong class="text-warning">{{demand.dmoney}}</strong>元' +
  '    </div>' +
  '    <div class="supply-list-item__param">' +
  '      需求状态：<span class="supply-status">{{getStateText(demand.orderState)}}</span>' +
  '    </div>' +
  '    <div class="supply-item-desc">描述：{{demand.ddetails}}</div>' +
  '  </div>' +
  '</li>',
  props: ['myData'],
  data: function() {
    return {}
  },
  computed: {
    demand: function() {
      return this.myData.DemandOrder[0]
    },
    avatar: function() {
      return this.myData ? this.myData.DemandOrder[0].Usermodel[0].pheadimgUrl : ''
    }
  },
  methods: {
    viewDetail: function() {
      var self = this
      api.openWin({
        name: 'demand_detail',
        url: 'widget://html/demand_detail.html',
        pageParam: {
          id: this.myData.demandorderId
        }
      })
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
          return '订单已完成'
        case 8:
          return '已关闭'
        default:
          return '已删除'
      }
    }
  }
};

function initPage() {
  var vm = new Vue({
    el: '.wrapper',
    created: function() {
      this.getData(this.state)
    },
    components: {
      'list-item': ListItem,
      'service-list-item': ServiceListItem,
      'invite-item': InviteItem
    },
    data: function() {
      return {
        doingList: [],
        cancelList: [],
        completeList: [],
        serviceDoingList: [],
        serviceCancelList: [],
        serviceCompleteList: [],
        inviteList: [],
        state: 1,
        serviceState: 1,
        currentPage: 'my'
      }
    },
    computed: {
      uri: function() {
        return this.currentPage === 'my' ? 'skilldd' : 'getskillyyddfw'
      },
      wrapperStyle: function() {
        return this.currentPage === 'invite' ? {'padding-top': '44px'} : {'padding-top': '88px'}
      }
    },
    watch: {
      state: function(val) {
        this.getData(val)
      },
      serviceState: function(val) {
        this.getData(val)
      }
    },
    methods: {
      onSelectType: function(state) {
        if (this.currentPage === 'my') {
          this.state = state
        } else if (this.currentPage === 'service') {
          this.serviceState = state
        }
      },
      onClickNav: function(val) {
        if (this.currentPage === val) return
        this.currentPage = val
        if (val === 'my') {
          this.getData(this.state)
        } else if (this.currentPage === 'service') {
          this.getData(this.serviceState)
        } else {
          this.getInviteOrder();
        }
      },
      getData: function(state) {
        var self = this;
        $.ajax({
          url: BaseService.apiUrl + this.uri,
          data: { userid: Helper.getUserId(), state: state }
        }).then(function(res) {
          api.refreshHeaderLoadDone();
          if (res.key === 'true') {
            console.log(ParseJson(res.data));
            self.setData(ParseJson(res.data));
          }
        })
      },
      getInviteOrder: function() {
        var self = this;
        $.ajax({
          url: BaseService.apiUrl + 'getXQInvited',
          data: { userid: Helper.getUserId() }
        }).then(function(res) {
          self.inviteList = _.filter(ParseJson(res.data), function(item) {
            return item.DemandOrder[0].orderState != -1;
          });
          api.refreshHeaderLoadDone();
          console.log(ParseJson(res.data))
        })
      },
      setData: function(data) {
        if (this.currentPage === 'my') {
          if (this.state === 1) {
            this.doingList = data
          } else if (this.state === 2) {
            this.completeList = data
          } else {
            this.cancelList = data
          }
        } else {
          if (this.serviceState === 1) {
            this.serviceDoingList = data
          } else if (this.serviceState === 2) {
            this.serviceCompleteList = data
          } else {
            this.serviceCancelList = data
          }
        }
      }
    }
  })

  api.addEventListener({
    name: 'refreshOrder'
  }, function(ret, err) {
    vm.getData(1)
  })

  api.setRefreshHeaderInfo({
    visible: true,
    loadingImg: 'widget://image/refresh.png',
    bgColor: '#ddd',
    textColor: '#333',
    textDown: '下拉刷新...',
    textUp: '松开刷新...',
    textLoading: '加载中...',
    showTime: false
  }, function(ret, err) {
    if (vm.currentPage === 'my') {
      vm.getData(vm.state)
    } else if (vm.currentPage ===' service') {
      vm.getData(vm.serviceState)
    } else {
      vm.getInviteOrder()
    }
  })
}

apiready = function(){
  initPage()
}
