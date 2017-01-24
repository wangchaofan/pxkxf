var ListItem = {
  template: '<div class="supply-list-item container" @click="viewDetail">' +
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
  // '    <div class="supply-list-item__param">' +
  // '      付款金额：<strong class="text-warning">{{myData.mmoney}}</strong>元' +
  // '    </div>' +
  // '    <div class="supply-list-item__param">' +
  // '      邀约时间：{{myData.mtime | date("yyyy-MM-dd")}}' +
  // '    </div>' +
  // '    <div class="supply-list-item__param">' +
  // '      订单状态：{{getStateText(myData.State)}}' +
  // '    </div>' +
  // '    <div class="supply-item-desc">描述：{{skill.skilldetails}}</div>' +
  '  </div>' +
  '</div>',
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
        reload: true,
        pageParam: {
          id: this.myData.SillYYDDId
        }
      })
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
}

function initPage() {
  var vm = new Vue({
    el: '.wrapper',
    created: function() {
      this.getData()
    },
    data: function() {
      return {
        order: null,
        type: api.pageParam.orderType,
        comment: {
          userid: Helper.getUserId(),
          ddid: '',
          jlpj: 0, // 供应评分
          rpj: 0, // 供应人评分
          describe: '',
          type: api.pageParam.orderType === 'service' ? 2 : 1
        }
      }
    },
    components: {
      'order-box': ListItem
    },
    methods: {
      selectGyScore: function(n) {
        this.comment.jlpj = n
      },
      selectGpScore: function(n) {
        this.comment.rpj = n
      },
      validate: function() {
        if (this.comment.describe === '') {
          api.toast({msg: '请填写评价内容'}) 
          return false
        } else if (this.comment.jlpj === 0) {
          api.toast({msg: '请给供应评分'}) 
          return false
        } else if (this.comment.rpj === 0) {
          api.toast({msg: '请给供应人评分'}) 
          return false
        }
        return true
      },
      onSubmit: function() {
        if (!this.validate()) return;
        var self = this;
        var uri = this.type === 'service' ? 'gygyddpl' : 'yygyddpl';
        this.comment.ddid = this.order.SillYYDDId;
        $.ajax({
          url: BaseService.apiUrl + uri,
          data: this.comment
        }).then(function(res) {
          if (res.key === 'true') {
            api.toast({msg: '评价成功'});
            setTimeout(function() {
              api.closeToWin({
                name: self.type === 'service' ? 'service_order_detail' : 'order_detail'
              })
            }, 2000)
          } else {
            api.toast({msg: res.mage})
          }
        }, function(err) {
          alert(JSON.stringify(err))
        })
      },
      getData: function () {
        var self = this
        var uri = this.type === 'service' ? 'fwskillddinfo' : 'fwskillddinfo';
        $.ajax({
          url: BaseService.apiUrl + uri,
          data: {
            skillddid: api.pageParam.id
          }
        }).then(function(res) {
          if (res.key === 'true') {
            self.order = ParseJson(res.data)[0]
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
