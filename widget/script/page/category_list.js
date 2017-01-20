var DemandItem = {
  template: '<li @click="viewDetail(item)">' +
            '    <a class="display-flex">' +
            '      <div class="user-info">' +
            '        <div class="user-avatar-wrap" @click.stop="viewUserHomepage(item.Usermodel[0])">' +
            '          <img class="user-avatar" v-bind:src="item.Usermodel[0].pheadimgUrl" alt="">' +
            '          <div class="p-tag">需求</div>' +
            '        </div>' +
            '        <user-roles :role="item.level"></user-roles>' +
            '        <user-good-level :good-level="item.Usermodel[0].evaluate"></user-good-level>' +
            '        <div class="publish-number">发布数量:<span class="text-blue">{{item.fbnum}}</span>条</div>' +
            '      </div>' +
            '      <div class="remand-info">' +
            '        <div class="remand-info__title">' +
            '          他的需求：<span class="text-black">{{item.demandTitle}}</span></div>' +
            '        <div class="remand-info__price">愿付酬金：<strong class="text-warning">{{item.dmoney}}</strong>元/套/天（酬金已担保）</div>' +
            '        <div class="remand-info__persons">需求人数：<strong class="text-warning">{{item.demandNum}}</strong>人</div>' +
            '        <div class="remand-info__detail">' +
            '          需求详情：{{item.ddetails}}' +
            '        </div>' +
            '        <div class="remand-info__other">' +
            '          <div class="user-name">{{item.Usermodel[0].pnickname}}</div>' +
            '          <div class="user-location">{{item.distance | number}}km</div>' +
            '        </div>' +
            '      </div>' +
            '    </a>' +
            '  </li>',
  props: ['item'],
  data: function() {
    return {}
  },
  filters: {
    number: function(val) {
      return parseFloat(val).toFixed(2)
    }
  },
  methods: {
    viewUserHomepage: function() {
      api.openWin({
        name: 'user_homepage',
        url: 'widget://html/user_homepage.html',
        pageParam: {
          uid: this.item.Usermodel[0].lUserId
        }
      })
    },
    viewDetail: function() {
      api.openWin({
        name: 'demand_detail',
        url: 'widget://html/demand_detail.html',
        pageParam: {
          id: this.item.demandorderId
        }
      })
    }
  }
}

var SupplyItem = {
  template: '<li @click="viewSupplyDetail(item)">' +
            '	<a class="display-flex">' +
            '	  <div class="user-info">' +
            '	    <div class="user-avatar-wrap" @click.stop="viewUserHomepage(item.sUsermodel[0])">' +
            '	      <img class="user-avatar" v-bind:src="item.sUsermodel[0].pheadimgUrl" alt="">' +
            '	      <div class="p-tag">供应</div>' +
            '	    </div>' +
            '	    <user-roles :role="item.slevel"></user-roles>' +
            '	    <user-good-level :good-level="item.sUsermodel[0].evaluate"></user-good-level>' +
            '	    <div class="publish-number">发布数量:<span class="text-blue">{{item.fbnum}}</span>条</div>' +
            '	  </div>' +
            '	  <div class="remand-info">' +
            '	    <div class="remand-info__title">' +
            '	      他的供应：<span class="text-black">{{item.skillName}}</span></div>' +
            '	    <div class="remand-info__price">价格：<strong class="text-warning">{{item.smoney}}</strong>{{item.smoneytype}}</div>' +
            '	    <div class="remand-info__persons">服务时间：<strong class="text-warning">{{item.servertime | date(\'yyyy-MM-dd\')}}</strong></div>' +
            '	    <div class="remand-info__detail">' +
            '	      供应详情：{{item.skilldetails}}' +
            '	    </div>' +
            '	    <div class="remand-info__other">' +
            '	      <div class="user-name">{{item.sUsermodel[0].pnickname}}</div>' +
            '	      <div class="user-location">{{item.distance | number}}km</div>' +
            '	    </div>' +
            '	  </div>' +
            '	</a>' +
            '</li>',
  props: ['item'],
  data: function() {
    return {}
  },
  filters: {
    number: function(val) {
      return parseFloat(val).toFixed(2)
    }
  },
  methods: {
    viewUserHomepage: function() {
      api.openWin({
        name: 'user_homepage',
        url: 'widget://html/user_homepage.html',
        pageParam: {
          uid: this.item.sUsermodel[0].lUserId
        }
      })
    },
    viewSupplyDetail: function() {
      api.openWin({
        name: 'supply_detail',
        url: 'widget://html/supply_detail.html',
        pageParam: {
          id: this.item.skillID
        }
      })
    }
  }
}

function initPage() {
  var vm = new Vue({
    el: '.wrapper',
    created: function() {
      this.getDemand()
    },
    components: {
      'demand-item': DemandItem,
      'supply-item': SupplyItem
    },
    data: function() {
      return {
        currentPage: 'demand',
        demandList: [],
        supplyList: [],
        posting: false,
        category: api.pageParam.category
      }
    },
    watch: {
      currentPage: function(val, oVal) {
        if (val === 'demand') {
          this.demandList.length === 0 && this.getDemand()
        } else {
          this.supplyList.length === 0 && this.getSupply()
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
      getDemand: function() {
        var self = this
        this.posting = true
        $.ajax({
          url: BaseService.apiUrl + 'getdemaorder',
          data: {type: this.category, userid: Helper.getUserId()},
          success: function(res) {
            self.demandList = JSON.parse(res.data)
            console.log(JSON.parse(res.data))
          },
          error: function(err) {
            // alert(JSON.stringify(err))
          }
        }).always(function() {
          self.posting = false
        })
      },
      getSupply: function() {
        var self = this
        self.posting = true
        $.ajax({
          url: BaseService.apiUrl + 'getSkill',
          data: {type: self.category, userid: Helper.getUserId()},
          success: function(res) {
            self.supplyList = JSON.parse(res.data)
            console.log(JSON.parse(res.data))
          },
          error: function(err) {
            // alert(JSON.stringify(err))
          }
        }).always(function() {
          self.posting = false
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
