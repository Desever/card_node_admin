var mongodb = require('./db');
var User_card={
	/**
	 * 更新打卡表数据
	 */
	"updateIdFor":function(change_if,change_info,callback){
		mongodb.open(function (err, db) {
		    if (err) {
		      return callback(err);//错误，返回 err 信息
		    }
		    db.collection('card_user', function (err, collection) {
	      		if (err) {
	        		mongodb.close();
	        		return callback(err);//错误，返回 err 信息
	      		}
	  			collection.update(change_if,{$set:change_info},function(err, message){
		        	mongodb.close();
			        if (err) {
			          return callback(err);//错误，返回 err 信息
			        }
		        	callback(null, message);//成功！返回查询的用户信息
	      		});
		    });
	  	});
		
	},
	/**
	 * @param {Object} name
	 * @param {Object} callback
	 * 写入用户打卡记录
	 */
	"saveJoinHistory":function(info, callback){
	  	mongodb.open(function (err, db) {
		    if (err) {
		      return callback(err);//错误，返回 err 信息
		    }
		    db.collection('card_user', function (err, collection) {
	      		if (err) {
	        		mongodb.close();
	        		return callback(err);//错误，返回 err 信息
	      		}
	  			collection.insert(info,{afe: true},function(err, message){
		        	mongodb.close();
			        if (err) {
			          return callback(err);//错误，返回 err 信息
			        }
		        	callback(null, message);//成功！返回查询的用户信息
	      		});
		    });
	  	});
	},
	/**
	 * 判断用户是否打卡中
	 */
	"judgeUser_Join_card":function(cond_user, callback){
		mongodb.open(function (err, db) {
		    if (err) {
		      return callback(err);//错误，返回 err 信息
		    }
		    db.collection('card_user', function (err, collection) {
	      		if (err) {
	        		mongodb.close();
	        		return callback(err);//错误，返回 err 信息
	      		}
  				collection.find({
	  				openid:cond_user
	  			}).toArray(function (err, list) {
		        	mongodb.close();
			        if (err) {
			          return callback(err);//失败！返回 err 信息
			        }
			        callback(null, list);//成功！返回查询的用户信息
		      	});
	  			
		    });
	  	});
	},
}
//导出用户模块
module.exports = User_card;