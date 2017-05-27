module.exports = function (controller) {
	controller.hears('^till', ['ambient', 'direct_message', 'direct_mention', 'mention'], function (bot, message) {
		bot.startConversation(message, function (err, convo) {
			bot.api.reactions.add({
				timestamp: message.ts,
				channel: message.channel,
				name: 'robot_face'
			});
			bot.api.users.info({
				user: message.user
			}, function (err, resp) {
				var realname = resp.user.profile.first_name;
				var reply_with_attachments = {
					"attachments": [{
						"fallback": "Pre-filled because you have actions in your attachment.",
						"color": "#ff0000",
						"mrkdwn_in": ["text", "pretext", "fields"],
						"pretext": "Hello " + realname + ", are we increasing or decreasing the Till?",
						"callback_id": "Pre-filled because you have actions in your attachment.",
						"attachment_type": "default",
						"actions": [{
							"name": "say",
							"text": "Increase",
							"type": "button",
							"style": "default",
							"value": "Increase"
						}, {
							"name": "say",
							"text": "Decrease",
							"type": "button",
							"style": "default",
							"value": "Decrease"
						}, {
							"name": "say",
							"text": "Abort",
							"type": "button",
							"style": "danger",
							"value": "Abort"
						}]
					}]
				}
				convo.addQuestion(reply_with_attachments, [{
					pattern: 'increase',
					callback: function (response, convo) {
						var type = 'increase'
						convo.setVar('type', type)
						convo.gotoThread('amount')
					},
				}, {
					pattern: 'decrease',
					callback: function (response, convo) {
						var type = 'decrease'
						convo.setVar('type', type)
						convo.gotoThread('amount')
					},
				}, {
					pattern: 'abort',
					callback: function (response, convo) {
						convo.gotoThread('abort_thread');
					},
				}, {
					default: true,
					callback: function (response, convo) {
						convo.gotoThread('bad_response');
					},
				}], {}, 'default')
				convo.addMessage({
					text: 'Operation aborted :red_circle:',
					action: 'stop',
				}, 'abort_thread');
				convo.addMessage({
					text: 'Sorry I did not understand. Click one of the buttons :smile:  Type till to restart',
				}, 'bad_response');
				convo.addQuestion(`Please enter the amount with no dollar signs.  Like this 20.00`, [{
					default: true,
					callback: function (response, convo) {
						var amount = response.text
						convo.setVar('amount', amount)
						convo.gotoThread('location')
					}
				}, ], {}, 'amount')
				var reply_with_locations = {
					"text": "Finally, please select your location:",
					"response_type": "in_channel",
					"attachments": [{
						"title": "",
						"text": "",
						"fields": [],
						"callback_id": "location",
						"actions": [{
							"text": "Locations",
							"name": "select",
							"type": "select",
							"data_source": "default",
							"options": [{
								"text": "Rainstorm 1",
								"value": "Rainstorm 1",
								"description": "",
								"selected": false
							}, {
								"text": "Rainstorm 2",
								"value": "Rainstorm 2"
							}, {
								"text": "Rainstorm 3",
								"value": "Rainstorm 3"
							}, {
								"text": "Rainstorm 4",
								"value": "Rainstorm 4"
							}, {
								"text": "Rainstorm 5",
								"value": "Rainstorm 5"
							}, {
								"text": "Rainstorm 6",
								"value": "Rainstorm 6"
							}, {
								"text": "Rainstorm 7",
								"value": "Rainstorm 7"
							}, {
								"text": "Rainstorm 8",
								"value": "Rainstorm 8"
							}, {
								"text": "Rainstorm 9",
								"value": "Rainstorm 9"
							}]
						}]
					}]
				}
				convo.addQuestion(reply_with_locations, [{
					default: true,
					callback: function (response, convo) {
						var location = response.text
						convo.setVar('finish', location)
						convo.gotoThread('finish')
					},
				}, ], {}, 'location');
				convo.addMessage({
					text: 'Thanks we got your {{vars.type}} of {{vars.amount}} for {{vars.location}}.',
					action: 'completed',
				}, 'finish')
				convo.on('end', function (convo) {
					if (convo.status == 'completed') {
						var type = convo.extractResponse('type')
						var https = require("https");
						var data = JSON.stringify({
							user: realname,
							type: type
						});
						console.log(data)
						var options = {
							host: "hooks.zapier.com",
							port: 443,
							path: "/hooks/catch/382816/1a7lmn/",
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
					}
				});
			});
		});
	});
}