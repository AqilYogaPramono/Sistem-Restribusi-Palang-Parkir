const connection = require('../config/db')

class kendaraanModel {
    static async parkirIn(data) {
        return new Promise((resolve, reject) => {
            connection.query(`INSERT INTO kendaraan (no_pol, no_parkir, jam_masuk, tanggal_parkir, petugas_id) VALUES (?, ?, CURRENT_TIME(), CURDATE(), ?)`, data, (err, result) => {
                    if (err) {
                        reject(err)
                    } else {
                        resolve(result)
                    }
                }
            )
        })
    }

    static async parkirOut(data) {
        return new Promise((resolve, reject) => {
            connection.query(`UPDATE kendaraan  SET jam_keluar = ?,  biaya = ?  WHERE id = ?`, data, (err, result) => {
                    if (err) {
                        reject(err)
                    } else {
                        resolve(result)
                    }
                }
            )
        })
    }

    static async getJamMasuk(data) {
        return new Promise ((resolve, reject) => {
            connection.query('SELECT jam_masuk FROM kendaraan WHERE id = ?',[data], (err, rows) => {
                if (err) {
                    reject(err)
                } else {
                    resolve(rows[0])
                }
            })
        })
    }

    static async getAllParkirIAll() {
        return new Promise((resolve, reject) => {
            connection.query(`select * from kendaraan`, (err, rows) => {
                    if (err) {
                        reject(err)
                    } else {
                        resolve(rows)
                    }
                }
            )
        })
    }

    static async getParkirIn() {
        return new Promise((resolve, reject) => {
            connection.query(`select * from kendaraan where jam_keluar is null`, (err, rows) => {
                    if (err) {
                        reject(err)
                    } else {
                        resolve(rows)
                    }
                }
            )
        })
    }

    static async getParkirOut() {
        return new Promise((resolve, reject) => {
            connection.query(`select * from kendaraan where jam_keluar is not null`, (err, rows) => {
                    if (err) {
                        reject(err)
                    } else {
                        resolve(rows)
                    }
                }
            )
        })
    }

    static async getIncome() {
        return new Promise((resolve, reject) => {
            connection.query(`SELECT SUM(biaya) AS total_income from kendaraan where jam_keluar is not null`, (err, rows) => {
                    if (err) {
                        reject(err)
                    } else {
                        resolve(rows)
                    }
                }
            )
        })
    }

    static async getIncomeToday() {
        return new Promise((resolve, reject) => {
            connection.query(`select SUM(biaya) as total_income_today  from kendaraan WHERE jam_keluar is not null and tanggal_parkir = CURDATE()`, (err, rows) => {
                    if (err) {
                        reject(err)
                    } else {
                        resolve(rows)
                    }
                }
            )
        })
    }

    static async getIncomeThisMounth() {
        return new Promise((resolve, reject) => {
            connection.query(`select SUM(biaya) as total_income_this_month  FROM kendaraan WHERE jam_keluar is not NULL  and MONTH(tanggal_parkir) = MONTH(CURDATE()) and YEAR(tanggal_parkir) = YEAR(CURDATE()) `, (err, rows) => {
                    if (err) {
                        reject(err)
                    } else {
                        resolve(rows)
                    }
                }
            )
        })
    }
}

module.exports = kendaraanModel