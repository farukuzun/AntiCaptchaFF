if (typeof Background !== 'function') {
	Background = function (browser, $, window) {
		this.browser = browser;
		this.$ = $;
		this.window = window;
		this.init();
	};
	Background.prototype = {
		constructor: Background,
		init: function () {
			var self = this;
			this.initMessageListener();
		},
		initMessageListener: function () {
			var self = this;
			this.browser.runtime.onMessage.addListener(function (message, sender, response) {
				if (!self[message.method]) {
					return;
				}
				var tab = sender;
				message.args = message.args || [];
				message.args.push(tab);
				message.args.push(response);
				self[message.method].apply(self, message.args || []);
				return true;
			});
		},
		sendMessageToTab: function (method, args, cb, tabId) {
			args = (args === null || typeof args === "undefined") ? [] : args;
			args = Array.isArray(args) ? args : [args];
			cb = typeof cb === "undefined" ? null : cb;
			if (typeof tabId === "undefined" || typeof method === "undefined") {
				throw new Error(
					"Missing required parameter " +
					(typeof tabId === "undefined" ? "'tabId'" : "'method'")
				);
			}
			this.browser.tabs.sendMessage(tabId, {
				method: method,
				args: args
			}, cb);
		},
		getTaskId:function(args,tab,cb) {
			var self = this;
			var data = {};
			var task = {};
			task.type="NoCaptchaTaskProxyless";
			task.websiteURL = args.site;
			task.websiteKey = args.dataSiteKey;
			task.proxyType = "http";
			task.proxyAddress = "8.8.8.8";
			task.proxyPort = "8080";
			task.proxyLogin = "proxyLoginHere";
			task.proxyPassport = "proxyPasswordHere";
			task.userAgent = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/52.0.2743.116 Safari/537.36";
			data.clientKey = "YourAntiCaptchaKey";
			data.task = task
      self.$.ajax({
        url: 'http://api.anti-captcha.com/createTask',
        type: 'POST',
        dataType: 'json',
        contentType: 'application/json',
        data: JSON.stringify(data),
        success: function (data, status) {
          var res = {};
          res.status = status;
          res.data = data;
          cb(res);
        },
        error: function (xhr, ajaxOptions, thrownError) {
          var res = {};
          res.status = xhr.status;
          cb(res);
        } //set tokenString before send
      })
		},
		getPassword: function(args, tab, cb) {
			var self = this;
			var data = {};
			data.clientKey = "YourAntiCaptchaKey";
			data.taskId = args.taskId;
      self.$.ajax({
        url: 'https://api.anti-captcha.com/getTaskResult',
        type: 'POST',
        dataType: 'json',
        contentType: 'application/json',
        data: JSON.stringify(data),
        success: function (data, status) {
          var res = {};
          res.status = status;
          res.args = args;
          res.data = data;
          cb(res);
        },
        error: function (xhr, ajaxOptions, thrownError) {
          var res = {};
          res.status = xhr.status;
          cb(res);
        } //set tokenString before send
      })
		},
		successNotify:function(args,tab,cb) {
			var self = this;
      var cakeNotification = "cake-notification";
      self.browser.notifications.create(cakeNotification, {
        "type": "basic",
        "iconUrl": self.browser.extension.getURL("resources/images/recaptcha-gif.gif"),
        "title": "Captcha Solved!",
        "message": "Captcha successfully solved\n"+args.site+"\n"+args.date
      });
		},
    enableKeyListener: function(tab) {
      var self = this;
      var tabId = tab.tab.id;
      self.browser.commands.onCommand.addListener(function(command) {
        if (command == "toggle-feature") {
          self.browser.tabs.query(
            {currentWindow: true, active : true},
            function(tabArray){
            	console.log(tabArray);
              self.sendMessageToTab('enableArriveOnce',null,null,tabArray[0].id);
            }
          )
        }
      });
    }
	}
}
var background = new Background(browser, jQuery, window);
