var express = require('express')
var router = express.Router()
var petugasModel = require('../model/petugasModel')

//register 
router.post('/register', async (req, res) => {
    const { username , password } = req.body
    let data = {username, password}
    if (!username) {
        return res.status(400).json({ message: 'username harus di isi'})
    } else if (!password) {
        return res.status(400).json({ message: 'Password harus di isi'})
    }

        if (password.length < 6) return res.status(400).json({ message: 'Password must be at least 6 characters.' })
        if (!/[A-Z]/.test(password)) return res.status(400).json({ message: 'Password must have at least one uppercase letter.' })
        if (!/[a-z]/.test(password)) return res.status(400).json({ message: 'Password must have at least one lowercase letter.' })
        if (!/\d/.test(password)) return res.status(400).json({ message: 'Password must have at least one number.' })

    try {
        const existingUser = await petugasModel.getByUsername(username)
        if (existingUser) {
            return res.status(400).json({ message: 'Username sudah digunakan'})
        }

        await petugasModel.register(username, password)
        res.status(201).json({ message: 'CREATED'})
    } catch (error) {
        res.status(500).json({ message: error.message})
    }
})

//login
router.post('/login', async (req, res) => {
    const { username, password} = req.body
    if (!username) {
        return res.status(400).json({ message: 'Username harus di isi'})
    } else if (!password) {
        return res.status(400).json({ message: 'Password harus di isi'})
    }

    try {
        const result = await petugasModel.login(username, password)
        res.json(result)
    } catch (error) {
        res.status(500).json({ message: error.message})
    }
})

module.exports = router
