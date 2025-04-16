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
}

module.exports = kendaraanModel