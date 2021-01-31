$(document).ready(function(){
  
  $("#search-button").on("click", function() {
    var searchValue = $("#search-value").val();
    console.log(searchValue);
    $("#search-value").empty();
    weatherGet(searchValue);
  });
  $(".history").on("click", "li", function() {
    weatherGet($(this).text());
});
var history = JSON.parse(window.localStorage.getItem("history")) || [];
if (history.length > 0) {
  weatherGet(history[history.length-1]);
}
for (var i = 0; i < history.length; i++) {
  createRow(history[i]);
}
      function createRow(text) {
        var li = $("<li>").addClass("list-group-item list-group-item-action").text(text);
        $(".history").append(li);
      }
      var apiKey = "&APPID=69bbf217d8e0df63895bb6e1248478ef";
      function weatherGet(searchValue){
        $.ajax({
          type: "GET",
          url: "http://api.openweathermap.org/data/2.5/weather?q="+searchValue+apiKey,
          success: function(response) {
            console.log(response);
            if (history.indexOf(searchValue) === -1) {
              history.push(searchValue);
              window.localStorage.setItem("history", JSON.stringify(history));      
              createRow(searchValue);
            }
            var title = $("<h3>").addClass("card-title").text(response.name + " (" + new Date().toLocaleDateString() + ")");
            var card = $("<div>").addClass("card-fluid");
            var wind = $("<p>").addClass("card-text").text("Wind Speed: " + response.wind.speed + " MPH");
            var humidity = $("<p>").addClass("card-text").text("Humidity: " + response.main.humidity + "%");
            var temperature = $("<p>").addClass("card-text").text("Temperature: " + response.main.temp + " °F");
            var cardBody = $("<div>").addClass("card-body ");
            var img = $("<img>").attr("src", "http://openweathermap.org/img/w/" + response.weather[0].icon + ".png");
            title.append(img);
            cardBody.append(title, temperature, humidity, wind);
            card.append(cardBody);
            $("#today").append(card);
            forecastGet(searchValue);
            uvIndex(response.coord.lat, response.coord.lon);
          }
        }); 
      }          
      function forecastGet(searchValue) {
        $.ajax({
          type: "GET",
          url: "http://api.openweathermap.org/data/2.5/forecast?q="+ searchValue + apiKey,
          dataType: "json",
          success: function(response) {
            $("#forecast").html("<h3 class=\"mt-2\">Your 5-Day ForeCast</h3>").append("<div class=\"row\">");
            for (var i = 0; i < response.list.length; i++) {
              if (response.list[i].dt_txt.indexOf("12:00:00") !== -1) {
                var col = $("<div>").addClass("col-md-2");
                var card = $("<div>").addClass("card-fluid bg-info text-white");
                var body = $("<div>").addClass("card-body p-1");
                var title = $("<h5>").addClass("card-title").text(new Date(response.list[i].dt_txt).toLocaleDateString());
                var img = $("<img>").attr("src", "http://openweathermap.org/img/w/" + response.list[i].weather[0].icon + ".png");
                var p1 = $("<p>").addClass("card-text").text("Temp: " + response.list[i].main.temp_max + " °F");
                var p2 = $("<p>").addClass("card-text").text("Humidity: " + response.list[i].main.humidity + "%");
                col.append(card.append(body.append(title, img, p1, p2)));
                $("#forecast .row").append(col);
              }
            }
          }
        });
      }
      function uvIndex(lat, lon) {
        $.ajax({
          type: "GET",
          url: "http://api.openweathermap.org/data/2.5/uvi?"+apiKey+"&lat="+lat+"&lon="+lon,
          dataType: "json",
          success: function(response) {
            var uv = $("<p>").text("UV: ");
            var btn = $("<span>").addClass("btn btn-sm").text(response.value);
            if (response.value < 3) {
              btn.addClass("btn-success");
            }
            else if (response.value < 7) {
              btn.addClass("btn-warning");
            }
            else {
              btn.addClass("btn-danger");
            }
            $("#today .card-body").append(uv.append(btn));
          }
        });
      } 
    });