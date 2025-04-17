const kendaraanModel = require('../model/kendaraanModel')
const { parkirQueue } = require('../config/middleware/queue');

parkirQueue.process(async (job) => {
    const { action, data } = job.data
    console.log(`Memproses antrian parkir..., Action: ${action})`)

    if (action === 'store') {
        await kendaraanModel.parkirIn(data)
        return { message: 'parkir berhasil ditambahkan' };
    }

    if (action === 'update') {
        await kendaraanModel.parkirOut(data)
        return { message: `parkir berhasil diperbarui` };
    }
})

console.log("Worker berjalan dan siap memproses banyak antrian...");
