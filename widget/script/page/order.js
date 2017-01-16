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
      return this.myData ? this.myData.usermodel[0] : {}
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

function initPage() {
  var vm = new Vue({
    el: '.wrapper',
    created: function() {
      this.getData()
    },
    components: {
      'list-item': ListItem
    },
    data: function() {
      return {
        doingList: [],
        cancelList: [],
        completeList: [],
        state: 1,
      }
    },
    methods: {
      onSelectType: function(state) {
        this.state = state
        this.getData()
      },
      getData: function() {
        var self = this
        $.ajax({
          url: BaseService.apiUrl + 'skilldd',
          data: { userid: Helper.getUserId(), state: self.state }
        }).then(function(res) {
          if (res.key === 'true') {
            console.log(ParseJson(res.data))
            if (self.state === 1) {
              self.doingList = ParseJson(res.data)
            } else if (self.state === 2) {
              self.completeList = ParseJson(res.data)
            } else {
              self.cancelList = ParseJson(res.data)
            }
          }
        })
      }
    }
  })

  api.addEventListener({
    name: 'refreshOrder'
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
