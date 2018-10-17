$(`#scrape-btn`).click(function () {
    $.ajax({
        method: `GET`,
        url: `/scrape`
    }).then(function () {
        $.getJSON(`/articles`, function (data) {
            $(`#articles`).empty();
            for (let i = 0; i < data.length; i++) {
                $(`#articles`)
                    .append(`<h2 data-id="${data[i]._id}">${data[i].title}</h2>`)
                    .append(`<p>${data[i].summary}</p>`)
                    .append(`<a href="${data[i].link}">${data[i].link}</a><br>`);
            };
        });
    });
});



$(document).on(`click`, `h2`, function () {

    $(`#notes`).empty();

    var thisId = $(this).attr(`data-id`);

    $.ajax({
            method: `GET`,
            url: `/articles/${thisId}`
        })
        .then(function (data) {
            console.log(data);
            $(`#notes`).append(`<h2>${data.title}</h2>`);
            $(`#notes`).append(`<input id="titleinput" name="title">`);
            $(`#notes`).append(`<textarea id="bodyinput" name="body"></textarea>`);
            $(`#notes`).append(`<button data-id="${data._id}" id="savenote">Save Note</button>`);

            if (data.note) {
                $(`#titleinput`).val(data.note.title);
                $(`#bodyinput`).val(data.note.body);
            };
        });
});

$(document).on(`click`, `#savenote`, function () {
    var thisId = $(this).attr(`data-id`);

    $.ajax({
            method: `POST`,
            url: `/articles/${thisId}`,
            data: {
                // Value taken from title input
                title: $(`#titleinput`).val(),
                // Value taken from note textarea
                body: $(`#bodyinput`).val()
            }
        })
        .then(function (data) {
            console.log(data);
            $(`#notes`).empty();
        });

    // Also, remove the values entered in the input and textarea for note entry
    $(`#titleinput`).val("");
    $(`#bodyinput`).val("");
});