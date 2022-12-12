let request = new XMLHttpRequest();

let FoundState = false

let GET_Req_Temp = ()=>{
    url = '/setting_temp'
    request.open("GET", url);
    request.onreadystatechange = ()=>{
        let res = request.responseText
        if(res){
            res_json = JSON.parse(res)
            let ar_text = document.getElementById("ar_text")
            if(res_json.status == "off"){
                ar_text.setAttribute("value", "OFF")

            }
            ar_text.setAttribute("value", res_json.temp)
        }
    }
    request.send();
}

let GET_Ret_SettingTemp= ()=>{
    temp_value = document.getElementById("set_temp").value
    url = "/set_temp/" + temp_value
    request.open("GET", url)
    request.onreadystatechange = () =>{
        console.log("Send!")
        temp_value = ""
    }
    request.send()
}

setInterval(GET_Req_Temp, 1000);
// ARの数字の取得はsetIntervalで1秒おきに取得するようにする


AFRAME.registerComponent('markerhandler', {
    init: function () {

    this.el.sceneEl.addEventListener('markerFound', () => {
        // redirect to custom URL e.g. google.com
        if(!FoundState){
            let new_input_text = document.createElement("input")
            let new_button = document.createElement("button")
            let button_text = document.createTextNode("Send")
            new_button.appendChild(button_text)
            new_input_text.setAttribute("type","text" )
            new_input_text.setAttribute("value","" )
            new_input_text.setAttribute("id","set_temp" )
            new_input_text.setAttribute("aria-label","setting temperature" )
            new_input_text.setAttribute("aria-describedby","button-addon2")
    
            new_button.setAttribute("class","btn btn-primary" )
            new_button.setAttribute("onClick","GET_Ret_SettingTemp()" )
            new_button.setAttribute("id","sending_test" )
    
            let div_input = document.getElementById("input_temp")
            div_input.insertBefore(new_input_text,div_input.firstChild)
            div_input.insertBefore(new_button, div_input.firstChild.nextSibling)
    
            console.log("FOUND!")
            FoundState=true
        }


    })
    }
});
