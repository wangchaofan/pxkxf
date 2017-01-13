var ListItem = {
  template: '<li class="supply-list-item">' +
  '  <div class="supply-list-item__left">' +
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
  '      付款金额：<strong class="text-warning">{{skill.smoney}}</strong>元' +
  '    </div>' +
  '    <div class="supply-list-item__param">' +
  '      邀约时间：{{myData.mtime | date("yyyy-MM-dd")}}' +
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
