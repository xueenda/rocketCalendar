var today = new Date();
var matrix = {};

// Init calendar
var calendar = new JSCalendar(document.getElementById('test-instance'), {
  views: [""],
  titleCropSize: 30,
  eventBackground: "rgb(193, 155, 113)"
});

calendar.init();

_fetchLaunchEvents(today.getFullYear(), today.getMonth());


calendar.on('goNext', function(data, state) {
  _fetchLaunchEvents(state.year, state.month);
});


function _daysInMonth(year, month) {
  return new Date(year, month + 1, 0).getDate();
}


function _buildUrl(year, month) {
  var date = new Date(year + (month<9 ? "-0" : "-") + (month + 1) + '-01');
  var start = date.toISOString().substring(0, 10);

  date = new Date(year + (month<9 ? "-0" : "-") + (month + 1) + '-' + _daysInMonth(year, month));
  var end = date.toISOString().substring(0, 10);

  return "https://launchlibrary.net/1.2/launch/" + start + "/" + end;
}


function _fetchLaunchEvents(year, month) {
  // Call Launch API to get events
  var data = null;
  var events = {};

  var xhr = new XMLHttpRequest();
  xhr.addEventListener("readystatechange", function() {
    if (this.readyState === 4) {
      var result = JSON.parse(this.responseText);

      result = result.launches;

      result.forEach(function(e) {
        var date = (new Date(e.windowstart)).getUTCDate();

        if (!events[date])
          events[date] = [];

        events[date].push({
          displayname: e.name,
          color: _randomHexColor() || rgb(156, 61, 39)
        });
      });

      console.log(events);
      _renderEvents(year, month, events);
    }
  });

  xhr.open("GET", _buildUrl(year, month));

  xhr.send(data);
}


function _randomHexColor() {
  return '#' + Math.floor(Math.random() * 16777215).toString(16);
}


function _renderEvents(year, month, events) {
  if (!matrix[year])
    matrix[year] = {};

  if (!matrix[year][month])
    matrix[year][month] = {};

  matrix[year][month] = events;

  calendar.setMatrix(matrix).render();
}