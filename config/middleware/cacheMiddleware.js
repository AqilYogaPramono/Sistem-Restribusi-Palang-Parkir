const Redis = require('ioredis')
const redis = new Redis({ host: process.env.IP_WSL, port: process.env.PORT_WSL })

redis.ping((err, result) => {
    if (err) {
        console.error('Redis tidak terkoneksi:', err)
    } else {
        console.log('Redis terkoneksi:', result)
    }
})

const cacheMiddleware = async (req, res, next) => {
    const cacheKey = req.originalUrl
    const cachedData = await redis.get(cacheKey)
    
    if (cachedData) {
        console.log("Data diambil dari cache")
        return res.json(JSON.parse(cachedData))
    }
    
    res.sendResponse = res.json
    res.json = async (body) => {
        await redis.setex(cacheKey, 60, JSON.stringify(body))
        console.log(`Data untuk ${cacheKey} disimpan ke cache`)
        res.sendResponse(body)
    }
    
    next()
}

module.exports = cacheMiddleware