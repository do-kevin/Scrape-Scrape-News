$('#articles').hide();

$('#scrape-btn').click(function () {
    $('#articles').show();
    $.ajax({
        method: 'GET',
        url: '/scrape'
    }).then(function () {
        $.getJSON('/articles', function (data) {
            $('#articles').empty();
            for (let i = 0; i < data.length; i++) {
                $('#articles')
                    .append(`<h2 class="display-4 animated flipInX" data-id="${data[i]._id}">${data[i].title}</h2>`)
                    .append(`<p class="lead animated flipInX delay-2s">${data[i].summary}</p>`)
                    .append(`<form action="${data[i].link}" target="_blank"> <input class="btn btn-primary animated zoomIn delay-2s" type="submit" value="Link"/></form><hr><br>`);
            };
        });
    });
});


$(document).on('click', 'h2', function () {

    $('#notes').empty();

    var thisId = $(this).attr('data-id');

    $.ajax({
            method: 'GET',
            url: `/articles/${thisId}`
        })
        .then(function (data) {
            console.log('HIT 5');
            console.log(data);
            $('#notes').append(`<h3>${data.title}</h3>`);
            // $('#notes').append(`<h5>ID: ${data.note._id}</h5>`);
            $('#notes').append('<input id="titleinput" name="title">');
            $('#notes').append('<textarea id="bodyinput" name="body"></textarea>');
            $('#notes').append(`<button data-id="${data._id}" id="savenote">Save Note</button>`);

            console.log('HIT 4');
            console.log(data.note);
            if (data.note) {
                $('#titleinput').val(data.note.title);
                console.log(data.note.title);
                $('#bodyinput').val(data.note.body);
                console.log(data.note.body);
                // $('#notes').append(`<button data-id="${data._id}" id="deletenote">Delete Note</button>`);
                $("#notes").append("<button data-id='" + data.note._id + "' id='deletenote' class='btn btn-danger btn-sm mt-2 ml-2'>Erase Note</button>");
            };
        });
});

$(document).on('click', '#savenote', function () {
    var thisId = $(this).attr('data-id');
    console.log(`Note saved`);
    console.log(thisId);

    $.ajax({
            method: 'POST',
            url: `/articles/${thisId}`,
            data: {
                title: $("#titleinput").val(),
                body: $("#bodyinput").val()
            }
        })
        .then(function (data) {
            console.log(`LINE 61`);
            console.log(data);
            $("#notes").empty();
        });
    $("#titleinput").val("");
    $("#bodyinput").val("");
});

$(document).on('click', '#deletenote', function () {
    var thisId = $(this).attr('data-id');
    console.log(thisId);

    $.ajax({
            method: 'DELETE',
            url: '/articles/' + thisId
            // data: {
            //     title: $("#titleinput").val(""),
            //     body: $("#bodyinput").val("")
            // }
        })
        .then(function (data) {
            console.log(`hithit`);
            console.log(data);
            
            console.log(`Note deleted. HIT`);
            $("#notes").empty(); 
        });
     
});