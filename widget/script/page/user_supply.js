var ListItem = {
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
  data: function() {
    return []
  },
  computed: {
    avatar: function() {
      return this.myData ? this.myData.sUsermodel[0].pheadimgUrl : ''
    },
    canEdit: function() {
      return this.myData.state != 1 && this.myData.state != 0
    },
    showEditButton: function() {
      return !api.pageParam.uid
    }
  },
  methods: {
    getStateText: function(state) {
      switch(state) {
        case 1:
          return '审核中'
        case 2:
          return '<span class="text-success">发布中</span>'
        // case 3:
        //   return '<span class="text-warning">不通过</span>'
        // default:
          return '已关闭'
      }
    },
    viewDetail: function() {
      Helper.openWin('supply_detail', {id: this.myData.skillID })
    },
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
      'list-item': ListItem
    },
    data: function() {
      return {
        user: api.pageParam.userInfo,
        list: null
      }
    },
    computed: {
      pageTitle: function() {
        return this.user.pnickname + '的供应'
      }
    },
    methods: {
      onClickNav: function(page) {
        this.currentPage = page
      },
      getData: function() {
        var self = this
        $.ajax({
          url: BaseService.apiUrl + 'getuserSkill',
          data: { userid: this.user.lUserId, type: 2 }
        }).then(function(res) {
          if (res.key === 'true') {
            self.list = ParseJson(res.data)
            console.log(ParseJson(res.data))
          }
        })
      }
    }
  })
}

apiready = function(){
  initPage()
}
