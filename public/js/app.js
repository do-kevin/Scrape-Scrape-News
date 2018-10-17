$.getJSON(`/articles`, function(data) {
    for (let i = 0; i < data.length; i++) {
        $(`#articles`).append(`<p data-id="${data[i]._id}"> ${data[i].headline}<br>${data[i].summary}<br>${data[i].url}</p>`);
    };
});

$(document).on(`click`, `p`, function() {
    $(`#notes`).empty();
    
    var thisId = $(this).attr(`data-id`);

    $.ajax({
        method: `GET`,
        url: `/articles/${thisId}`
    }).then(function (data) {
        console.log(data);
        $(`#notes`).append(`<h2>${data.headline}</h2>`);
        $(`#notes`).append(`<input id="title-input" name="title">`);
        $(`#notes`).append(`<textarea id="body-input" name="body"></textarea>`);
        $(`#notes`).append(`<button data-id="${data._id }" id="save-note">Save Note</button>`);
        
        if (data.note) {
            $(`#title-input`).val(data.note.title);``
            $(`#bodyinput`).val(data.note.body);
        };
    });
});

$(document).on(`click`, `#save-note`, function () {
    var thisId = $(this).attr(`data-id`);

    $.ajax({
        method: `POST`,
        url: `/articles/${thisId}`,
        data: {
            title: $(`#title-input`).val(),
            body: $(`#body-input`).val()
        }
    }).then(function (data) {
        console.log(data);
        $(`#notes`).empty();
    });
    $(`#title-input`).val(``);
    $(`#body-input`).val(``);
});