$(document).ready(function () {
    addVersionSelector();
});

$(document).ajaxComplete(function () {
    //Check that the listitems haven't already been added in document ready
    if(!$(".versionselector .dropdown-menu li").length){
        addVersionSelector();
    }
});

function addVersionSelector() {
    for (var i = 0; i < versions.length; i++) {
        var obj = versions[i];
        
        var listitem = document.createElement("li");
        var link = document.createElement("a");
        link.setAttribute("href", obj.url);
        var linktext = document.createTextNode(obj.text);
        link.appendChild(linktext);
        listitem.appendChild(link);
        
        $(".versionselector .dropdown-menu").append(listitem);
    }
}

//Loading same page in other version, if it exists, otherwise redirecting to home page of other version
$(document).on('click', '.version-dropdown li a', function (event) {
    var current = window.location.href; 
    var filename = current.split('/').reverse()[0];
    var target = $(this).attr('href');
    var targetdir = target.replace('index.html', '');
    var lang = $('html')[0].lang;
    var candidate = window.location.protocol + "//" + window.location.host + targetdir + lang + '/' + filename;
    
    $.get(candidate).done(function () {
        window.location.href = candidate;
        return false;
        }).fail(function () {
        //Do nothing, just let the regular link go through to the index page
    });
});