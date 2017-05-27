module.exports = function(webserver, controller) {
      var bot = controller.spawn({
      
        "token": "xoxb-168669482176-fmW23812RLAhrO8J7xwhuu32"
    });

    webserver.post('/zapier', function(req, res) {

        res.status(200);
      console.log(req.body)
      if (req.body.alert=='Checklist') { 
        var data = req.body
        //respond to zapier with any data if needed
        res.json(
            data
        )
        bot.say({
            "channel": data.userid,
            "text": data.message,
             "attachments": [
        {
            "fallback": "Sorry",
            "callback_id": "checklistalert",
            "color": "#3AA3E3",
            "attachment_type": "default",
            "actions": [
                {
                    "name": "alertremind",
                    "text": "Remind Me",
                    "type": "button",
                    "value": "This doesnt work yet. :brandon:"
                }
                               
            ]
        }
    ]

        })

      }
       if (req.body.alert=='safeform') { 
        var data = req.body
        //respond to zapier with any data if needed
        res.json(
            data
        )
        bot.say({
            "channel": data.userid,
            "text": data.message})

      }

    });


}