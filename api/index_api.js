//公共查询模块
var public_db=require('../models/public_db.js');
//用户数据库模块
var addUser=require('../models/user.js');
//用户打卡数据库模块
var addUser_card=require('../models/user_card.js');
//引入公共类库
var publicFunc=require('../public/javascripts/public_func.js');
//引入当前类库
var index_modal=require('../api_modal_func/index_api_modal.js');
//时间处理函数
var moment=require('moment');
//微信支付函数
var wx_pay=require('../api_modal_func/wx_pay.js');

//请求模块
var get_url_request = require('request');
var qs = require('querystring');
//加密模块
var get_crypto = require('crypto');

//导出模块
module.exports = function(app) {
	/**
	 * 微信授权
	 */
	app.post('/authorize', function(app_req, app_res) {
		index_modal.getAuthorize(app_req,app_res,get_url_request,qs);
	});
	
	app.get('/paytest', function(req, res) {
		console.log(req.body);
	});
	
	/**
	 * 保存用户信息
	 */
	app.post('/recordUser', function(req, res) {
		var cont_if={
			"openid":req.body.openid
		}
		addUser.judgeUser(cont_if,function(err, result){
			/**
			 * 用户是不是第一次进入
			 * 是否可以进行打卡
			 * 判断是否参与打卡
			 */
			if(result){
				
				if(result.length>0){
					//更新用户最近登录时间
					var changeData={
						"login_timer":moment().format("YYYY-MM-DD HH:mm:ss")
					}
					//当前参与活动的用户
					var changeIf={
						"openid":req.body.openid,
						"activeType":1
					}
					addUser_card.updateIdFor(changeIf,changeData,function(err, update_result){
						
						//oppenid查询activeType，判断用户参与活动状态
						addUser_card.judgeUser_Join_card(req.body.openid,function(err, j_c_result){
							
							//计算时间差
							var start_ac_timer=moment().format("YYYY-MM-DD HH:mm:ss");
							var end_ac_timer=index_modal.joinReturnTimer(j_c_result).activTimer_start;
							//此用户是否正在参与活动
							if(end_ac_timer){
								var countTimer=publicFunc.diffTime(start_ac_timer,end_ac_timer);
								res.send({
									"code":1,
									"message":"活动进行中",
									"backinfo":{
										"countDown":countTimer
									}
								});
							}else{
								res.send({
									"code":1,
									"message":"可以参与活动",
									"backinfo":{
										"countDown":null
									}
								});
							}
						});
					})
				}else{
					//用户注册时间
					req.body.register_timer=moment().format("YYYY-MM-DD HH:mm:ss");
					/**
					 * 存储用户信息
					 */
					addUser.saveUserInfo(req.body,function(err, save_result){
						if(save_result){
							res.send({
								"code":1,
								"message":"用户信息保存成功",
								"backinfo":{
									"countDown":null
								}
							});
						}else{
							res.send({
								"code":0,
								"message":"网络错误",
							});
						}
					});
				}
			}else{
				res.send({
					"code":0,
					"message":"网络错误，请重试",
				});
			}
		});
	});
	/**
	 * 参与打卡
	 */
	app.post('/wxPay', function(app_req, app_res) {
		
		//统一下单接口
		wx_pay.unifiedorder(app_req.body,get_url_request,get_crypto);
		
		return false;
		//存储用户打卡信息
		var joinActive={
			"openid":app_req.body.openid,
			"joinTimer":moment().format("YYYY-MM-DD HH:mm:ss"),
			"activTimer_start":"",
			"activTimer_end":"",
			"money":app_req.body.paymoney,
			"activeType":1//1为进行中，2成功参与打卡，3为没有成功打卡
		}
		//在这里计算好打卡时间
		//是否超过本次活动时间
		public_db.returnCardTime(function(err, save_result){
			
			//打卡区间
			var cart_timer_start=moment().format  ("YYYY-MM-DD")+" "+save_result[0].start_card.split("-")[0];
			var cart_timer_end=moment().format("YYYY-MM-DD")+" "+save_result[0].start_card.split("-")[1];
			
			//用户进入时间
			var start_card_user=moment().format("YYYY-MM-DD HH:mm:ss");
			//还可以参加当天活动
			if(moment(start_card_user).isBefore(cart_timer_start)){
				//打卡区间
				joinActive.activTimer_start=cart_timer_start;
				joinActive.activTimer_end=cart_timer_end;
			}
			//只能参加下一次活动
			else{
				//打卡区间
				joinActive.activTimer_start=moment(cart_timer_start).add(1, 'days').format("YYYY-MM-DD HH:mm:ss")
				joinActive.activTimer_end=moment(cart_timer_end).add(1, 'days').format("YYYY-MM-DD HH:mm:ss")
			}
			//得到下一次打卡时间
			//计算出打卡倒计时
			var countTimer=publicFunc.diffTime(start_card_user,joinActive.activTimer_start);
			/**
			 * 保存用户打卡信息
			 * 并且返回倒计时
			 */
			addUser_card.saveJoinHistory(joinActive,function(err, save_result){
				if(save_result){
					app_res.send({
						"code":1,
						"message":"参与成功",
						"backinfo":{
							"countDown":countTimer
						}
					});
					
				}else{
					app_res.send({
						"code":0,
						"message":"网络错误",
					});
				}
			});
			
		});
	});
	/**
	 * 用户手动打卡
	 * 判断是否处于打卡区间
	 */
	app.post("/addPunch",function(app_req, app_res){
		//判断是否为时间
		var user_punchTimer=moment().format("YYYY-MM-DD HH:mm:ss");
		//数据库获取用户打卡时间
		addUser_card.judgeUser_Join_card(app_req.body.openid,function(err, j_c_result){
			//得到打卡区间
			//判断用户打卡是否再此区间
			var activTimer_start=index_modal.joinReturnTimer(j_c_result).activTimer_start;
			var activTimer_end=index_modal.joinReturnTimer(j_c_result).activTimer_end;
			//区间moment
			var ifOne=moment(user_punchTimer).isAfter(activTimer_start);//在打卡区间开始之后
			var ifTow=moment(user_punchTimer).isBefore(activTimer_end);//在打卡区间结束之前
			//当前参与活动的用户
			var changeIf={
				"openid":app_req.body.openid,
				"activeType":1,
			}
			//可以成功打卡
			if(ifOne&&ifTow){
				//修改打卡状态
				var changeData={
					"activeType":2,
					"userCard_timer":moment().format("YYYY-MM-DD HH:mm:ss")
				}
				//修改数据库字段
				addUser_card.updateIdFor(changeIf,changeData,function(err, update_result_child){
					if(err){
						app_res.send({
							"code":0,
							"message":"网络错误"
						});
					}else{
						//打卡成功
						app_res.send({
							"code":1,
							"message":"打卡成功",
							"backinfo":{
								"countDown":null
							}
						});
					}
				})
			}
			//打卡超时
			else{
				//修改打卡状态
				var changeData={
					"activeType":3,
					"userCard_timer":moment().format("YYYY-MM-DD HH:mm:ss")
				}
				//修改数据库字段
				addUser_card.updateIdFor(changeIf,changeData,function(err, update_result_child){
					if(err){
						app_res.send({
							"code":0,
							"message":"网络错误"
						});
					}else{
						app_res.send({
							"code":1,
							"message":"打卡超时",
							"backinfo":{
								"countDown":null
							}
						});
					}
					
				})
			}
			
		})
	})
	
};
