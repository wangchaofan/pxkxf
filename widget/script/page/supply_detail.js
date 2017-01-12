/**
 * Created by chaofanw on 2017/1/9.
 */
function initPage() {
  var vm = new Vue({
    el: '.wrapper',
    created: function() {
    	this.getData()
    },
    data: function() {
      return {
      	supplyInfo: null
      }
    },
    computed: {
    	userModel: function() {
    		if (this.supplyInfo) {
    			var userModel = this.supplyInfo.sUsermodel[0]
    			userModel.avatarStyle = 'background-image: url('+ userModel.pheadimgUrl +')'
  				return userModel
  			}
  			return null
    	}
    },
    methods: {
    	getData: function() {
    		var self = this
    		$.ajax({
    			url: BaseService.apiUrl + 'getskillinfo',
    			data: { skillid: api.pageParam.id } // 'a17db629-52b6-4b6a-a904-e6c1721e3a03'
    		}).done(function(res) {
    			self.supplyInfo = ParseJson(res.data)[0]
    			console.log(ParseJson(res.data)[0])
    		})
    	},
    	goChat: function() {

    	},
    	goInvite: function() {

    	},
    	goInviteNoname: function() {

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