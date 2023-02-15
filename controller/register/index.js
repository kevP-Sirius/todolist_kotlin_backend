const axios = require("axios");
let moduleRoute=async(req,res,ObjectId,db,moment,transporter,hashIt,axios,qs)=>{
    try {
        res.header("Access-Control-Allow-Origin", "*");
        // res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
        let hassPassword = await hashIt(req.body.password);
        responsedb = {}
        let check = await bearerCheck(req, res)
        if(!check){
            return res.status(401).send('Unauthorized')
        }
        var re =  /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
        if(!req.body.email.match(re)){
            responsedb.status="301"
            responsedb.message = 'email incorrect'
            return res.json(responsedb)
        }
        if(req.body.login.length<6){
            responsedb.status="301"
            responsedb.message = 'username too short (at least 6 characters)'
            return res.json(responsedb)
        }
        if(req.body.password.length<6){
            responsedb.status="301"
            responsedb.message = 'password too short (at least 6 characters)'
            return res.json(responsedb)
        }
        db.collection('users').findOne(
            {
                'username':req.body.login
            },
            (err, result)=> {
                if (err) {
                    throw err;

                }
                if(result!==null){
                    responsedb.status="301"
                    responsedb.message = 'username or email already exist'
                    return res.json(responsedb)
                }
                db.collection('users').findOne(
                    {
                        'email':req.body.email
                    },
                    (err, result)=> {
                        if (err) {
                            throw err;
                        }
                        if(result!==null){
                            responsedb.status="301"
                            responsedb.message = 'username or email already exist'
                            return res.json(responsedb)
                        }
                        db.collection('users').insertOne( {
                            "username":req.body.login,
                            "email" : req.body.email ,
                            "role":'user' ,
                            "password" : hassPassword ,
                            "state":1,
                            "last_connexion":"",
                            "date_modification":""
                        },(err, user) => {
                            if (err) {
                                return console.log('Unable to fetch')
                            }
                            let token = jwt.sign({
                                username: req.body.login
                            }, process.env.SECRET, { expiresIn: '900h' })
                            const mailData = {
                                from: from,
                                to: req.body.email,
                                subject: 'Confirmation email',
                                text: `Account activated `,
                                html: `Welcome your account is activated and you can now login into the application`
                            };
                            transporter.sendMail(mailData, function (err, info) {
                                if(err)
                                    console.log(err)
                                else
                                    console.log(info);
                            });
                            //  <div>Please click on the following to confirm your email :
                            //             <a href='https://drawapp.kpognon.eu/api/confirmation/${token}'>Click Here</a>
                            //         </div>
                            let responsedb = {}
                            responsedb.status="201"
                            // responsedb.message = "compte crée , veuillez contactez un administrateur afin de l'activer"
                            responsedb.message = "account created , you've recieved a confirmation email "
                            return res.json(responsedb)

                        } );
                    })

            })



    } catch (e) {
        console.log(e)
    }
}

exports.moduleRoute=moduleRoute