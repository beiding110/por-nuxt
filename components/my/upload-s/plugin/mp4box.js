import mp4box from 'mp4box';

function checkAvc(file) {
    return new Promise((res, rej) => {
        if (!/mp4/i.test(file.type)) {
            return res();
        }

        var mp4boxFile = mp4box.createFile();

        mp4boxFile.onReady = function(info){
            let mime = info.mime,
                codecs = mime.match(/codecs="(\S*),/);

            if (!codecs) {
                rej();
                return;
            } 

            let codec = codecs[1];

            if (codec.indexOf('avc') === -1) {
                rej();
            } else {
                res();
            }
        };

        var reader = new FileReader(),
            buffer = reader.readAsArrayBuffer(file);

        reader.onload = function(e) {
            var arrayBuffer = e.target.result;
            arrayBuffer.fileStart = 0;
            mp4boxFile.appendBuffer(arrayBuffer);
        };
    });
};

export default {
    checkAvc,
};