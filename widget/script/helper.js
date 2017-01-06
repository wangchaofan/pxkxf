/**
 * Created by chaofanw on 2017/1/3.
 */

var BaseService = {
  apiUrl: 'http://120.26.116.143:809/WebServer/userServer.asmx/'
}

var Helper = {
  xmlToJson: xmlToJson
}

$.ajaxSetup({
  type: 'post',
  dataType: 'text',
  dataFilter: function(res) {
    return xmlToJson(res)
  }
})

function xmlToJson(xml) {
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

}