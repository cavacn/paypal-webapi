Paypal-webapi
---
从[这里](https://devtools-paypal.com/guide/pay_paypal/curl?env=sandbox)获取了部分代码，然后进行了一些封装。

install
---
	npm install paypal-webapi
How to use
---
	var Paypal = require("paypal-webapp");
	var paypal = new Paypal();
	paypal.init(clientid,secret);
	paypal.createPayment(data,cb);//创建订单
	paypal.checkPayment(data,cb);//check订单