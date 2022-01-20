const fs = require('fs');
const http = require('http');

var requests = require('requests');

const homeFile = fs.readFileSync("home.html","utf-8");

const replaceVal = (tempVal,orgVal) =>{
    let temperature = tempVal.replace("{%tempval%}",orgVal.main.temp); 
     temperature = temperature.replace("{%tempmin%}",orgVal.main.temp_min); 
     temperature = temperature.replace("{%tempmax%}",orgVal.main.temp_max); 
     temperature = temperature.replace("{%location%}",orgVal.name); 
     temperature = temperature.replace("{%country%}",orgVal.sys.country); 
     temperature =  temperature.replace("{%tempstatus%}",orgVal.weather[0].main); 
     

     return temperature;
}

const server = http.createServer( (req,res) =>{
    requests("http://api.openweathermap.org/data/2.5/weather?q=Guna&units=metric&appid=e58a9682ab77beb2025c571d099ac629").on("data", (chuck) =>{
        const objData = JSON.parse(chuck); 
        const arrData = [objData]; 
   
       const realTimeData = arrData
       .map((val) => replaceVal(homeFile,val))
       .join("");
      res.write(realTimeData);
   
    })
    .on("end",(err)=>{
        if(err) return console.log("connection closed due to error",err);
        res.end();
    })
});

server.listen(8000,"127.0.0.1");
