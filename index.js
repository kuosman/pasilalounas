var path = require('path');

var express = require('express');
var app = express();
app.set('port', (process.env.PORT || 3000));
app.set('view engine', 'pug');
app.use(express.static(path.join(__dirname, 'public')));

var lunch = require('./lunch');

var days = "maanantai,tiistai,keskiviikko,torstai,perjantai".split(',');
function getDay(requested) {
    if(days.indexOf(requested) !== -1) {
        return requested;
    }
    var day = new Date().getDay();
    if(day === 0) {
        return days[0];
    }
    if(day > 5) {
        return days[days.length - 1];
    }
    return days[day - 1];
}
function renderHtml(req, res) {
    var day = getDay(req.params.day);
    lunch(day).then(function(result) {
        res.render('index', {
            title: 'Lounas@Pasila',
            options : days,
            day : day,
            places: result || []
        });
    });
}
// need to setup json before day-routes so it's triggered correctly
app.get('/lunch.json', function (req, res) {
    res.setHeader("Access-Control-Allow-Origin", "*");
    lunch().then(function(result) {
        res.send(result);
    });
});

// index and day-routes
app.get('/', renderHtml);
app.get('/:day', renderHtml);


app.listen(app.get('port'), function () {
  console.log('Node app is running on port', app.get('port'));
});
