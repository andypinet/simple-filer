var Utils = require("./utils");

function toArray(list) {
    return Array.prototype.slice.call(list || [], 0);
}

function errorHandler(e) {
    var msg = '';

    switch (e.code) {
        case FileError.QUOTA_EXCEEDED_ERR:
            msg = 'QUOTA_EXCEEDED_ERR';
            break;
        case FileError.NOT_FOUND_ERR:
            msg = 'NOT_FOUND_ERR';
            break;
        case FileError.SECURITY_ERR:
            msg = 'SECURITY_ERR';
            break;
        case FileError.INVALID_MODIFICATION_ERR:
            msg = 'INVALID_MODIFICATION_ERR';
            break;
        case FileError.INVALID_STATE_ERR:
            msg = 'INVALID_STATE_ERR';
            break;
        default:
            msg = 'Unknown Error';
            break;
    };

    console.log('Error: ' + msg);
}

function listResults(entries) {
    // Document fragments can improve performance since they're only appended
    // to the DOM once. Only one browser reflow occurs.
    var fragment = document.createDocumentFragment();

    entries.forEach(function(entry, i) {
        var size = "";
        var img = entry.isDirectory ? '【folder】' :
            '【file】';
        var li = document.createElement('li');
        var url = 'filesystem:' + window.location.protocol + '//' + window.location.hostname;
        var port = window.location.port ? ':' + window.location.port : '';
        // ${Utils.getFileSize(grantedBytes)}
        url += port + '/temporary/' + entry.name;
        entry.getMetadata(function(metadata) {
            size = Utils.getFileSize(metadata.size);
            console.log(size);
            li.innerHTML = [img, `<a href="${url}" download>`, entry.name, ` </a> <span>${size}</span>`].join('');
            fragment.appendChild(li);
        });
    });

    setTimeout(function() {
        document.querySelector('#filelist').appendChild(fragment);
    }, 0);
}

function onInitFs(fs) {

    var dirReader = fs.root.createReader();
    var entries = [];

    document.querySelector('#filelist').innerHTML = "";

    // Call the reader.readEntries() until no more results are returned.
    var readEntries = function() {
        dirReader.readEntries (function(results) {
            if (!results.length) {
                listResults(entries.sort());
            } else {
                entries = entries.concat(toArray(results));
                readEntries();
            }
        }, errorHandler);
    };

    readEntries(); // Start reading dirs.
}

module.exports = function () {
    window.requestFileSystem(window.TEMPORARY, 1024*1024, onInitFs, errorHandler);
};