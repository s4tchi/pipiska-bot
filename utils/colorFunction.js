

function f(b) {
    return (x) => {
        const y = Math.floor(-((x - b) * (x - b)) / 16 + 256);

        if (y > 255) return 255;
        if (y < 64) return 64;

        return y;
    }
}

function colorFunction(count) {
    const rc1 = f(0);
    const rc2 = f(192);

    const gc = f(64);
    const bc = f(128);

    const step = 180 / (count );

    const colorArr = [];

    for (let i = 0; i < count; i++) {
        const rHex1 = rc1((i) * step);
        const rHex2 = rc2((i) * step);
        const gHex = gc((i) * step);
        const bHex = bc((i) * step);

        const rColor = (rHex1 > rHex2 ? rHex1 : rHex2).toString(16);
        const gColor = gHex.toString(16);
        const bColor = bHex.toString(16);

        colorArr.push(`#${rColor.length >= 2 ? rColor : `0${rColor}`}${gColor.length >= 2 ? gColor : `0${gColor}`}${bColor.length >= 2 ? bColor : `0${bColor}`}`);
    }

    return colorArr;
}

module.exports = colorFunction;