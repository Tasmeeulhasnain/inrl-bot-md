//created by @inrl
const {
    inrl,
    sleep,
    extractUrlsFromString,
    searchYT,
    downloadMp3,
    downloadMp4,
    GenListMessage
} = require('../lib/');
const {
    BASE_URL
} = require('../config');
inrl({
    pattern: 'song',
    type: "downloader"
}, async (m) => {
    try {
        const match = m.client.text;
        if (!match) return await m.send("*_give me url or quarry_*");
        const url = await extractUrlsFromString(match);
        if (!url[0]) {
            const result = await searchYT(match);
            if (!result[0]) return await m.send('_not found_');
            let msg = "YT SONG DOWNLOADER tasmee khan",
                arr = [];
            return await m.send(GenListMessage(msg, result));
        } else {
            const ress = await downloadMp3(url[0]);
            return await m.sock.sendMessage(m.from, {
                audio: ress,
                mimetype: 'audio/mpeg'
            });
        }
    } catch (e) {
        return m.send('_Time Out_ ' + e);
    }
});
inrl({
    pattern: 'video',
    type: "downloader"
}, async (m) => {
    try {
        const match = m.client.text;
        if (!match) return await m.send("*_give me url or quarry_*");
        const url = await extractUrlsFromString(match);
        if (!url[0]) {
            const result = await searchYT(match);
            if (!result[0]) return await m.send('_not found_');
            let msg = "YT VIDEO DOWNLOADER tasmee khan";
            return await m.send(GenListMessage(msg, result));
        } else {
            const ress = await downloadMp4(url[0]);
            return await m.sock.sendMessage(m.from, {
                video: ress,
                mimetype: 'video/mp4'
            });
        }
    } catch (e) {
        return m.send('_Time Out_');
    }
});
inrl({
    pattern: 'ytdl',
    type: "downloader",
    on: "text"
}, async (m, conn, match) => {
    if (!m.quoted || !m.quoted.fromMe) return;
    try {
        if (m.client.body.includes("YT VIDEO DOWNLOADER  tasmee khan")) {
            match = m.client.body.replace("YT VIDEO DOWNLOADER", "").trim();
            await m.send(`*_downloading_*\n*_${match}_*`);
            const result = await searchYT(match, true);
            const ress = await downloadMp4(result[0]);
            return await m.sock.sendMessage(m.from, {
                video: ress,
                mimetype: 'video/mp4'
            });
        } else if (m.client.body.includes("YT SONG DOWNLOADER tasmee khan")) {
            match = m.client.body.replace("YT SONG DOWNLOADER tasmee khan", "").trim();
            await m.send(`*_downloading_*\n${match}`);
            const result = await searchYT(match, true);
            const ress = await downloadMp3(result[0]);
            return await m.sock.sendMessage(m.from, {
                audio: ress,
                mimetype: 'audio/mpeg'
            });
        }
    } catch (e) {
        console.log(e);
        return await m.send('_Error, try again!_')
    }
});
