$(document).ready(function () {
	var wangzhi = document.getElementById("wangzhi");
	setInterval(function () {
		if (wangzhi.value.substring(0, 4) == 'http') {
			wangzhi.className = 'form-control is-valid';
			$(function () {
				$('#tijiao').prop('disabled', false); //启用
			});
		} else {
			wangzhi.className = 'form-control is-invalid';
			$(function () {
				$('#tijiao').prop('disabled', true); //禁用 --变灰，且不能调用点击事件
			});
		}
	}, 100)
	document.getElementById("tijiao").onclick = function () {	
		defaultData()
		DanQuRePing()
	}
	function defaultData() {
		var zhengze = /id=(.*)/;
		var post1 = wangzhi.value.match(zhengze);
		if (post1 == null) {
			sweetAlert("Error", "您输入的是网易云音乐链接吗？\n链接输入错误，请检查后重试！", "warning");
		} else {
			post1 = post1[1];
			//加载层-默认风格
			layer.load();
			$.post('main.php', {
				id: post1,
			}, function (data) {
				if (data == 1) {
					swal("任务已下发", "服务器处理中\n该音乐链接不在服务器中，需重新抓取数据\n依评论数量预计需要1秒～10分钟\n(10分钟=15万条评论)", "success");
				} else if (data == 50 || data == 75 || data == 100) {
					swal({
						title: "任务处理中",
						text: '您的任务正在处理<br>预计需要10秒～10分钟<br>(10分钟=15万条评论)<br>一杯咖啡的功夫就好，请耐心等待!\
						<div class="progress">\
						<div id="jindu"class="progress-bar progress-bar-striped progress-bar-animated" role="progressbar"aria-valuemin="0" aria-valuemax="100"></div>\
						</div>',
						type: "success",
						html: true,
					});
				} else {
					ciyun(data);
				}
				layer.closeAll('loading');
			});
		}
	}
	setInterval(function () {
		if ($('#jindu').length > 0) {
			var zhengze = /id=(.*)/;
			var post1 = wangzhi.value.match(zhengze);
			if (post1 != null) {
				post1 = post1[1];
				$.post('main.php', {
					id: post1,
				}, function (data) {
					var jinduValue = document.getElementById("jindu");
					if (data == 50) {
						jinduValue.setAttribute('style', 'width: 50%');
						jinduValue.setAttribute('aria-valuenow', '50');
						jinduValue.innerHTML = '50%';
					} else if (data == 75) {
						jinduValue.setAttribute('style', 'width: 75%');
						jinduValue.setAttribute('aria-valuenow', '75');
						jinduValue.innerHTML = '75%';
					} else if (data == 100) {
						jinduValue.setAttribute('style', 'width: 100%');
						jinduValue.setAttribute('aria-valuenow', '100');
						jinduValue.innerHTML = '100%';
					}
				});
			}
		}
	}, 100)
	function ciyun(data) {
		document.getElementById('ciKaPian').style.display = '';
		document.getElementById('ciTongJiKaPian').style.display = '';
		var data = JSON.parse(data);
		var wordFreqData = new Array();
		var count999 = 0;
		for (var key in data) {
			wordFreqData[count999] = new Array();
			for (i = 0; i < 2; i++) {
				if (i == 0) {
					wordFreqData[count999][i] = key;
				} else if (i == 1) {
					wordFreqData[count999][i] = data[key];
				}
			}
			count999++;
		}
		if (wordFreqData.length < 100) {
			var weightFactorValue = Math.round(wordFreqData.length / 2.68 * 1);
		} else if (wordFreqData.length < 1000) {
			var weightFactorValue = Math.round(wordFreqData.length / 139 * 1);
		} else {
			var weightFactorValue = 1;
		}
		var canvas = document.getElementById('canvas');
		var options = eval({
			"list": wordFreqData,//或者[['各位观众',45],['词云', 21],['来啦!!!',13]],只要格式满足这样都可以
			"gridSize": 6, // 密集程度 数字越小越密集
			"weightFactor": weightFactorValue, // 字体大小=原始大小*weightFactor
			"maxFontSize": 60, //最大字号
			"minFontSize": 14, //最小字号
			"fontWeight": 'normal', //字体粗细
			"fontFamily": 'OPPO', // 字体
			"color": 'random-light', // 字体颜色 'random-dark' 或者 'random-light'
			//"backgroundColor": '#333', // 背景颜色
			"rotateRatio": 1, // 字体倾斜(旋转)概率，1代表总是倾斜(旋转)
			"shape": "cardioid",//定义形状
			"hover": function (item) {//光标移入事件
				document.getElementById("tishi").innerHTML = '评论:' + item[0] + ' ' + '出现次数:' + item[1];
			},
			"click": function (item) {//点击事件
				window.open('https://music.163.com/#/search/m/?s=' + item[0] + '&type=1');
			},
			"origin": [540, 100],
		});
		//生成
		WordCloud(canvas, options);
		document.onmousemove = function (ev) {
			var oEvent = ev || event;
			var oDiv = document.getElementById('tishi');
			var scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
			var scrollLeft = document.documentElement.scrollLeft || document.body.scrollLeft;
			oDiv.style.left = oEvent.clientX + scrollLeft + 'px';
			if (navigator.userAgent.indexOf('Chrome') > -1 == true) {
				oDiv.style.top = oEvent.clientY + scrollTop + 10 + 'px';
			} else {
				oDiv.style.top = oEvent.clientY + scrollTop + 'px';
			}

		}
		$("#canvas").mouseleave(function () {
			document.getElementById("tishi").innerHTML = '';
		});

		// 基于准备好的dom，初始化echarts实例
		var myChart = echarts.init(document.getElementById('echartsPingLun'));

		var echartsData = new Array();
		var count799 = 0;
		for (var key in data) {
			echartsData[count799] = { 'name': key, 'value': data[key] }
			count799++;
		}
		option = {
			title: {
				text: '评论统计',
				subtext: '单曲评论占比统计',
				left: 'left'
			},
			tooltip: {
				trigger: 'item',
				formatter: '{a} {b} 出现次数: {c} ({d}%)'
			},
			// legend: {
			// 	type: 'scroll',
			// 	orient: 'vertical',
			// 	right: 10,
			// 	top: 20,
			// 	bottom: 20,
			//     //data: data.legendData,

			//     //selected: data.selected
			// },
			series: [
				{
					name: '评论:',
					type: 'pie',
					radius: '55%',
					center: ['50%', '50%'],
					data: echartsData,
					// emphasis: {
					// 	itemStyle: {
					// 		shadowBlur: 10,
					// 		shadowOffsetX: 0,
					// 		shadowColor: 'rgba(0, 0, 0, 0.5)'
					// 	}
					// }
					itemStyle: {
						emphasis: {
							shadowBlur: 10,
							shadowOffsetX: 0,
							shadowColor: 'rgba(0, 0, 0, 0.5)'
						},
						normal: {
							label: {
								show: true,
								formatter: '「{b}」出现次数: {c} ({d}%)',
							},
							labelLine: { show: true }
						}
					}
				}
			],
			toolbox: {
				feature: {
					saveAsImage: {
						show: true,
						type: 'png',
						name: '单曲评论占比统计',
						title: '图片',
						pixelRatio: 2,
						excludeComponents: ['toolbox'],
						//icon: 'path://M8 4a.5.5 0 01.5.5v5.793l2.146-2.147a.5.5 0 01.708.708l-3 3a.5.5 0 01-.708 0l-3-3a.5.5 0 11.708-.708L7.5 10.293V4.5A.5.5 0 018 4z',
					},
				},
			}
		};
		// 使用刚指定的配置项和数据显示图表。
		myChart.setOption(option);
		myChart.on('click', function (params) {
			window.open('https://music.163.com/#/search/m/?s=' + encodeURIComponent(params.name));
		});
	}
	function DanQuRePing() {
		var zhengze = /id=(.*)/;
		var post1 = wangzhi.value.match(zhengze);
		if (post1 == null) {
			//sweetAlert("Error", "您输入的是网易云音乐链接吗？\n链接输入错误，请检查后重试！", "warning");
		} else {
			post1 = post1[1];
			//加载层-默认风格
			//layer.load();
			$.post('main.php', {
				id: post1,
				type: 'RePing',
			}, function (data) {
				if (data == 1) {
					// swal("任务已下发", "服务器处理中\n该音乐链接不在服务器中，需重新抓取数据\n依评论数量预计需要1秒～10分钟\n(10分钟=15万条评论)", "success");
				} else if (data == 50 || data == 75 || data == 100) {
					// swal({
					// 	title: "任务处理中",
					// 	text: '您的任务正在处理<br>预计需要10秒～10分钟<br>(10分钟=15万条评论)<br>一杯咖啡的功夫就好，请耐心等待!\
					// 	<div class="progress">\
					// 	<div id="jindu"class="progress-bar progress-bar-striped progress-bar-animated" role="progressbar"aria-valuemin="0" aria-valuemax="100"></div>\
					// 	</div>',
					// 	type: "success",
					// 	html: true,
					// });
				} else {
					//alert(data);
					// ciyun(data);
					document.getElementById('RePing').style.display = '';
					var data = JSON.parse(data);
					if (data['UserContent']['beReplied'] != null) {
						document.getElementById('RePing2').style.display = '';
						document.getElementById('RePing3').src = data['UserAvatar'];
						//data['UserContentTime'];
					}else{

					}
					console.log(data);
				}
				//layer.closeAll('loading');
			});
		}
	}
});
