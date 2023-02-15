const axios = require("axios");
let moduleRoute=async(req,res,ObjectId,db,moment,transporter,hashIt,axios,qs)=>{
    try {
        // { $set: { [`${columnName}`] : req.body.newData } };
        moment.locale('fr')
        const userExist = await new Promise(function (resolve, reject) {
            db.collection('users').find({
                "_id": ObjectId(req.body.login),
            }).toArray((err, user) => {
                if (err) {
                    return resolve(false)
                }
                if (user.length > 0) {
                    return resolve(user)
                }
                if (user.length == 0) {
                    return resolve(false)
                }
            })
        });
        if (!userExist) {
            res.json({
                error: "incorrect password or login"
            })
        }
        if (userExist) {
            const passwordMatch = await hashIt(req.body.password) == userExist[0].password
            if (passwordMatch) {
                const token = jwt.sign({
                    id: userExist[0]._id,
                })
                res.json({
                    token: token,
                })
            }
            if (!passwordMatch) {
                res.json({
                    error: "incorrect password or login"
                })
            }
        }

    } catch (e) {
        console.log(e)
    }
}

exports.moduleRoute=moduleRoute