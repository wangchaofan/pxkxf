var template = '<div class="btn-get-code" :class="{disabled: sending}" @click="getMsm">{{text}}</div>'

Vue.component('get-msm-button', {
	template: template,
	props: ['phone'],
	data: function() {
		return {
			time: 60,
			sending: false,
			myText: '获取验证码'
		}
	},
	computed: {
		text: function() {
			return !this.sending ? this.myText : this.time + 's'
		}
	},
	methods: {
		getMsm: function() { 
			console.log(this.phone)
			if (!/^1\d{10}$/.test(this.phone)) {
				alert('请输入正确的手机号')
				return
			} 
			if (this.sending) return
			this.sending = true
			this.myText = '重新获取'
			this.counter()
			$.ajax({
				url: BaseService.apiUrl + 'getmesg',
				data: {
					phone: this.phone
				},
				context: this
			})
			.done(function(res) {
				res = JSON.parse(res)
				if (res.key === 'true') {
					this.$emit('send-success', res)
				} else {
					this.getMsmFail()					
				}
			})
			.fail(this.getMsmFail)
		},
		getMsmFail: function() {
			this.sending = false
			this.time = 60
			alert('获取验证码失败，请重新获取')
			this.$emit('send-error', err)
		},
		counter: function() {
			var self = this
			setTimeout(function() {
				if (self.time > 1 && self.sending) {
					self.counter()
					self.time--
				} else {
					self.sending = false
					self.time = 60
				}
			}, 1000)
		}
	}
})