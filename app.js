var today = new Date();
var matrix = {};
var modal = document.getElementById('myModal');
var span = document.getElementsByClassName("close")[0];

// Init calendar
var calendar = new JSCalendar(document.getElementById('test-instance'), {
  views: [""],
  titleCropSize: 30,
  eventBackground: "rgb(193, 155, 113)",
  width: 'full'
});


calendar.init();


_fetchLaunchEvents(today.getFullYear(), today.getMonth());


calendar.on(['goNext','goBack'], function(data, state) {
  _fetchLaunchEvents(state.year, state.month);
});


calendar.on('click', function(data, event) {
  modal.style.display = "block";
  _showEvent(event.extra);
});


function _showEvent(event) {
  ['title', 'location', 'time', 'description'].forEach(function(k) {
    document.getElementById("event-" + k).innerHTML = event[k];
  });
  document.getElementById("add-to-calendar").href = event.calendarLink; 
}


function _daysInMonth(year, month) {
  return new Date(year, month + 1, 0).getDate();
}


function _buildUrl(year, month) {
  var date = new Date(year + (month < 9 ? "-0" : "-") + (month + 1) + '-01');
  var start = date.toISOString();

  date = new Date(year + (month < 9 ? "-0" : "-") + (month + 1) + '-' + _daysInMonth(year, month));
  var end = date.toISOString();

  return `https://clients6.google.com/calendar/v3/calendars/msacpn523mpjgq0jlooh41eme4@group.calendar.google.com/events?calendarId=msacpn523mpjgq0jlooh41eme4%40group.calendar.google.com&singleEvents=true&timeZone=Etc%2FGMT&maxAttendees=1&maxResults=250&sanitizeHtml=true&timeMin=${start}&timeMax=${end}&key=AIzaSyBNlYH01_9Hc5S1J9vuFmu2nUqBZJNAXxs`;
}


function _fetchLaunchEvents(year, month) {
  // Call Launch API to get events
  var data = null;
  var events = {};

  var xhr = new XMLHttpRequest();
  xhr.addEventListener("readystatechange", function() {
    if (this.readyState === 4) {
      var result = JSON.parse(this.responseText);

      result = result.items;

      result.forEach(function(e) {
        var date = (new Date(e.start.date || e.start.dateTime)).getUTCDate();

        if (!events[date])
          events[date] = [];

        events[date].push({
          displayname: e.summary,
          color: _randomHexColor() || rgb(156, 61, 39),
          extra: {
            title: e.summary,
            location: e.location,
            time: new Date(e.start.date || e.start.dateTime),
            description: e.description,
            calendarLink: e.htmlLink
          }
        });
      });

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


// When the user clicks on <span> (x), close the modal
span.onclick = function() {
  modal.style.display = "none";
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
}