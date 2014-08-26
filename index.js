var curl = require("curl-linux");
var Paypal = function(returnurl,cancelurl){
	this.cancelUrl = cancelurl||"http://www.cavacn.com/paypal?cancel=true";
	this.returnUrl = returnurl||"http://www.cavacn.com/paypal?return=true";
}

Paypal.prototype.init = function(client_id,secret,isdebug){
	this.client_id = client_id;
	this.secret = secret;
	this.access = null;
	this.lastTime = new Date();
	
	this.paypalDomain = !isdebug?"https://api.sandbox.paypal.com/":"https://api.paypal.com/";
	console.log(this);
}

Paypal.prototype.getAccessToken = function(cb){
	
	//当前授权信息已经存在
	if(!!this.access){
		//当前授权信息没有超时
		if(((new Date()-this.lastTime)/1000)<this.access.expires_in){
			cb(null,this.access);
			return;
		}
	}
	//调用curl
	curl(	["-u",
				this.client_id+":"+this.secret,
			"-v",
				this.paypalDomain+"v1/oauth2/token",
			"-d",
				"grant_type=client_credentials",
			"-H",
				"Accept: application/json",
			"-H",
				"Accept-Language: en_US"],function(err,data){
					try{
						cb(err,JSON.parse(data));
					}catch(e){
						cb(e);
					}
				});
}

Paypal.prototype.createPayment = function(data,cb){
	
	var _this = this;
	var order = {"intent":"sale","redirect_urls":{"return_url":this.returnUrl,"cancel_url":this.cancelUrl},"payer":{"payment_method":"paypal"},"transactions":[{"amount":{"total":data.total,"currency":data.currency},"description":data.detail}]};

	this.getAccessToken(function(err,access){
	
		console.log(err,access);
	
		if(!!err){
			cb(err);
		}else{
			if(!!access){
				//access_token
				
				curl(	[
							"-v",
								_this.paypalDomain+"v1/payments/payment",
							"-H",
								"Content-Type: application/json",
							"-H",
								"Authorization: Bearer "+access.access_token,
							"-d",JSON.stringify(order)
								
						],function(err,payment){
							cb(err,payment);
				});
				
			}else{
				cb("access is null");
			}
		}
	});
}

Paypal.prototype.checkPayment = function(data,cb){
	/*{"return":"true","token":"EC-6U355871J46019300","PayerID":"WTYASBU2LERTG"}*/
	var _this = this;
	this.getAccessToken(function(err,access){
		if(!!err){
			cb(err);
		}else{
			if(!!access){
				
				
				var array = [
					"-v",
						_this.paypalDomain+"v1/payments/payment/"+data.paymentid+(!!data.PayerID?"/execute":""),
					"-H",
						"Content-Type:application/json",
					"-H",
						"Authorization:Bearer "+access.access_token
				];
				
				if(data.PayerID){
					var _d = {"payer_id":data.PayerID};
					array.push("-d");
					array.push(JSON.stringify(_d));
				}
				
				curl(array ,function(err,msg){
					cb(err,msg);
				})
			}else{
				cb("access is null");
			}
		}
	});
	
	
}

module.exports = exports = Paypal;

// var p = new Paypal();
// p.init("AZp54BDoSGc5eQaiv-B4TGkjJ5gK99dxLgObCf7WnETT6EDmasSsn4ig3dki","EAbrBxB0GxUdRckxUDYXe8lRRu0cHI3juxTQmXsUH47-t5XzT1GcS7sfL_gZ");

// p.createPayment({})


