/**
 * Created by chaofanw on 2017/1/9.
 */
function initPage() {
  var vm = new Vue({
    el: '.wrapper',
    created: function() {
      this.searchHistory = $api.getStorage('searchHistory') || []
      setTimeout(function() {
        document.getElementById('searchInput').focus()
      }, 50)
    },
    data: function() {
      return {
        searchContent: '',
        searchHistory: [],
        filterSearchHistory: []
      }
    },
    watch: {
      searchContent: function(val) {
        this.filterSearchHistory = _.filter(this.searchHistory, function(v) { 
          return v.indexOf(val) > -1
        }).slice(0, 10)
      }
    },
    methods: {
      returnBack: function() {
        api.closeWin()
      },
      clearSearchHistory: function() {
        this.searchHistory = []
        this.filterSearchHistory = []
        $api.rmStorage('searchHistory')
      },
      onSearch: function($event, v) {
        var content = v || this.searchContent
        if (!v && this.searchHistory.indexOf(this.searchContent) < 0) {
          this.searchHistory.push(this.searchContent)
          $api.setStorage('searchHistory', this.searchHistory)
        }
        if (!content) return
        Helper.openWin('category_list', {searchContent: content});
      }
    }
  })
}

apiready = function(){
  initPage()
}
