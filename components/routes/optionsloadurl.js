module.exports = function(webserver, controller) {

    webserver.post('/slack/options', function(req, res) {
        res.status(200);
       var payload = JSON.parse(req.body.payload)

        if (payload.callback_id == 'praisenames') {
            var bamboohr = new(require('node-bamboohr'))({
                apikey: process.env.bamboohrapikey,
                subdomain: 'rainstormcarwash'
            })
            bamboohr.employees(function(err, employees) {
                function compare(a, b) {
                    if (a.fields.firstName < b.fields.firstName)
                        return -1;
                    if (a.fields.firstName > b.fields.firstName)
                        return 1;
                    return 0;
                }

                employees.sort(compare);
                var options = {
                    options: []
                };

                for (var i in employees) {
                    var id = employees[i].id;
                    var name = employees[i].fields.displayName;

                    options.options.push({
                        "text": name,
                        "value": id
                    })

                }
                res.json(
                    options
                )




            })
        }



    });

}