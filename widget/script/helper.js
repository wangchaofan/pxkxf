/**
 * Created by chaofanw on 2017/1/3.
 */

/* === 全局变量 === */
var ParseJson = JSON.parse
var MockData = {
  userid: 'a17db629-52b6-4b6a-a904-e6c1721e3a05'
}

/* === api 基础服务 === */
var BaseService = {
  apiUrl: 'http://112.74.181.171:801/WebServer/userServer.asmx/'
}

/* === 辅助方法 === */
var Helper = {
  xmlToJson: XmlToJson,
  imagePreview: ImagePreview,
  uploadImg: UploadImg,
  transformImageData: TransformImageData,
  getUserId: getUserId,
  getRongcloudToken: getRongcloudToken,
  dateFormat: dateFormat,
  getUserInfo: getUserInfo,
  setUserInfo: setUserInfo,
  alert: function(msg) {
    api.alert({
      title: '提示',
      msg: msg,
      buttons: ['确定']
    }, function() {

    })
  },
  openWin: function(winName, pageParam, option) {
    var defaultOption = {
      name: winName,
      url: 'widget://html/' + winName + '.html',
      reload: true,
      useWKWebView: true,
      scrollToTop: true,
      slidBackType: 'edge',
      progress: {
        type: 'page'
      },
      reload: true,
      pageParam: pageParam || {}
    }
    api.openWin(_.assign(defaultOption, option))
  },
  openFrame: function(frameName, pageParam, option) {
    var defaultOption = {
      name: 'frameName',
      url: 'widget://html/' + winName + '.html',
      rect: {
          x: 0,
          y: 48,
          w: 'auto',
          h: 'auto'
      },
      useWKWebView: true,
      pageParam: pageParam || {},
      scrollToTop: true,
      bounces: true,
      bgColor: '#fff',
      vScrollBarEnabled: true,
      hScrollBarEnabled: false,
      progress: {
        type: 'page'
      },
      reload: true
    }
    api.openFrame(_.assign(defaultOption, option));
  }
}

/* === Vue 全局components === */

/* === 页面头部 === */
Vue.component('my-header', {
  template: '<header class="header">' +
            ' <div class="header-left">' +
            '   <slot name="headerLeft">' +
            '     <span class="return-back" @click="returnBack"></span>' +
            '   </slot>' +
            ' </div>' +
            ' <div class="header-center">' +
            '   <span class="header-center-text">{{title}}</span>' +
            ' </div>' +
            ' <div class="header-right">' +
            '   <slot name="headerRight"></slot>' +
            ' </div>' +
            '</header>',
  props: ['title'],
  data: function() {
    return {}
  },
  methods: {
    returnBack: function() {
      api.closeWin()
    }
  }
})

/* === 用户box === */
Vue.component('user-box', {
  template: '<div class="user-center-top display-flex">' +
            '  <div class="user-info">' +
            '    <div class="user-avatar" style="overflow: hidden;" @click.stop="viewUserHomepage">' +
            '      <img :src="avatar" alt="" style="width: 100%;height: 100%;">' +
            '    </div>' +
            '    <div class="user-info-tj">' +
            '      <div class="user-name">' +
            '        <span class="vam">{{user.pnickname}}</span>' +
            '        <span class="user-sex vam" :class="{woman: user.sex == \'女\'}"></span>' +
            '      </div>' +
            '      <div class="online-status" :class="{\'off-line\': user.onlineState === 2}">{{onlineText}}</div>' +
            '      <slot name="userLtBottom">' +
            // '        <user-good-level :good-level="user.evaluate"></user-good-level>' +
            '      </slot>' +
            '    </div>' +
            '  </div>' +
            '  <div class="user-info-rt">' +
            '    <div class="ar"><slot name="userRtTop"></slot></div>' +
            '    <slot name="userRtBottom">' +
            '      <user-roles :role="user.levle"></user-roles>' +
            '    </slot>' +
            '  </div>' +
            '</div>',
  props: ['user', 'preventHome'],
  data: function() {
    return {}
  },
  computed: {
    avatar: function() {
      return this.user.pheadimgUrl
    },
    onlineText: function() {
      return this.user.onlineState == 2 ? '离线' : '在线'
    }
  },
  methods: {
    viewUserHomepage: function() {
      if (this.user.lUserId !== Helper.getUserId()) {
        Helper.openWin('user_homepage', {uid: this.user.lUserId});
      }
    }
  }
})

/* === 专家box === */
Vue.component('professor-box', {
  template: '<div class="professor-box" @click="handleClick">' +
              '<div class="professor-avatar">' +
              '  <img :src="professor.ephtourl" alt="">' +
              '</div>' +
              '<div class="professor-info ac">' +
              '  <div class="professor-name">{{professor.eName}}</div>' +
              '  <div class="professor-title">' +
              '    <span class="text-999">专家职称：</span>' +
              '    <span>{{professor.ezyname}}</span>' +
              '  </div>' +
              '  <div class="professor-title" style="margin-top: 0.1rem;" v-if="showTheme">' +
              '    <span class="text-999">咨询主题：</span>' +
              '    <span>{{professor.ConsultingTheme}}</span>' +
              '  </div>' +
              '  <div class="professor-title" style="margin-top: 0.1rem;">' +
              '    <span class="text-999">排期时间：</span>' +
              '    <span>{{professor.pqtime | date("yyyy-MM-dd")}}</span>' +
              '  </div>' +
              '</div>' +
            '</div>',
  props: ['professor', 'showTheme'],
  methods: {
    handleClick: function() {
      this.$emit('click')
    }
  }
})

/* === 用户好评 === */
Vue.component('user-good-level', {
  template: '<div class="good-like">' +
            ' <div class="good-like__text">好评:</div>' +
            ' <div class="good-like-pl">' +
            '   <span v-for="i in level" class="icon-good"></span>' +
            ' </div>' +
            '</div>',
  props: ['goodLevel'],
  computed: {
    level: function() {
      var level = parseInt(this.goodLevel);
      if (!isNaN(level)) {
        return level > 3 ? 3 : level
      }
      return 0;
    }
  }
})

/* === 用户等级 === */
Vue.component('user-roles', {
  template: '<div class="user-roles display-flex">' +
            '  <div class="user-roles-title text-999">用户等级：</div>' +
            '  <span class="user-roles__type1" :class="{done: roleIndex >= 1}"></span>' +
            '  <span class="user-roles__type2" :class="{done: roleIndex >= 2}"></span>' +
            '  <span class="user-roles__type3" :class="{done: roleIndex >= 3}"></span>' +
            '  <span class="user-roles__type4" :class="{done: roleIndex >= 4}"></span>' +
            '</div>',
  props: ['role'],
  computed: {
    roleIndex: function() {
      if (this.role === '实名用户') {
        return 2
      } else if (this.role === '普通用户') {
        return 1
      } else if (this.role === '专业用户') {
        return 3
      } else if (this.role === '专家用户') {
        return 4
      }
      return 0
    }
  }
})

/* === Vue 全局filter */
Vue.filter('date', function(val, fmt) {
  return dateFormat(val, fmt)
})

/* === ajax 全局设置 ===*/
$.ajaxSetup({
  type: 'post',
  dataType: 'text',
  beforeSend: function() {
    if (window.api) {
      api.showProgress({
        style: 'default',
        animationType: 'fade',
        title: '',
        text: '请稍候...',
        modal: true
      });
    }
  },
  dataFilter: function(res) {
    // console.log(XmlToJson(res))
    return JSON.parse(XmlToJson(res))
  },
  complete: function() {
    window.api && api.hideProgress();
  }
})

/* === 全局方法 === */
function XmlToJson(xml) {
  var r = /<string.+?>(.+)<\/string>/
  return r.exec(xml)[1]
}

function ImagePreview(file) {
  var dtd = $.Deferred()
  var reader = new FileReader()
  reader.onload = function() {
    var url = reader.result
    dtd.resolve(url)
  }
  reader.readAsDataURL(file)
  return dtd
}

function TransformImageData(imgData) {
  return imgData.replace(/^.+\,/, '')
}

function UploadImg(userid, imgData) {
  imgData = imgData.replace(/^.+\,/, '')
  return $.ajax({
    url: BaseService.apiUrl + 'saveimg',
    data: {
      userid: userid,
      fileNameurl: imgData
    }
  })
}

function setUserInfo() {
  $.ajax({
    url: BaseService.apiUrl + 'getuserinfo',
    data: { uid: getUserId() }
  }).then(function(res) {
    window.localStorage.setItem('userInfo', ParseJson(res.data)[0]);
  }, function(err) {
    console.log(err)
  })
}

function getUserInfo() {
  return JSON.parse(window.localStorage.getItem('userInfo'));
}

function getUserId() {
  return window.localStorage.getItem('userid');
}

function dateFormat(val, fmt) {
  if (!val || val === '长期') {
    return '长期';
  }

  if (typeof val === 'string' && val.indexOf('Date') >= 0) {
    val = parseInt(val.match(/\d+/)[0])
  }

  if ((val + '').indexOf('-') >= 0) {
    val = val.replace(/-/g, '/');
  }

  if (val === 0) return '长期';  
  var date = new Date(val);

  var o = {
    "M+": date.getMonth() + 1, //月份
    "d+": date.getDate(), //日
    "h+": date.getHours(), //小时
    "m+": date.getMinutes(), //分
    "s+": date.getSeconds(), //秒
    "q+": Math.floor((date.getMonth() + 3) / 3), //季度
    "S": date.getMilliseconds() //毫秒
  };
  if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
  for (var k in o)
  if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
  return fmt
}

function convertImgToBase64(url, callback, outputFormat){
  var canvas = document.createElement('canvas'),
      ctx = canvas.getContext('2d'),
      img = new Image();
  img.setAttribute('crossOrigin', 'anonymous');
  img.addEventListener('load', function() {
    canvas.height = img.height;
    canvas.width = img.width;
    ctx.drawImage(img, 0, 0);
    var dataURL = canvas.toDataURL('image/png');
    callback.call(this, dataURL);
    canvas = null;
  }, false);
  img.src = url;
}

function getRongcloudToken() {
  return $.ajax({
    url: BaseService.apiUrl + 'gettoken',
    data: {
      userid: getUserId()
    }
  })
}
