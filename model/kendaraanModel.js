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

    static async getLicensePlate(nomerPolosi) {
        return new Promise ((resolve, reject) => {
            connection.query('select no_pol from kendaraan where no_pol = ?',[nomerPolosi], (err, rows) => {
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