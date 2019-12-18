
function loadData() {

    var $body = $('body');
    var $wikiElem = $('#wikipedia-links');
    var $nytHeaderElem = $('#nytimes-header');
    var $nytElem = $('#nytimes-articles');
    var $greeting = $('#greeting');
    var $newsElem = $('#news-elem')
    var $newsHeaderElem = $('#news-header');

    // clear out old data before new request
    $wikiElem.text("");
    $nytElem.text("");
    $newsElem.text("");

    var streetStr = $('#street').val();
    var cityStr = $('#city').val();
    var address = streetStr + ', ' + cityStr;

    $greeting.text('Então você quer morar em ' + address + '?');


    // -------------------------------- Google maps --------------------------

    var streetviewUrl = 'http://maps.googleapis.com/maps/api/streetview?size=600x400&location=' + address + '';

    $body.append('<img class="bgimg" src="' + streetviewUrl + '">');

    // -------------------------------- NY Times ----------------------------- 

    var nytimesUrl = 'http://api.nytimes.com/svc/search/v2/articlesearch.json?q=' + cityStr + '&sort=newest&api-key=cGkDcrqi4RzqMJkx31FqYQeewkGcIgO2'

    $.getJSON(nytimesUrl, function (data) {

        $nytHeaderElem.text('Artigos do New York Times sobre ' + cityStr);

        articles = data.response.docs;
        for (var i = 0; i < articles.length; i++) {
            var article = articles[i];
            $nytElem.append('<li class="article">' + '<a href="' + article.web_url + '">' + article.headline.main + '</a>' + '<p>' + article.snippet + '</p>' + '</li>');
        };
    })

    // tratamento de erros do request
    //.error(funtion(e){
    //  $nytHeaderElem.text('Os artigos não foram carregados pois ocorreu um erro');
    //}); 

    // ------------------------------- Wikipedia ------------------------------

    var wikiUrl = 'http://en.wikipedia.org/w/api.php?action=opensearch&search=' + cityStr + '&format=json&callback=wikiCallback';

    // Timeout wikipedia request
    var wikiRequestTimeout = setTimeout(function () {
        $wikiElem.text("Falha ao carregar conteúdo da Wikipedia");
    }, 8000);

    $.ajax({
        url: wikiUrl,
        dataType: "jsonp",
        // jsonp: "callback",
        success: function (response) {
            var articleList = response[1];

            for (var i = 0; i < articleList.length; i++) {
                articleStr = articleList[i];
                var url = 'http://en.wikipedia.org/wiki/' + articleStr;
                $wikiElem.append('<li><a href="' + url + '">' + articleStr + '</a></li>');
            };

            clearTimeout(wikiRequestTimeout);
        }
    });

    // ----------------------------- News API -----------------------------------

    // News api: f3fdc4acb3764b64b9f8a373792e5b72
    // https://newsapi.org/v2/everything?q=s%C3%A3o%20carlos%20sp&apiKey=f3fdc4acb3764b64b9f8a373792e5b72

    // Notícias brasileiras sobre a cidade pesquisada
    var newsUrl = 'https://newsapi.org/v2/everything?q=' + cityStr+ '&language=pt&apiKey=f3fdc4acb3764b64b9f8a373792e5b72'

    $.getJSON(newsUrl, function (data) {
        $newsHeaderElem.text('Notícias sobre ' + cityStr);
        news = data.articles;
        for (var i = 0; i < 10; i++) {
            var newsObj = news[i];
            $newsElem.append('<li class="news">' + '<a href="' + newsObj.web_url + '">' + newsObj.title + '</a>' + '<p>' + newsObj.content + '</p>' + '</li>');
        };
    });

};

$('#form-container').submit(loadData);



loadData();
