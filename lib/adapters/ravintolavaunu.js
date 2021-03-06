var request = require('request');
var cheerio = require('cheerio');
var Promise = require("bluebird");
var util = require('../util');

// var url = 'http://www.jk-kitchen.fi/index.php/lounaslistavaunu';
var url = 'https://www.jk-kitchen.fi/ravintola-vaunu/';

function parse(body) {
    body = body.split('<br />').join('\n');
    $ = cheerio.load(body);
    var content = $('.tm-article');

    var txt = content.text();
    //console.log(content.html());
    var result = txt.split('\n').filter(hasValue);
    var res = {};
    var latestDay;
    result.forEach(function(item) {
        var txt = item.trim();
        if(txt.indexOf('MA ') === 0) {
            latestDay = null;
        }
        var day = extractDay(txt);
        if(day) {
            res[day] = [];
            latestDay = day;
            return;
        }
        if(!latestDay) {
            return;
        }

        res[latestDay].push(txt);
    });
    return res;
}

function getMenu() {
  return new Promise(function(resolve, reject) {
    request(url, function (error, response, body) {
        if (error || response.statusCode !== 200) {
            reject(error);
            return;
        }
        resolve(parse(body));
    });
  });
}

function extractDay(txt) {
    var currentDay;
    util.days.forEach(function(day) {
        if(currentDay) {
            return;
        }
        if(txt.toLowerCase().indexOf(day) === 0) {
            currentDay = day;
        }
    })
    return currentDay;
}

function hasValue(value) {
  return value.length > 1;
}
module.exports = {
    name : "Ravintola vaunu",
    url : url,
    parse : parse,
    getMenu : getMenu
};
