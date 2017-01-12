/**
 * Created by chaofanw on 2017/1/9.
 */
function initPage() {
  var vm = new Vue({
    el: '.wrapper',
    created: function() {
      setTimeout(function() {
        document.getElementById('searchInput').focus()
      }, 50)
    },
    data: function() {
      return {
        searchContent: '',
        searchHistory: ['号全合成机油号全合成机油', '体育运动', 'abcsdfdjfwi', '我的供应和脑袋'],
        filterSearchHistory: []
      }
    },
    watch: {
      searchContent: function(val) {
        this.filterSearchHistory = _.filter(this.searchHistory, function(v) { 
          return v.indexOf(val) > -1
        }).slice(0, 10)
        console.log(this.filterSearchHistory)
      }
    },
    methods: {
      returnBack: function() {
        api.closeWin()
      },
      clearSearchHistory: function() {
        this.searchHistory = []
        this.filterSearchHistory = []
      },
      onSearch: function(v) {
        alert(v)
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
