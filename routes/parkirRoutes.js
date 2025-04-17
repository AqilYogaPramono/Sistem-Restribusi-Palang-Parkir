var express = require('express')
var router = express.Router()
var kendaraanModel = require('../model/kendaraanModel')
var verifyToken = require('../config/middleware/jwt')
var hitungBiayaParkir = require('../config/middleware/hitungBiayaParkir')
const NodeCache = require('node-cache')
const cache = new NodeCache({ stdTTL: 60})
const cacheMiddleware = require('../config/middleware/cacheMiddleware')
const { parkirQueue } = require('../config/middleware/queue')
const { encryptData, decryptData } = require('../config/middleware/crypto')

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

        const job = await parkirQueue.add({ action: 'store', data })
        await job.finished()

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
router.get('/parkir', cacheMiddleware, verifyToken, async (req, res, next) => {
    try {
        let rows = await kendaraanModel.getAllParkirIAll()
        return res.status(200).json({rows})
    } catch (error) {
        res.status(500).json({message: error.message})
    }
})

//get parkir in  (jwt, cache) 
router.get('/parkir/in', cacheMiddleware, verifyToken, async (req, res, next) => {
    try {
        let rows = await kendaraanModel.getParkirIn()
        return res.status(200).json({rows})
    } catch (error) {
        res.status(500).json({message: error.message})
    }
})

//get parkir out (jwt, cache) 
router.get('/parkir/out', cacheMiddleware, verifyToken, async (req, res, next) => {
    try {
        let rows = await kendaraanModel.getParkirOut()
        return res.status(200).json({rows})
    } catch (error) {
        res.status(500).json({message: error.message})
    }
})

//get total income (jwt, cache, enc) 
router.get('/laporan/income', cacheMiddleware, verifyToken, async (req, res, next) => {
    try {
        const cacheKey = 'total income'
        let cacheData = cache.get(cacheKey)
    
        if (cacheData) {
            return res.status(200).json({message: 'Using Cache', cacheData})
        }

        let rows = await kendaraanModel.getIncome()
        cache.set(cacheKey, rows, 60)
        return res.status(200).json({message: 'Non Cache', rows})
    } catch (error) {
        res.status(500).json({message: error.message})
    }
})

//get total income today (jwt, enc) 
router.get('/laporan/total-income/today', verifyToken, async (req, res, next) => {
    try {
        let rows = await kendaraanModel.getIncomeToday()
        
        // Enkripsi data
        const encrypted = encryptData(rows)
        console.log('Encrypted Data:', encrypted)

        // Dekripsi data
        const decrypted = decryptData(encrypted)
        console.log('Decrypted Data:', decrypted)

        return res.status(200).json({
            encryptedData: encrypted,
            decryptedData: decrypted
        })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})


//get total income this mouth (jwt, cache, enc) 
router.get('/laporan/total-income/month', cacheMiddleware, verifyToken, async (req, res, next) => {
    try {
        let rows = await kendaraanModel.getIncomeThisMounth()
        return res.status(200).json({rows})
    } catch (error) {
        res.status(500).json({message: error.message})
    }
})

module.exports = router