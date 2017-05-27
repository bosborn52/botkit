/*

Botkit Studio Skill module to enhance the "Praise" script

*/
module.exports = function (controller) {
	controller.hears(['^Praise'], ['ambient', 'direct_message', 'direct_mention', 'mention'], function (bot, message) {
            bot.api.chat.delete({
            token: bot.config.bot.app_token,
            ts: message.ts,
            channel: message.channel,
            as_user: "true"
        });
		bot.createConversation(message, function (err, convo) {
			bot.api.users.info({
				user: message.user
			}, function (err, resp) {
				var realname = resp.user.profile.first_name;
				bot.say({
					text: 'Hello *' + realname + '* who would you like to *praise*?',
					attachments: [{
						"fallback": "If you could read this message, you'd be choosing something fun to do right now.",
						"color": "#3AA3E3",
						callback_id: 'praisenames',
						actions: [{
							name: "praise",
							text: "Rainstorm Team",
							type: "select",
							data_source: "external",
						}, ]
					}],
					channel: message.channel
				})
			});
		});
	})
	// Validate user input: slackname
	controller.studio.validate('Praise', 'slackname', function (convo, next) {
		var value = convo.extractResponse('slackname');
		var empid = value
		var bamboohr = new(require('node-bamboohr'))({
			apikey: process.env.bamboohrapikey,
			subdomain: 'rainstormcarwash'
		})
		var employee = bamboohr.employee(empid)
		employee.get('firstName', 'lastName', 'displayName', function (err, emp) {
			if (err) {
				convo.end
			} else {
				convo.setVar('EmployeeName', emp.fields.displayName)
			}
		});
		console.log("Praise VARIABLE Slackname:" + value);
		// always call next!
		next();
	});
	// Validate user input: praisereason
	controller.studio.validate('Praise', 'praisereason', function (convo, next) {
		var value = convo.extractResponse('praisereason');
		convo.context.bot.api.chat.delete({
			token: convo.context.bot.config.bot.app_token,
			ts: convo.responses.praisereason.ts,
			channel: convo.responses.praisereason.channel,
			as_user: "true"
		});
		convo.context.bot.api.chat.delete({
			ts: convo.sent[0].api_response.ts,
			channel: convo.sent[0].api_response.channel,
			as_user: "true"
		});
		console.log("Praise VARIABLE Praise Reason:" + value);
		next();
	});
	// Validate user input: question_2
	controller.studio.validate('Praise', 'question_2', function (convo, next) {
		var value = convo.extractResponse('question_2');
		next();
	});
	controller.studio.after('Praise', function (convo, next) {
		if (convo.successful()) {
			convo.context.bot.api.users.info({
				user: convo.context.user
			}, function (err, resp) {
				var name = resp.user.name;
				var employeename = convo.vars.EmployeeName
				var slackname = convo.extractResponse('slackname');
				var praise = convo.extractResponse('praisereason');
				// Send data to Zapier
				var https = require("https");
				var data = JSON.stringify({
					praise: praise,
					employeename: employeename,
					bambooid: slackname,
					givername: name
				});
				console.log(data)
				var options = {
					host: "hooks.zapier.com",
					port: 443,
					path: "/hooks/catch/382816/18mzyo/",
					method: "POST",
					headers: {
						"Content-Type": "application/json",
						"Content-Length": Buffer.byteLength(data)
					}
				};
				var req = https.request(options, function (res) {
					var response = "";
					res.setEncoding("utf8");
					res.on("data", function (chunk) {
						response += chunk;
					});
					res.on("end", function () {
						console.log(response);
					});
				});
				req.write(data);
				req.end();
			});
		}
		next();
	});
}