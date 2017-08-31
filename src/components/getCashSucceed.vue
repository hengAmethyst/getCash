<template>
	<div class="getCashSucceed">
		<div class="header">
			<img src="../assets/注册顶部@3x.png" class="img1"/>
			<img src="../assets/成功@3x.png" class="img2"/>
			<span>提现成功</span>
		</div>
		<!--返回按钮-->
		<div class="back">
			<router-link to="/">
				<p>
					返回员工首页
				</p>
			</router-link>
		</div>
	</div>
</template>
<script></script>
<style lang="scss">
	.getCashSucceed{
		width:100%;
		height:100%;
		.header{
			position:relative;
			width:100%;
			height:1.3rem;
			.img1{
				width:100%;
				height:100%;
			}
			.img2{
				position:absolute;
				bottom:0%;
				left:50%;
				transform:translateX(-0.375rem);
				width:0.75rem;
				height:0.75rem;
			}
			span{
				position:absolute;
				bottom:-0.62rem;
				left:50%;
				transform:translateX(-0.5rem);
				font-size: 0.25rem;
				color: #00B787;
			}
		}
		.back{
			display: flex;
			justify-content: center;
			width:100%;
			height:0.41rem;
			margin-top:1.5rem;
			p{
				width:3.4rem;
				height:100%;
				text-align: center;
				line-height:0.41rem;
				font-size:0.18rem;
				color:#fff;
				background:#EE5A32;
				border-radius: 6px;
			}
		}
	}
</style>