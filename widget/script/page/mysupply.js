var ListItem = {
  template: '<li class="supply-list-item" @click="viewDetail">' +
  '  <div class="supply-list-item__left">' +
  '    <img :src="avatar" alt="">' +
  '  </div>' +
  '  <div class="supply-list-item__right">' +
  '    <div class="button-edit" v-if="showEditButton" @click.stop="onClickEdit">操作</div>' +
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
          return '通过'
        case 3:
          return '不通过'
        default:
          return '已关闭'
      }
    },
    viewDetail: function() {
      api.openWin({
        name: 'supply_detail',
        url: 'widget://html/supply_detail.html',
        pageParam: {
          id: this.myData.skillID
        }
      })
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
            url: BaseService.apiUrl + 'deleteskill',
            data: {skillid: self.myData.skillID}
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
            Helper.openWin('add_edit_supply', {id: self.myData.skillID})
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

var vm

function initPage() {
  vm = new Vue({
    el: '.wrapper',
    created: function() {
      if (api.pageParam.searchContent) {
        this.getSearchResult(api.pageParam.searchContent)
      } else {
        this.getData()
      }
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
      getSearchResult: function(content) {
        var self = this
        $.ajax({
          url: BaseService.apiUrl + 'getsc',
          data: {
            content: content
          }
        }).then(function(res) {
          self.list = ParseJson(res.data)
          console.log(ParseJson(res.data))
        })
      },
      getData: function() {
        var self = this
        $.ajax({
          url: BaseService.apiUrl + 'getuserSkill',
          data: { userid: api.pageParam.uid || Helper.getUserId() }
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
