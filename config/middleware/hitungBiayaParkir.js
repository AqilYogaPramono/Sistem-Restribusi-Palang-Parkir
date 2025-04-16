function hitungBiayaParkir(jamMasukStr, jamKeluarStr) {
    const [jm, mm, ss] = jamMasukStr.split(':').map(Number);
    const [jk, mk, sk] = jamKeluarStr.split(':').map(Number);

    let masuk = new Date(0, 0, 0, jm, mm, ss);
    let keluar = new Date(0, 0, 0, jk, mk, sk);

    let diff = (keluar - masuk) / (1000 * 60 * 60); // jam
    if (diff < 0) diff += 24; // lewat tengah malam

    let totalJam = Math.ceil(diff);
    let biaya = 0;

    if (totalJam <= 1) {
        biaya = 2000;
    } else if (totalJam <= 4) {
        biaya = 2000 + (totalJam - 1) * 3000;
    } else if (totalJam <= 10) {
        biaya = 2000 + (3 * 3000) + (totalJam - 4) * 5000;
    } else if (totalJam <= 22) {
        biaya = 2000 + (3 * 3000) + (6 * 5000) + (totalJam - 10) * 10000;
    } else {
        biaya = 2000 + (3 * 3000) + (6 * 5000) + (12 * 10000); // max
    }

    return biaya;
}

module.exports = hitungBiayaParkir;
