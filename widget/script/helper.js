/**
 * Created by chaofanw on 2017/1/3.
 */

var ParseJson = JSON.parse

var BaseService = {
  apiUrl: 'http://120.26.116.143:809/WebServer/userServer.asmx/'
}

var Helper = {
  xmlToJson: XmlToJson,
  imagePreview: ImagePreview,
  uploadImg: UploadImg,
  transformImageData: TransformImageData,
  getUserId: getUserId,
  getRongcloudToken: getRongcloudToken,
  dateFormat: dateFormat
}

var MockData = {
	userid: 'A17DB629-52B6-4B6A-A904-E6C1721E3A05'
}

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

Vue.component('user-box', {
  template: '<div class="user-center-top display-flex">' +
            '  <div class="user-info">' +
            '    <div class="user-avatar" style="overflow: hidden;" @click.stop="viewUserHomepage">' +
            '      <img :src="avatar" alt="" style="width: 100%;height: 100%;">' +
            '    </div>' +
            '    <div class="user-info-tj">' +
            '      <div class="user-name">' +
            '        <span class="vam">{{user.pnickname}}</span>' +
            '        <span class="user-sex vam" :class="{woman: user.sex === \'女\'}"></span>' +
            '      </div>' +
            '      <div class="online-status" :class="{\'off-line\': user.onlineState === 2}">{{onlineText}}</div>' +
            '      <slot name="userLtBottom">' +
            '        <user-good-level :good-level="user.evaluate"></user-good-level>' +
            '      </slot>' +
            '    </div>' +
            '  </div>' +
            '  <div class="user-info-rt">' +
            '    <div><slot name="userRtTop"></slot></div>' + 
            '    <slot name="userRtBottom">' +
            '      <user-roles :role="user.level"></user-roles>' +
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
      api.openWin({
        name: 'user_homepage',
        url: 'widget://html/user_homepage.html',
        reload: true,
        pageParam: {
          uid: this.user.lUserId
        }
      })
    }
  }
})

Vue.component('professor-box', {
  template: '<div class="professor-box">' +
            '<div class="professor-avatar">' +
            '  <img :src="professor.ephtourl" alt="">' +
            '</div>' +
            '<div class="professor-info ac">' +
            '  <div class="professor-name">{{professor.eName}}</div>' +
            '  <div class="professor-title">' +
            '    <span class="text-999">专家职称：</span>' +
            '    <span>{{professor.ezyname}}</span>' +
            '  </div>' +
            '</div>' +
            '</div>',
  props: ['professor']
})

Vue.component('user-good-level', {
  template: '<div class="good-like">' +
            '  好评:' +
            ' <div class="good-like-pl">' +
            '   <span v-for="i in 3" :class="getClass(i)"></span>' +
            ' </div>' +
            '</div>',
  props: ['goodLevel'],
  data: function() {
    return {
      level: parseInt(this.goodLevel) > 3 ? 3 : parseInt(this.goodLevel)
    }
  },
  methods: {
    getClass: function(n) {
      return n <= this.level ? 'icon-good' : 'icon-notgood'
    }
  }
})

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

Vue.filter('date', function(val, fmt) {
  return dateFormat(val, fmt)
})

$.ajaxSetup({
  type: 'post',
  dataType: 'text',
  dataFilter: function(res) {
    // console.log(XmlToJson(res))
    return JSON.parse(XmlToJson(res))
  }
})

function XmlToJson(xml) {
  var r = /<string.+?>(.+)<\/string>/
  return r.exec(xml)[1]
}

// function xmlToJson(xml) {
//   // Create the return object
//   var obj = {};
//   if (xml.nodeType == 1) { // element
//     // do attributes
//     if (xml.attributes.length > 0) {
//       obj["@attributes"] = {};
//       for (var j = 0; j < xml.attributes.length; j++) {
//         var attribute = xml.attributes.item(j);
//         obj["@attributes"][attribute.nodeName] = attribute.nodeValue;
//       }
//     }
//   } else if (xml.nodeType == 3) { // text
//     obj = xml.nodeValue;
//   }
//   // do children
//   if (xml.hasChildNodes()) {
//     for (var i = 0; i < xml.childNodes.length; i++) {
//       var item = xml.childNodes.item(i);
//       var nodeName = item.nodeName;

//       if (typeof (obj[nodeName]) == "undefined") {
//         obj[nodeName] = xmlToJson(item);
//       } else {
//         if (typeof (obj[nodeName].length) == "undefined") {
//           var old = obj[nodeName];
//           obj[nodeName] = [];
//           obj[nodeName].push(old);
//         }
//         obj[nodeName].push(xmlToJson(item));
//       }
//     }
//   }
//   return obj;
// }

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

function getUserId() {
  if (window.api) {
    return api.getPrefs({key: 'userid', sync: true})
  }
  return MockData.userid
}

function dateFormat(val, fmt) {
  if (typeof val === 'string') {
    val = parseInt(val.match(/\d+/)[0])
  }
  var date = new Date(val)
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
  var canvas = document.createElement('CANVAS'),
    ctx = canvas.getContext('2d'),
    img = new Image;
    img.crossOrigin = 'Anonymous';
    img.onload = function(){
      canvas.height = img.height;
      canvas.width = img.width;
      ctx.drawImage(img,0,0);
      var dataURL = canvas.toDataURL(outputFormat || 'image/png');
      callback.call(this, dataURL);
      canvas = null; 
    };
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
