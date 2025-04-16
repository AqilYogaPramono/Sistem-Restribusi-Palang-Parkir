var express = require('express')
var router = express.Router()
var kendaraanModel = require('../model/kendaraanModel')
var verifyToken = require('../config/middleware/jwt')

//parkir in (queue) 
router.post('/parkir_in', verifyToken, async (req, res, next) => {
    let { nomerPolosi } = req.body
    let petugasId = req.user.id

    if (!nomerPolosi) return res.status(400).json({ message: 'nomerPolosi required' })

    try {
        const existingLicensePlate = await kendaraanModel.getLicensePlate(nomerPolosi)
        if (existingLicensePlate) return res.status(400).json({ message: 'Nomer Polosi Sudah Ada' })

        let nomerPolosiBersih = nomerPolosi.replace(/\s+/g, '')
        let now = new Date()
        let jamMasuk = now.toTimeString().slice(0,8).replace(/:/g, '')
        let nomerParkir = nomerPolosiBersih + jamMasuk

        let data = [ nomerPolosi, nomerParkir, petugasId ]

        await kendaraanModel.parkirIn(data)
        return res.status(200).json({message: 'ok'})
    } catch (error) {
        res.status(500).json({ message: error.message})
    }
})

//parkir out (queue)
//get all parkir in & out (jwt, cache) 
//get all parkir in & out (jwt, cache) 
//get parkir in  (jwt, cache) 
//get parkir out (jwt, cache) 
//get total income (jwt, cache, enc) 
//get total income today (jwt, cenc) 
//get total income thiis mouth (jwt, cache, enc) 

module.exports = router