var ListItem = {
  template: '<li class="supply-list-item" @click="viewDetail">' +
            '  <div class="supply-list-item__left">' +
            '    <img :src="avatar" alt="">' +
            '  </div>' +
            '  <div class="supply-list-item__right">' +
            '    <div class="button-edit" @click.stop="onClickEdit">操作</div>' +
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
      return !(this.myData.orderState == 1 || this.myData.orderState == 3)
    }
  },
  methods: {
    viewDetail: function() {
      var self = this
      api.openWin({
        name: 'demand_detail',
        url: 'widget://html/demand_detail.html',
        pageParam: {
          id: this.myData.demandorderId,
          user: 'self'
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
          return '订单完成'
        case 8: 
          return '已关闭'
        default:
          return '已删除'
      }
    },
    delete: function() {
      var self = this
      api.confirm({
        title: '提示',
        msg: '确认删除？',
        buttons: ['确定', '取消']
      }, function(ret, err) {
        if (ret.buttonIndex === 1) {
          $.ajax({
            url: BaseService.apiUrl + 'deletexq',
            data: {xqid: self.myData.demandorderId}
          }).then(function(res) {
            if (res.key === 'true') {
              vm.getData()
            } else {
              api.toast({
                  msg: res.mage
              })
            }
          })
        }
      })
    },
    onClickEdit: function() {
      var self = this
      var buttons = ['删除']
      if (this.canEdit) {
        buttons.splice(0, 0, '修改')
      }
      api.actionSheet({
        cancelTitle: '取消',
        buttons: buttons
      }, function(ret, err) {
        if (self.canEdit) {
          if (ret.buttonIndex === 1) {
            Helper.openWin('add_edit_demand', {id: self.myData.demandorderId})
          } else if (ret.buttonIndex === 2) {
            self.delete()
          }
        } else {
          if (ret.buttonIndex === 1) {
            self.delete()
          }
        }
      })
    }
  }
}

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
          return '订单完成'
        case 8: 
          return '已关闭'
        default:
          return '已删除'
      }
    }
  }
}

var vm

function initPage() {
  vm = new Vue({
    el: '.wrapper',
    created: function() {
      this.getData()
    },
    components: {
      'list-item': ListItem,
      'invite-item': InviteItem
    },
    data: function() {
      return {
        currentPage: 'demand',
        demandList: [],
        inviteList: []
      }
    },
    watch: {
      currentPage: function(val, oVal) {
        if (val === 'demand') {
          this.demandList.length === 0 && this.getData()
        } else {
          this.inviteList.length === 0 && this.getData()
        }
      }
    },
    methods: {
      onClickNav: function(page) {
        this.currentPage = page
      },
      returnBack: function() {
        api.closeWin()
      },
      getData: function() {
        var self = this
        if (this.currentPage === 'demand') {
          $.ajax({
            url: BaseService.apiUrl + 'getDemandOrder',
            data: { userid: Helper.getUserId() }
          }).then(function(res) {
            if (res.key === 'true') {
              self.demandList = ParseJson(res.data)
              console.log(ParseJson(res.data))
            }
          })
        } else {
          $.ajax({
            url: BaseService.apiUrl + 'getXQInvited',
            data: { userid: Helper.getUserId() }
          }).then(function(res) {
            self.inviteList = ParseJson(res.data)
            console.log(ParseJson(res.data))
          })
        }
      }
    }
  })
  api.addEventListener({
    name: 'refreshMyDemand'
  }, function(ret, err) {
    vm.getData('demand')
    vm.getData()
  });
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
