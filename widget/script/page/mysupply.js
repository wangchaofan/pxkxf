var ListItem = {
  template: '<li class="supply-list-item">' +
  '  <div class="supply-list-item__left">' +
  '    <img :src="avatar" alt="">' +
  '  </div>' +
  '  <div class="supply-list-item__right">' +
  '    <div class="button-edit disabled" @click="onClickEdit"></div>' +
  '    <div class="supply-list-item__param">' +
  '      供应名称：<span class="text-black">{{myData.skillName}}</span>' +
  '    </div>' +
  '    <div class="supply-list-item__param">' +
  '      供应价格：<strong class="text-warning">{{myData.smoney}}</strong>元' +
  '    </div>' +
  '    <div class="supply-list-item__param">' +
  '      供应状态：<span class="supply-status">{{myData.sfState}}</span>' +
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
        list: []
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
          data: { userid: MockData.userid }
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
/* === 测试使用 === */
setTimeout(function() {
  if (!window.api) {
    initPage()
  }
}, 500)

apiready = function(){
  initPage()
}
