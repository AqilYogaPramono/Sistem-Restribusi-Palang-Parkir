const connection = require('../config/db')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

class petugasModel {
    static async register(username, password) {
        return new Promise (async (resolve, reject) => {
            try {
                const hashedPassword = await bcrypt.hash(password, 10)
                connection.query('insert into petugas (username, password) values (?, ?)',[username, hashedPassword], (err, result) => {
                    if (err) {
                        reject(err)
                    } else {
                        resolve(result)
                    }
                })
            } catch (error) {
                reject(error)
            }
        })
    }

    static async getByUsername(username) {
        return new Promise ((resolve, reject) => {
            connection.query('select * from petugas where username = ?',[username], (err, rows) => {
                if (err) {
                    reject(err)
                } else {
                    resolve(rows[0])
                }
            })
        })
    }
}

module.exports = petugasModel