/*

Botkit Studio Skill module to enhance the "Praise" script

*/
module.exports = function(controller) {
    controller.hears(['^Forms'], ['ambient', 'direct_message', 'direct_mention', 'mention'], function(bot, message) {
      
            bot.api.chat.delete({
            token: bot.config.bot.app_token,
            ts: message.ts,
            channel: message.channel,
            as_user: "true"
        });
 

        controller.studio.runTrigger(bot, 'forms ' + message.user, message.user, message.channel);

    });
    /* Validators */

    // Validate user input: question_1
    controller.studio.validate('forms','question_1', function(convo, next) {
        

        var value = convo.extractResponse('question_1');

        // test or validate value somehow
        // can call convo.gotoThread() to change direction of conversation

        console.log('VALIDATE: forms VARIABLE:' + value);

        // always call next!
        next();

    });

  controller.studio.after('forms', function(convo, next) {

        console.log(convo.sent[0].api_response);

        // handle the outcome of the convo
        if (convo.successful()) {
          convo.context.bot.api.chat.update({
            
            ts: convo.sent[0].api_response.ts,
            channel: convo.sent[0].api_response.channel,
            text: 'Hello World',
        attachments : "[]"}, function(err,res){
          console.log(res)
    })
        
        }

        // don't forget to call next, or your conversation will never properly complete.
        
    });
}