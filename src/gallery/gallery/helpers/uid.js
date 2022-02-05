var IDX=256, HEX=[], SIZE=256, BUFFER;
while (IDX--) HEX[IDX] = (IDX + 256).toString(16).substring(1);

export default function (){
    var seed = Date.now();

    var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = (seed + Math.random() * 16) % 16 | 0;
        seed = Math.floor(seed/16);

        return (c === 'x' ? r : r & (0x3|0x8)).toString(16);
    });

    return uuid;
}