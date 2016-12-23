$(function() {
	var mySwiper = new Swiper('.swiper-container', {
		loop: true,
		autoplay: 3000,

		// 如果需要分页器
		pagination: '.swiper-pagination'
	})
})

apiready = function() {
	// api.openFrameGroup({
	// 	name: 'group1',
	// 	background: '#fff',
	// 	scrollEnabled: false,
	// 	rect: {
	// 		x: 0,
	// 		y: 0,
	// 		w: 'auto',
	// 		h: 'auto'
	// 	},
	// 	index: 0,
	// 	frames: [{
	// 		name: 'consult',
	// 		url: 'html/consult.html',
	// 		bgColor: '#fff'
	// 	}, {
	// 		name: 'order',
	// 		url: 'html/order.html',
	// 		bgColor: '#fff'
	// 	}, {
	// 		name: 'usercenter',
	// 		url: 'html/usercenter.html',
	// 		bgColor: '#fff'
	// 	}]
	// }, function(ret, err) {
	// 	var index = ret.index;
	// })

	var vm = new Vue({
		el: 'body',
		data: {

		},
		methods: {

		}
	})
}