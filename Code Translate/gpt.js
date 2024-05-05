// import * as bootstrap from 'bootstrap'

let colors = {
    "error": "text-bg-danger",
    "success": "text-bg-success"
}

// String formatting method
String.prototype.format = function() {
    let formatted = this;
    for (let i = 0; i < arguments.length; i++) {
        let regexp = new RegExp("\\{" + i + "\\}", "gi");
        formatted = formatted.replace(regexp, arguments[i]);
    }
    return formatted;
};

let system_behavior_prompt = `
You are an expert that translates code. You'll be given some code In [Format 1] And you always reply in [Format 2].[Format 2] must be in proper json format

Format 1:
{
"Code": [CODE],
"Language": [language that that code is in]
"To": [The language that the code is to translated to]
}

Format 2:
{
"Code": [Translated and Formatted Code] 
}`

let key;
let translateBox = document.getElementById("TranslateBox");

function setApiKey(){
    let apiInputBox = document.getElementById("apikey");
    key = apiInputBox.value;
    // apiInputBox.value = "";
    document.getElementById('alertContainer').children[1].children[0].style.display = "block";
    console.log(key);
}

function closeAlert(index){
    document.getElementById('alertContainer').children[index].children[0].style.display = "none";
}

function createAlert(Title, Message, color="text-bg-danger"){
    var alertElement = document.createElement('div');
    let index = 0;
    if(document.getElementById("alertContainer")){
        console.log("HEer")
        index = document.getElementById("alertContainer").children.length
    }
    alertElement.className = 'toast-container position-fixed bottom-0 end-0 p-3';
    alertElement.innerHTML = `
    <div id="liveToast" class="toast" role="alert" aria-live="assertive" aria-atomic="true">
      <div class="toast-header">
        <strong class="me-auto {2}">{0}</strong>
        <small></small>
        <button type="button" class="btn-close" onclick="closeAlert({3})" aria-label="Close"></button>
      </div>
      <div class="toast-body">
        {1}
      </div>
    </div>`.format(Title, Message, color, index);

    // Add the alert element to the container
    // if(document.getElementById('alertContainer').children.length === 0) {
    document.getElementById('alertContainer').appendChild(alertElement);
    // }
}

function gptConvert(){        
    let user_prompt;

    if(key){
        console.log("API KEY FOUND.")
    } else {
        console.log("API KEY NOT FOUND");
        return;
    }

    const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${key}`
    };

    if(document.getElementById("language").value && document.getElementById("Translate").value){
        user_prompt = "{" + 
        'Code:' + document.getElementById("Code").value + 
        ', Language: ' + document.getElementById("language").value +
        ', To: ' + document.getElementById("Translate").value + 
        "}";
    } else {
        console.log("Fill in the required Info");
        return;
    }

    console.log(user_prompt);
    const data = {
        model: 'gpt-3.5-turbo',
        messages: [
        {
            role: 'system',
            content: system_behavior_prompt
        },
        {
            role: 'user',
            content: user_prompt
        }
        ]
    };

    fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(data)
    })
        .then(response => response.json())
        .then(data => {
            console.log(data);
            if(data.error){
                if(data.error.code  === 'invalid_api_key'){
                    // if(document.getElementById('alertContainer').children[0].children[0].style.display === "none")
                        document.getElementById('alertContainer').children[0].children[0].style.display = "block";
                }
            } else {
                // console.log(data.choices[0].message.content)
                let translatedCode  = JSON.parse(data.choices[0].message.content).Code
                translateBox.value = translatedCode;
            }
        })
        .catch(error => console.error('Error:', error));
}

createAlert("SystemError!","Invalid API KEY. Please check your API key.", colors["error"]);
createAlert("Operation Success!", "Successfully Set API Key.", colors["success"]);