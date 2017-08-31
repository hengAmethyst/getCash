<template>
	<div class="getCash">
	<!--显示头部-->
	<!--<div v-title>员工提现</div>-->
	<!--蒙版-->
	<div class="shadow" v-if="showShadow">
		<img class="rotation" src="../../static/imgs/1.png" width="50px" height="50px"/>
	</div>
	<!--顶部空白-->
		<div class="space"></div>
	<!--input需要提取的金额-->
		<div class="input">
			<input type="text" placeholder="请输入你需要提取的金额" v-model="cashNum" @blur="submit"/>
		</div>
	<!--余额显示和规则-->
		<div class="rule">
			<p>账户余额：<i>￥{{this.$store.state.balance/100}}</i></p>
			<ul>
				<li>提现规则</li>
				<li>1、单次最低提现金额10元,每日提现总额5000元</li>
				<li>2、提现服务费为提现总额的2%,四舍五入保留到分</li>
				<li>3、提现前请先微信实名验证</li>
				<li>4、提现金额24小时内到帐微信零钱</li>
			</ul>
		</div>
	<!--提现按钮-->
		<div class="submit">
			<p ref="submit" @click="allowEnter">提 现</p>
		</div>
		<alert :showMsg="showMsg" v-if='showAlert'></alert>
	</div>
</template>
<script>
	export default{
		data(){
			return{
				cashNum:null,
				showShadow:false,
				showAlert:false,
				showMsg:'提现失败'
			}
		}
		,
		methods:{
			submit(){
				if(this.cashNum>0&this.cashNum<this.$store.state.balance){
					this.$refs.submit.className = 'submitActive'
				}
				else{
					this.$refs.submit.className = ''
				}
			},
			allowEnter(){
				this.showShadow = true
				//提现接口
				this.$http.post(this.$store.state.rewardHttp+'/jinghan-reward/withdrawals',
				JSON.stringify({"withdrawMoney": this.cashNum,"openId":this.$store.state.openId})
				,{emulateJSON:true})
				.then(function(res){
					console.log(res)
					if(res.body.code == 0){
						this.showShdow = false
						this.$store.state.balance = this.$store.state.balance - this.cashNum*100
						this.$router.push({path:'/getCashSucceed'})
					}
					else{
						var that = this
						var timer1 = setTimeout(function(){
							that.showShadow = false
							that.showAlert = true
							var thus = that
							var timer2 = setTimeout(function(){
								thus.showAlert = false
								clearTimeout(timer1)
								clearTimeout(timer2)
							},2000)
						},4000)
					}
				})
			}
		}
		,
		created(){
			document.title = '员工提现'
		}
		,
		watch:{
			"$route": function(){
				let localUrl = window.location.href
				if(localUrl.indexOf('getCash')>0){
					document.title = '员工提现'
				}
			},
			cashNum(){
				if(this.cashNum>this.$store.state.balance){
					alert('提现金额不能大于余额')
				}
			}
		}
	}
</script>
<style lang="scss">
	.getCash{
		width:100%;
		height:100%;
		background:#F9F9F9;
		/*空白区域*/
		.space{
			width:100%;
			height:0.2rem;
			background:#F9F9F9;
		}
		.shadow{
			position: fixed;
			left:0;
			top:0;
			width:100%;
			height:10rem;
			background:#000;
			opacity: 0.5;
			z-index:3000;
			@-webkit-keyframes rotation{
				from {-webkit-transform: rotate(0deg);}
				to {-webkit-transform: rotate(360deg);}
			}
			.rotation{
				position:absolute;
				left:50%;
				top:2rem;
				-webkit-transform: rotate(360deg);
				animation: rotation 1.5s linear infinite;
				border-radius: 100%;
				transform: translate(-50% -50%);
			}
		}
		/*输入提取金额*/
		.input{
			width:100%;
			height:0.5rem;
			input{
				width:100%;
				height:0.5rem;
				border:none;
				padding-left: 0.15rem;
				font-size:0.15rem;
			}
		}
		/*余额显示和规则*/
		.rule{
			width:100%;
			p{
				width:80%;
				height:0.6rem;
				line-height:0.6rem;
				margin-left:0.15rem;
				font-size:0.18rem;
				color:#282828;
				i{
					font-style:normal;
					color:#FF2C2C;
				}
			}
			ul{
				width:100%;
				margin-top:0.2rem;
				margin-left:0.15rem;
				li{
					font-size:0.14rem;
					color:#6A6A6A;
				}
			}
		}
		/*提现按钮*/
		.submit{
			display: flex;
			justify-content: center;
			width:100%;
			height:0.41rem;
			margin-top:0.3rem;
			p{
				width:3.4rem;
				height:100%;
				text-align: center;
				line-height:0.41rem;
				font-size:0.18rem;
				color:#fff;
				background:#B4B4B4;
				border-radius: 6px;
			}
			.submitActive{
				background:#EE5A32;
			}
		}
	}
</style>