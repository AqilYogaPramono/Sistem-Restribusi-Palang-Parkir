var express = require('express')
var router = express.Router()
var kendaraanModel = require('../model/kendaraanModel')
var verifyToken = require('../config/middleware/jwt')
var hitungBiayaParkir = require('../config/middleware/hitungBiayaParkir')

//parkir in (queue) 
router.post('/parkir_in', verifyToken, async (req, res, next) => {
    let { nomerPolosi } = req.body
    let petugasId = req.user.id

    if (!nomerPolosi) return res.status(400).json({ message: 'nomerPolosi required' })

    try {
        let nomerPolosiBersih = nomerPolosi.replace(/\s+/g, '')
        let now = new Date()
        let jamMasuk = now.toTimeString().slice(0,8).replace(/:/g, '')
        let nomerParkir = nomerPolosiBersih + jamMasuk

        let data = [ nomerPolosi, nomerParkir, petugasId ]

        await kendaraanModel.parkirIn(data)
        res.status(201).json({message: 'CREATED'})
    } catch (error) {
        res.status(500).json({ message: error.message})
    }
})

//parkir out (queue) {otomatis}
router.patch('/parkir_out/:id', verifyToken, async (req, res, next) =>  {
    let id = req.params.id

    if (!id) return res.status(400).json({ message: 'id kendaraan required' })

    try {
        const jamMasukRow = await kendaraanModel.getJamMasuk(id)
        if (!jamMasukRow) return res.status(400).json({ message: 'Kendaraan tidak ditemuakn' })

        const JamMasuk = jamMasukRow.jam_masuk
        let now = new Date();
        let jamKeluar = now.toTimeString().split(' ')[0]

        let totalBiaya = hitungBiayaParkir(JamMasuk, jamKeluar)

        let data = [jamKeluar, totalBiaya, id]

        await kendaraanModel.parkirOut(data)

        res.status(200).json({message: 'ok'})
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})

//parkir out (queue) {manual}
// router.patch('/parkir_out/:id', verifyToken, async (req, res, next) =>  {
//     let id = req.params.id
//     let { jamKeluar} = req.body

//     if (!id) return res.status(400).json({ message: 'id kendaraan required' })

//     try {
//         const jamMasukRow = await kendaraanModel.getJamMasuk(id)
//         if (!jamMasukRow) return res.status(400).json({ message: 'Kendaraan tidak ditemuakn' })

//         const JamMasuk = jamMasukRow.jam_masuk

//         let totalBiaya = hitungBiayaParkir(JamMasuk, jamKeluar)

//         let data = [jamKeluar, totalBiaya, id]

//         await kendaraanModel.parkirOut(data)

//         res.status(200).json({message: 'ok'})
//     } catch (error) {
//         res.status(500).json({ message: error.message })
//     }
// })

//get all parkir in & out (jwt, cache) 
router.get('/parkir_id_out', verifyToken, async (req, res, next) => {
    try {
        let rows = await kendaraanModel.getAllParkirInAndOutetAll()
        return res.status(200).json({rows})
    } catch (error) {
        res.status(500).json({message: error.message})
    }
})

//get parkir in  (jwt, cache) 
//get parkir out (jwt, cache) 
//get total income (jwt, cache, enc) 
//get total income today (jwt, enc) 
//get total income this mouth (jwt, cache, enc) 

module.exports = router