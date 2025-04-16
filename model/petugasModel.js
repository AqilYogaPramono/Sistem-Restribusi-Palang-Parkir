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

    static async login(username, password) {
        return new Promise((resolve, reject) => {
            const sql = 'SELECT * FROM petugas WHERE username = ?';
    
            connection.query(sql, [username], async (err, result) => {
                if (err) {
                    return reject({ status: 500, message: err.message, error: err });
                }
    
                if (result.length === 0) {
                    return reject({ status: 403, message: 'Username not found' });
                }
    
                const user = result[0];
                const isMatch = await bcrypt.compare(password, user.password);
    
                if (!isMatch) {
                    return reject({ status: 401, message: 'Password salah' });
                }
    
                const token = jwt.sign(
                    {
                        id: user.id,
                        username: user.username
                    },
                    process.env.JWT_SECRET,
                    { expiresIn: '1h' }
                );
    
                resolve({ token });
            });
        });
    }
}

module.exports = petugasModel