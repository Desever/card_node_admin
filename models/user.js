var mongodb = require('./db');
var User={
	/**
	 * @param {Object} name
	 * @param {Object} callback
	 * 管理员用户登录
	 */
	"saveUserInfo":function(info, callback){
	  	mongodb.open(function (err, db) {
		    if (err) {
		      return callback(err);//错误，返回 err 信息
		    }
		    db.collection('user', function (err, collection) {
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
	 * 判断用户是否存在
	 */
	"judgeUser":function(cond_user, callback){
		mongodb.open(function (err, db) {
		    if (err) {
		      return callback(err);//错误，返回 err 信息
		    }
		    db.collection('user', function (err, collection) {
	      		if (err) {
	        		mongodb.close();
	        		return callback(err);//错误，返回 err 信息
	      		}
  				collection.find(cond_user).toArray(function (err, list) {
		        	mongodb.close();
			        if (err) {
			          return callback(err);//失败！返回 err 信息
			        }
			        callback(null, list);//成功！返回查询的用户信息
		      	});
	  			
		    });
	  	});
	}
}
//导出用户模块
module.exports = User;