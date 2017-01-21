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
      switch(this.myData.State) {
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
}
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
      switch(this.myData.State) {
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
}

function initPage() {
  var vm = new Vue({
    el: '.wrapper',
    created: function() {
      this.getData(this.state)
    },
    components: {
      'list-item': ListItem,
      'service-list-item': ServiceListItem
    },
    data: function() {
      return {
        doingList: [],
        cancelList: [],
        completeList: [],
        serviceDoingList: [],
        serviceCancelList: [],
        serviceCompleteList: [],
        state: 1,
        serviceState: 1,
        currentPage: 'my'
      }
    },
    computed: {
      uri: function() {
        return this.currentPage === 'my' ? 'skilldd' : 'getskillyyddfw'
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
        } else {
          this.serviceState = state
        }
      },
      onClickNav: function(val) {
        if (this.currentPage === val) return
        this.currentPage = val
        if (val === 'my') {
          this.getData(this.state)
        } else {
          this.getData(this.serviceState)
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
    showTime: false
  }, function(ret, err) {
    vm.getData()
  })
}
/* === 测试使用 === */
setTimeout(function() {
  if (!window.api) {
    initPage()
  }
}, 500)

apiready = function(){
  initPage()
}
