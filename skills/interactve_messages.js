module.exports = function (controller) {
	controller.on('interactive_message_callback', function (bot, trigger,convo) {
		if (trigger.actions[0].name.match(/^action$/)) {
			controller.trigger(trigger.actions[0].value, [bot, trigger]);
			return false; // do not bubble event
		}
		if (trigger.actions[0].name.match(/^say$/)) {
			var message = {
				user: trigger.user,
				channel: trigger.channel,
				text: trigger.actions[0].value,
				type: 'message',
			};
			var reply = trigger.original_message;
			for (var a = 0; a < reply.attachments.length; a++) {
				reply.attachments[a].actions = null;
			}
			var person = '<@' + trigger.user.id + '>';
			if (message.channel[0] == 'D') {
				person = 'You';
			}
			bot.replyInteractive(trigger, reply);
			controller.receiveMessage(bot, message);
			return false; // do not bubble event
		}
		if (trigger.actions[0].name.match(/^select$/)) {
			var message = {
				user: trigger.user,
				channel: trigger.channel,
				text: trigger.actions[0].selected_options[0].value,
				type: 'message',
			};
			var reply = trigger.original_message;
			for (var a = 0; a < reply.attachments.length; a++) {
				reply.attachments[a].actions = null;
			}
			var person = '<@' + trigger.user.id + '>';
			if (message.channel[0] == 'D') {
				person = trigger.user.id;
			}
			bot.replyInteractive(trigger, reply);
			controller.receiveMessage(bot, message);
			return false; // do not bubble event
		}
		if (trigger.actions[0].name.match(/^praise$/)) {
			var message = {
				user: trigger.user,
				channel: trigger.channel,
				text: trigger.actions[0].selected_options[0].value,
				type: 'message',
			};
			

			controller.studio.get(bot, 'Praise', message.user, message.channel).then(function (convo) {
        			bot.api.chat.delete({
				ts: trigger.message_ts,
				channel: trigger.channel,
				as_user: "true"
			});
				var empid = trigger.actions[0].selected_options[0].value
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
            convo.setVar('EmployeeID', empid)
					}
				});
        var reply = trigger.original_message;
			for (var a = 0; a < reply.attachments.length; a++) {
				reply.attachments[a].actions = null;
			}
        var EmployeeName = convo.vars.EmployeeName
			reply.attachments.push({
				text: EmployeeName
			})
				bot.replyInteractive(trigger, reply);
				convo.activate();
			});
			return false; // do not bubble event
		}
		if (trigger.actions[0].name.match(/^log$/)) {
			var message = {
				user: trigger.user,
				channel: trigger.channel,
				text: trigger.actions[0].selected_options[0].value,
				type: 'message',
			};
			var reply = trigger.original_message;
			for (var a = 0; a < reply.attachments.length; a++) {
				reply.attachments[a].actions = null;
			}
			bot.replyInteractive(trigger, reply);
			controller.receiveMessage(bot, message);
			return false; // do not bubble event
		}
		if (trigger.actions[0].name.match(/^alertremind$/)) {
			var message = {
				user: trigger.user,
				channel: trigger.channel,
				text: "/remind @brad in one hour",
				type: 'message',
			};
			bot.api.reminders.add({
				token: bot.config.bot.app_token,
				text: trigger.original_message.text,
				time: "in 4 hours",
				user: trigger.user
			});
			bot.api.chat.delete({
				ts: trigger.message_ts,
				channel: trigger.channel,
				as_user: "true"
			});
			bot.say({
				channel: trigger.channel,
				text: "I will remind you of " + trigger.original_message.text
			})
			var reply = trigger.original_message;
			for (var a = 0; a < reply.attachments.length; a++) {
				reply.attachments[a].actions = null;
			}
			bot.replyInteractive(trigger, reply);
			controller.receiveMessage(bot, message);
			return false; // do not bubble event
		}
    if (trigger.actions[0].name.match(/^cancel$/)) {
			var message = {
				user: trigger.user,
				channel: trigger.channel,
				text: "/remind @brad in one hour",
				type: 'message',
			};
			bot.api.chat.delete({
				ts: trigger.message_ts,
				channel: trigger.channel,
				as_user: "true"
			});
			return false; // do not bubble event
		}
	});
}