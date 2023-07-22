const {
    inrl,
    getCompo,
    sleep
} = require('../lib')
inrl({
    pattern: 'iswa ?(.*)',
    fromMe: true,
    desc: 'List number in whatsapp',
    type: 'search',
}, async (m, conn, match) => {
    if (!match) return await m.send('_give me a number *Ex :917025099xx*_');
    if (!match.match('x')) return await m.send('_give me a number in valid Format! *Ex :917025099xx*_');
    let xlength = match.replace(/[0-9]/gi, '')
    if (xlength.length > 3) return await m.send("_you can use maximum x length upto3_")
    let count = xlength.length == 3 ? 1000 : xlength.length == 2 ? 100 : 10;
    const {key}= await m.send('_Please Wait 25 Seconds_');
    let ioo = await getCompo(match)
    let bcs = [],
        notFound = []
    ioo.map(async (a) => {
        let [rr] = await conn.onWhatsApp(a)
        if (rr && rr.exists) {
            bcs.push(rr.jid);
        }
    });
    let msg = "",
        prvt = [],
        abt, n = 1;
    await sleep(2500);
    msg += `*Exist on Whatsapp* (${bcs.length}/${count})\n`,
        bcs.map(async (jid) => {
            abt = await conn.fetchStatus(jid).catch((e) => {
                notFound.push(jid);
            });
            if (!abt.status) {
                prvt.push(jid)
            } else {
                msg += `${n++}. *Number :* ${jid.replace(/[^0-9]/gi,'')}\n*About :* ${abt.status}\n*Date :* ${abt.setAt.toLocaleString(undefined, {timeZone: 'Asia/Kolkata'})}\n\n`
            }
        })
    await sleep(1750)
    if (prvt.length) {
        msg += `*Privacy Settings on* (${prvt.length}/${bcs.length})\n\n`
        prvt.map((num) => {
            msg += `*Number:* ${num.replace(/[^0-9]/gi,'')}\n`
        });
    }
    await sleep(750)
    if (notFound.length) {
        msg += `Not Found (${bcs.length-n-prvt.length}/${bcs.length})\n\n`
        notFound.map((j) => {
            msg += `*Number:* ${j.replace(/[^0-9]/gi,'')}\n`
        })
    }
    await sleep(50)
    return await m.editMessage(m.jid,msg, key)
});


inrl({
    pattern: 'nowa ?(.*)',
    fromMe: true,
    desc: 'List number Thet Not Exist whatsapp',
    type: 'search',
}, async (m, conn, match) => {
    if (!match) return await m.send('_give me a number *Ex :917025099xx*_');
    if (!match.match('x')) return await m.send('_give me a number in valid Format! *Ex :917025099xx*_');
    let xlength = match.replace(/[0-9]/gi, '')
    if (xlength.length > 3) return await m.send("_you can use maximum x length upto3_")
    let count = xlength.length == 3 ? 1000 : xlength.length == 2 ? 100 : 10;
    const {key}= await m.send('_Please Wait 5 Seconds_');
    let ioo = await getCompo(match)
    let bcs = "*Number Not Exist On whatsApp*\n\n*_total result_*:-{}\n", n=1;
    ioo.map(async (a) => {
        let [rr] = await conn.onWhatsApp(a).catch((e)=>console.log(e))
        if (!rr) bcs += "```wa.me/"+a+"```\n";
    });
    await sleep(2000)
    bcs = bcs.replace("{}", (bcs.split('\n').length -3).toString());
    await sleep(100);
    return await m.editMessage(m.jid,bcs, key)
});
