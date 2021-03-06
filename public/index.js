var socket = io();
var main = document.getElementById('main');
var counter = 9999;
socket.on('places', function(msg) {
    counter = msg.length;
    console.log('places', msg);
});
socket.on('menu', function(msg) {
    var container = document.getElementById('place_' + msg.id);
    var list = container.querySelector('.panel-body ul');
    list.removeChild(list.childNodes[0]);
    if(!msg.menu || !msg.menu[currentDay]) {
        list.appendChild(createListItem('Listaa ei saatu ladattua.', true));
        list.appendChild(createLinkItem(msg.url,'Katso ravintolan sivuilta >>'));
    } else {
        // currentDay is inlined as global in HTML
        msg.menu[currentDay].forEach(function(menuItem) {
            list.appendChild(createListItem(menuItem));
        });
    }
    counter--;
    if(counter === 0) {
        // got all the menus -> disconnect
        socket.close();
        console.log('Close socket');
    }
    console.log('menu for ' + msg.name, msg);
});

setTimeout(function() {
    if(counter !== 0) {
        socket.close();
        console.log('Closing socket after a minute of waiting for menus. ' + counter + ' menus didnt load.');
    }
}, 60000);

function createListItem(value, insertBreaks) {
    var li = document.createElement("li");
    var t = document.createTextNode(value);
    li.appendChild(t);
    if(insertBreaks) {
        li.appendChild(document.createElement("br"));
        li.appendChild(document.createElement("br"));
    }
    return li;
}
function createLinkItem(href, text) {
    var li = document.createElement("li");
    var link = document.createElement("a");
    link.setAttribute('href', href);
    link.setAttribute('target', '_blank');
    var t = document.createTextNode(text);
    link.appendChild(t);
    li.appendChild(link);
    return li;
}
