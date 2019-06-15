module.exports = function (data, sentInfo) {

    const config = require("./config.js");

    let videos = [];

    if(data)videos = data;
    else videos = require("./videos.js")();

    videos = Array.from((new Set(videos)));

    let YoutubeMp3Downloader = require("youtube-mp3-downloader");

    let YD = new YoutubeMp3Downloader({
        "ffmpegPath": "/usr/bin/ffmpeg",
        "outputPath": config.outputPath,    // Where should the downloaded and encoded files be stored?
        "youtubeVideoQuality": "highest",       // What video quality should be used?
        "queueParallelism": 2,                  // How many parallel downloads/encodes should be started?
        "progressTimeout": 2000                 // How long should be the interval of the progress reports
    });


    if (videos.length !== 0 && videos.every(v => v.includes('https://www.youtube.com/watch?v='))) {

        let videosDowloadedCount = 0;

        sentMessage('Inicio de la descarga de ' + videos.length + ' canciones...', sentInfo);

        videos.forEach(v => YD.download(v.split('=')[1]));

        YD.on("finished", function (err, data) {
            if (err) sentMessage('Algo ha ido mal amigo', sentInfo);
            else {
                videosDowloadedCount++;
                sentMessage('Canción ' + videosDowloadedCount + '/' + videos.length + ' lista: ' + data.videoTitle, sentInfo);

                if(videosDowloadedCount === videos.length) sentMessage('Descarga acabada.', sentInfo);
            }
        });

    } else sentMessage('formato no valido', sentInfo);

};

function sentMessage(message, sentInfo) {
    console.log(message);
    sentInfo(message);
}