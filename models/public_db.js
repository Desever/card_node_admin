var mongodb = require('./db');
var public_db={
	/**
	 * 返回打卡活动时间
	 */
	"returnCardTime":function(callback){
		mongodb.open(function (err, db) {
		    if (err) {
		      return callback(err);//错误，返回 err 信息
		    }
		    db.collection('card_timer', function (err, collection) {
	      		if (err) {
	        		mongodb.close();
	        		return callback(err);//错误，返回 err 信息
	      		}
  				collection.find({}).toArray(function (err, list) {
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
module.exports=public_db;