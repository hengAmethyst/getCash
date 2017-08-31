<template>
	<div class="index">
		<!--<div v-title>员工信息</div>-->
		<!--头部信息和money信息-->
		<div class="header">
			<div class="bgImg">
				<img src="../assets/员工顶部@3x.png" class="bg"/>
				<img :src="headImgUrl" class="head"/>
				<router-link to="/getCash">
					<img src="../assets/提现@3x.png" class="getCash" />
				</router-link>
			</div>
			<!--账户余额-->
			<div class="accountInfo">
				<p>
					<span>账户余额</span>
					<span>
						￥{{rewardAll.balance/100}}
					</span>
					<span>
						收到赏金后<i>12小时</i>后可提取
					</span>
				</p>
				<p>
					您总共被打赏<i>{{rewardAll.rewardCount}}</i>次，合计<b>￥{{rewardAll.totalAmount/100}}</b>
				</p>
			</div>
		</div>
		<!--导航栏-->
		<div class="nav">
			<span class="nav-active" @click="doReward()">打赏记录</span>
			<span @click="doGetCash()">提现记录</span>
		</div>
		<!--tab-->
		<div class="tab" v-show="isShowFirst">
			<ul>
				<li>操作</li>
				<li>金额</li>
				<li>时间</li>
			</ul>
		</div>
		<!--内容记录1-->
		<div class="inner" v-show="isShowFirst">
			<p v-for="(item,index) in rewardList">
				<span>{{item.waiterName}}</span>
				<span>￥{{item.amountMoney/100}}</span>
				<span>{{item.time}}</span>
			</p>
		</div>
		<div class="tab" v-show="!isShowFirst">
			<ul>
				<li>金额</li>
				<li>手续费</li>
				<li>时间</li>
			</ul>
		</div>
		<!--内容记录2-->
		<div class="inner inner2" v-show="!isShowFirst">
			<p v-for="(item,index) in getCashList">
				<span style="color:#EE5A32;font-size:0.16rem">￥{{item.amountMoney/100}}</span>
				<span style="color:#282828">￥{{item.fee/100}}</span>
				<span>{{item.time}}</span>
			</p>
		</div>
	</div>
</template>
<script>
import {splitUserInfo} from '../js/splitInfo.js'
import $ from 'n-zepto'
import cookie from '../js/cookie.js'
	export default{
		data(){
			return{
				//选择显示的栏
				 isShowFirst:true,
				 //打赏总记录
				 rewardAll:{},
				 //打赏list
				 rewardList:null,
				 //提现list
				 getCashList:null
			}
		}
		,
		methods:{
			//选择打赏记录
			doReward(){
				this.isShowFirst = true
			},
			//选择提现记录
			doGetCash(){
				this.isShowFirst = false
			},
			//刷新
			reload(){
				//获取打赏总记录
				this.$http.post(this.$store.state.rewardHttp+'/jinghan-reward/waiters/beReward/statistics',
					JSON.stringify({"offset": 0,"openId": this.openId})
					,{emulateJSON:true})
					.then(function(res){
						console.log(res)
						this.rewardAll = res.body.data
						this.$store.state.balance = res.body.data.balance
					})
				//获取打赏记录信息
				this.$http.post(this.$store.state.rewardHttp+'/jinghan-reward/waiters/rewardRecords',
					JSON.stringify({"currentPage": 0,"openId": this.openId})
					,{emulateJSON:true})
					.then(function(res){
						console.log(res)
						this.rewardList = res.body.data.data
					})
				//获取提现记录
				this.$http.post(this.$store.state.rewardHttp+'/jinghan-reward/waiters/withdrawCash/record',
					JSON.stringify({"currentPage": 0,"openId": this.openId})
					,{emulateJSON:true})
					.then(function(res){
						console.log(res)
						this.getCashList = res.body.data.data
					})
			}
		}
		,
		created(){
			document.title = '员工打赏记录'
			//取本地地址
			var localUrl = window.location.href
			//本地取openId
			var tempInfo = JSON.parse($.fn.cookie('openId'))
			//如果本地没取到数据
			if(!tempInfo){
				//第一次去取数据
				if(localUrl.indexOf("openId")<0){
					window.location.href="https://pay.jinghanit.com/jinghan-payment/api/h5/index?returnUrl=http://h5.jinghanit.com/getCash"
				}
				//从支付接口url跳转至此
				else{
					//调用splitUserInfo函数分解userInfo
					var tempUserInfo = splitUserInfo(localUrl)
					this.openId = tempUserInfo.openId
					this.headImgUrl = tempUserInfo.headImgUrl
					var userInfo = {openId:this.openId,headImgUrl:this.headImgUrl}
					userInfo = JSON.stringify(userInfo)
					//保存到本地local
					$.fn.cookie('openId', userInfo , { expires: 1 })
				}
			}
			//如果本地取到了数据
			else{
				//解析数据
				this.openId = tempInfo.openId
				this.$store.state.openId = tempInfo.openId
				this.headImgUrl = tempInfo.headImgUrl
			}
		}
		,
		mounted(){
			//inner的背景单双
			let obj = document.getElementsByClassName('inner')[0]
			let oP = obj.getElementsByTagName('p')
			for(let i=0;i<oP.length;i++){
				if((i+1)%2==0){
					oP[i].className = 'otherBg'
				}
			}
			//inner的背景单双
			let obj0 = document.getElementsByClassName('inner2')[0]
			let oP0 = obj0.getElementsByTagName('p')
			for(let i=0;i<oP0.length;i++){
				if((i+1)%2==0){
					oP0[i].className = 'otherBg'
				}
			}
			//nav点击选中
			let obj1 = document.getElementsByClassName('nav')[0]
			let oSpan = obj1.getElementsByTagName('span')
			for(let i=0;i<oSpan.length;i++){
				oSpan[i].onclick = function(){
					for(let j=0;j<oSpan.length;j++){
						oSpan[j].className = ''
					}
					this.className = 'nav-active'
				}
			}
		}
		,
		watch:{
			"$route": function(){
				let localUrl = window.location.href
				//刷新页面数据
				this.reload()
				if(localUrl.indexOf('getCash')<0&localUrl.indexOf('getCashSucceed')<0){
					document.title = '员工打赏记录'
				}
			},
		}
	}
</script>
<style lang="scss">
	.index{
		display: flex;
		flex-direction: column;
		width:100%;
		height:100%;
		/*头部信息*/
		.header{
			width:100%;
			/*头像和背景图*/
			.bgImg{
				position:relative;
				.bg{
					width:100%;
					height:0.85rem;
				}
				.head{
					position:absolute;
					top:20%;
					left:50%;
					transform: translateX(-0.41rem);
					width:0.82rem;
					height:0.82rem;
					border-radius: 100%;
				}
				/*提现图*/
				.getCash{
					position:absolute;
					bottom:-52%;
					right:0%;
					width:0.72rem;
					height:0.35rem;
				}
			}
			/*账户信息*/
			.accountInfo{
				display: flex;
				flex-direction: column;
				justify-content: center;
				align-items: center;
				margin-top:0.2rem;
				p:nth-child(1){
					display: flex;
					flex-direction: column;
					align-items: center;
					span:nth-child(1){
						font-size:0.15rem;
						color:#282828;
					}
					span:nth-child(2){
						display: inline-block;
						margin-top:0.05rem;
						font-size:0.24rem;
						color:#FF2C2C;
					}
					span:nth-child(3){
						display: inline-block;
						margin-top:0.05rem;
						font-size:0.12rem;
						color:#282828;
						i{
							font-style:normal;
							color: orange;
						}
					}
				}
				p:nth-child(2){
					margin-top:0.2rem;
					font-size:0.15rem;
					color:#282828;
					i{
						font-style:normal;
						color:#FF2C2C;
					}
					b{
						font-weight: normal;
						color:#FF2C2C;
					}
				}
			}
		}
		/*导航*/
		.tab{
			width:100%;
			height:0.35rem;
			background: #F9F9F9;
			ul{
				display: flex;
				justify-content: space-around;
				li{
					line-height: 0.35rem;
					font-size:0.14rem;
					color: #6A6A6A;
				}
			}
		}
		/*导航栏*/
		.nav{
			display: flex;
			justify-content: space-around;
			align-items: center;
			width:100%;
			height:0.5rem;
			margin-top:0.2rem;
			span{
				display: inline-block;
				height:0.5rem;
				line-height: 0.5rem;
				font-size:0.16rem;
				color:#282828;
				border-bottom: 2px solid #fff;
			}
			.nav-active{
				border-bottom: 2px solid #282828;
			}
		}
		/*inner*/
		.inner{
			width:100%;
			flex:1;
			overflow: scroll;
			p{
				display: flex;
				align-items: center;
				width:100%;
				height:0.5rem;
				span:nth-child(1){
					display:inline-block;
					width:0.84rem;
					height:100%;
					margin-left:0.25rem;
					text-align: center;
					line-height:0.5rem;
					font-size:0.14rem;
					color: #282828;
				}
				span:nth-child(2){
					display:inline-block;
					width:0.84rem;
					height:100%;
					margin-left:0.4rem;
					text-align: center;
					line-height:0.5rem;
					font-size:0.16rem;
					color:#EE5A32;
				}
				span:nth-child(3){
					display:inline-block;
					width:1.2rem;
					height:100%;
					margin-left:0.2rem;
					text-align: center;
					line-height:0.5rem;
					font-size:0.13rem;
					color: #A0A0A0;
				}
			}
			.otherBg{
				background:#FCFCFC !important;
			}
		}
	}
</style>