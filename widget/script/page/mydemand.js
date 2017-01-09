var ListItem = {
  template: '<li class="supply-list-item">' +
            '  <div class="supply-list-item__left">' +
            '    <img :src="avatar" alt="">' +
            '  </div>' +
            '  <div class="supply-list-item__right">' +
            '    <div class="button-edit disabled" @click="onClickEdit"></div>' +
            '    <div class="supply-list-item__param">' +
            '      需求名称：<span class="text-black">{{myData.demandTitle}}</span>' +
            '    </div>' +
            '    <div class="supply-list-item__param">' +
            '      需求价格：<strong class="text-warning">{{myData.dmoney}}</strong>元' +
            '    </div>' +
            '    <div class="supply-list-item__param">' +
            '      需求状态：<span class="supply-status">{{myData.demandTitle}}</span>' +
            '    </div>' +
            '    <div class="supply-item-desc">描述：{{myData.ddetails}}</div>' +
            '  </div>' +
            '</li>',
  props: ['myData'],
  data: function() {
    return []
  },
  computed: {
    avatar: function() {
      return this.myData ? this.myData.Usermodel[0].pheadimgUrl : ''
    }
  },
  methods: {
    onClickEdit: function() {

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
      getData: function() {
        var self = this
        if (this.currentPage === 'demand') {
          $.ajax({
            url: BaseService.apiUrl + 'getDemandOrder',
            data: { userid: MockData.userid }
          }).then(function(res) {
            if (res.key === 'true') {
              self.demandList = ParseJson(res.data)
              console.log(ParseJson(res.data))
            }
          })
        } else {
          $.ajax({
            url: BaseService.apiUrl + 'getXQInvited',
            data: { userid: MockData.userid }
          }).then(function(res) {
            self.inviteList = ParseJson(res.data)
            console.log(self.inviteList)
          })
        }
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

apiready = function(){
  initPage()
}
