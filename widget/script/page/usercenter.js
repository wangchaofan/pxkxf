/**
 * Created by chaofanw on 2017/1/9.
 */
var supply = {
  template: '<li class="supply-list-item" @click="viewSupplyDetail">' +
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
  '      供应状态：<span class="supply-status">{{getStateText(myData.sfState)}}</span>' +
  '    </div>' +
  '    <div class="supply-item-desc">描述：{{myData.skilldetails}}</div>' +
  '  </div>' +
  '</li>',
  props: ['myData'],
  data: function() {
    return {}
  },
  computed: {
    avatar: function() {
      return this.myData ? this.myData.pheadimgUrl : ''
    }
  },
  methods: {
    getStateText: function(state) {
      switch(state) {
        case 1:
          return '审核中'
        case 2:
          return '通过'
        case 3:
          return '不通过'
        default:
          return '已关闭'
      }
    },
    viewSupplyDetail: function() {
      api.openWin({
        name: 'supply_detail',
        url: 'widget://html/supply_detail.html',
        pageParam: {
          id: this.myData.skillID
        }
      })
    }
  }
}

function initPage() {
  var vm = new Vue({
    el: '.wrapper',
    components: {
      'supply-box': supply
    },
    created: function() {
      if (this.userid) {
        this.getUserInfo()
      }
    },
    data: function() {
      return {
        userid: Helper.getUserId(),
        userInfo: {
          pheadimgUrl: '../image/default_avatar.png'
        },
        dynamic: null,
        skill: null
      }
    },
    computed: {
      avatarStyle: function() {
        return 'background-image:url('+ this.userInfo.pheadimgUrl +')'
      }
    },
    methods: {
      viewDynamic: function() {
        api.openWin({
          name: 'dynamic_detail',
          url: 'widget://html/dynamic_detail.html',
          pageParam: {
            id: this.dynamic.dynamicsId
          }
        })
      },
      goPage: function(pageName) {
        if (!this.userid) {
          pageName = 'login'
        }
        api.openWin({
          name: pageName,
          url: 'widget://html/' + pageName + '.html',
          pageParam: {

          }
        })
      },
      getUserInfo: function() {
        var self = this
        $.ajax({
          url: BaseService.apiUrl + 'getuserinfo',
          data: { uid: self.userid }
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
      }
    }
  })

  api.addEventListener({
    name: 'loginSuccess'
  }, function(ret, err) {
    if (ret) {
      vm.userid =  Helper.getUserId()
      vm.getUserInfo()
    }
  })
  api.addEventListener({
    name: 'logoutSuccess'
  }, function(ret, err) {
    vm.userid =  Helper.getUserId()
    vm.userInfo.pheadimgUrl = '../image/default_avatar.png'
  })
  api.addEventListener({
      name: 'editAvatarSuccess'
  }, function(ret, err) {
      if (ret) {  
        vm.userInfo.pheadimgUrl = ret.value.avatar
      }
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