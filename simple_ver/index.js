'use strict'
// const functions = require('firebase-functions');

// モジュールの読み込み
const fetch = require('isomorphic-fetch')
const fs = require('fs');
const ini = require('ini');
const express = require('express')
const app = express()


let config = ini.parse(fs.readFileSync('./config.ini', 'utf-8'));
const url = config.url
let device_url = config.device_url
const auth = config.auth
const air_con = config.air_conID

const headers = {'Authorization': auth, 'Content-Type': 'application/json; charset=utf8'}
const data = {
    "command": "setAll",
    "parameter": "23,5,1,on",
    "commandType": 'command'
}

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
app.use(express.static('public'))


let server = app.listen(3000, ()=>{
    console.log("Server starts. . .")
    }
)
app.get('/test',(req, res)=>{
    // Clientが/testにGETを送ると、Test_Buttonメソッドが動いて、POSTをスイッチボットに送って動かすテストよう
    Test_Button();
})

app.get('/setting_temp',(req, res)=>{
    let dat_split = data.parameter.split(",")
    let set_temp = dat_split[0]
    let set_status = dat_split[3]
    let reply = {
        temp: set_temp,
        status: set_status
    }
    res.send(reply);
})

// app.get("/set_temp/:set_temp", (req, res)=>{
//     let input_temp = req.params.set_temp
//     let dat_split = data.parameter.split(",")
//     dat_split[0] = input_temp
//     let new_param = dat_split.join(',')
//     data.parameter = new_param
//     console.log(data)
//     post_SwitchBot(air_con, data)
// })

app.get("/set_temp/:set_temp", (req, res)=>{
    // let data = readJSONFile()
    let input_temp = req.params.set_temp
    let dat_split = data.parameter.split(",")
    dat_split[0] = input_temp
    let new_param = dat_split.join(',')
    data.parameter = new_param
    console.log(data)
    post_SwitchBot(air_con, data)
    // let data_str = JSON.stringify(data)
    // fs.writeFileSync("conditioner.json",(err)=>{
    //     console.log("Added")
    // })
})