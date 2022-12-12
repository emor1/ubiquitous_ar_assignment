const functions = require('firebase-functions');
const admin = require("firebase-admin")
// モジュールの読み込み
const fetch = require('isomorphic-fetch')
const fs = require('fs');
const ini = require('ini');
const express = require('express')
// const path = require('path');
// const app = express()



let config = ini.parse(fs.readFileSync('./config.ini', 'utf-8'));
const url = config.url
let device_url = config.device_url
const auth = config.auth
const air_con = config.air_conID
const store_ID = config.store_ID

const headers = {'Authorization': auth, 'Content-Type': 'application/json; charset=utf8'}

/*-------------------------------switchBot--------------------------------------------*/
let get_SwitchBot = ()=>{
    fetch(url, {
        method: 'GET',
        headers: headers
        }).then(
        (res)=>{
            if(res.status >= 400){
                throw new Error("Bad response from server");
            }
            return res.json()
        }).then(
            (res)=>{
                console.log(res.body)
            }
        )
}

let post_SwitchBot = (deviceID, data)=>{
    let post_url = url +'/'+ deviceID + '/commands'
    fetch(post_url,{
        method:'POST',
        headers:headers,
        body: JSON.stringify(data)
    })
}


/*-------------------------------Server--------------------------------------------*/

const app = express();
app.use(express.json())
admin.initializeApp()


const db = admin.firestore()


app.get('/setting_temp',async(req, res)=>{
    let data = await admin
    .firestore()
    .collection("air_setting")
    .doc(store_ID)
    .get()
    // .then(async (snapshot) => await snapshot.docs.map((v) => v.data()))

    let datas = data.data()
    let dat_split = datas.parameter.split(",")
    let set_temp = dat_split[0]
    let set_status = dat_split[3]
    let reply = {
        temp: set_temp,
        status: set_status
    }
    res.send(reply);
    // res.send(datas.parameter)

    // await db.app.d
})



app.get("/set_temp/:set_temp", async(req, res)=>{
    let data = await admin
    .firestore()
    .collection("air_setting")
    .doc(store_ID)
    .get()
    // .then(async (snapshot) => await snapshot.docs.map((v) => v.data()))

    let datas = data.data()
    let data_split = datas.parameter.split(",")
    let input_temp = req.params.set_temp
    data_split[0] = input_temp
    let new_param = data_split.join(',')
    let new_data ={
        "command": "setAll",
        "commandType": "command",
        "parameter":new_param
    }

    post_SwitchBot(air_con, new_data)
    // // let data_str = JSON.stringify(data)

    await admin
    .firestore()
    .collection("air_setting")
    .doc(store_ID)
    .update(new_data)

    res.send(new_data)
})

// 出力
const api = functions.https.onRequest(app);
module.exports = { api };