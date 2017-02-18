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
            '	      <div class="p-tag supply">供应</div>' +
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
      Helper.openWin('user_homepage', {uid: this.item.sUsermodel[0].lUserId});
    },
    viewSupplyDetail: function() {
      Helper.openWin('supply_detail', {id: this.item.skillID});
    }
  }
}

function initPage() {
  var vm = new Vue({
    el: '.wrapper',
    created: function() {
      if (api.pageParam.searchContent) {
        this.title = '搜索结果';
        this.getSearchResult(api.pageParam.searchContent);
      } else {
        this.getDemand();
        this.getSupply();
        this.pageNum += 1;
      }
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
        hasMoreDemand: true,
        hasMoreSupply: true,
        posting: false,
        pageNum: 1,
        category: api.pageParam.category,
        title: api.pageParam.category
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
      /**
       * 获取搜索的供应和请求
       * @param content 搜索条件
       */
      getSearchResult: function(content) {
        var self = this;
        alert(content)
        var getDemand = $.ajax({
          url: BaseService.apiUrl + 'getscxq',
          data: {
            content: content
          }
        }).then(function(res) {
          alert(res)
        });
        var getSupply = $.ajax({
          url: BaseService.apiUrl + 'getsc',
          data: {
            content: content
          }
        });
        //$.when(getDemand, getSupply)
        //  .then(function(res1, res2) {
        //    alert(res1)
        //    alert(res2)
        //    self.demandList = ParseJson(res1[0].data);
        //    self.supplyList = ParseJson(res2[0].data);
        //  });
      },
      getDemand: function() {
        var self = this
        if (!this.hasMoreDemand) return;
        $.ajax({
          url: BaseService.apiUrl + 'getdemaorder',
          data: {type: this.category, userid: Helper.getUserId(), num: this.pageNum},
          success: function(res) {
            var data = JSON.parse(res.data);
            if (!data || data.length === 0) {
              self.hasMoreDemand = false;
              return;
            }
            self.demandList = self.demandList.concat(data)
            console.log(JSON.parse(res.data))
          }
        }).always(function() {
          self.posting = false
        })
      },
      getSupply: function() {
        var self = this
        if (!this.hasMoreSupply) return;
        $.ajax({
          url: BaseService.apiUrl + 'getSkill',
          data: {type: self.category, userid: Helper.getUserId(), num: this.pageNum},
          success: function(res) {
            var data = JSON.parse(res.data);
            if (!data || data.length === 0) {
              self.hasMoreSupply = false;
              return;
            }
            self.supplyList = self.supplyList.concat(data)
            console.log(JSON.parse(res.data))
          }
        }).always(function() {
          self.posting = false
        })
      }
    }
  });

  api.addEventListener({
    name: 'scrolltobottom',
    extra:{
      threshold: 50     //设置距离底部多少距离时触发，默认值为0，数字类型
    }
  }, function (ret, err) {
    vm.getDemand();
    vm.getSupply();
    vm.pageNum += 1;
  });
}

apiready = function(){
  initPage()
}
