// Defines libraries needed 
var express = require('express');
var mysql = require('mysql');
var bodyParser = require('body-parser');
var app = express();
var server = require('http').createServer(app);
var io = require ('socket.io')(server);
var socket;
var fs = require('fs');

var todDate = "";
var banners = [
    {id: 1, image: "./assets/img/Central/1.png", show: "true"},
    {id: 2, image: "./assets/img/Central/2.png", show: "true"},
    {id: 3, image: "./assets/img/Central/3.png", show: "true"},
    {id: 4, image: "./assets/img/Central/4.png", show: "true"},
    {id: 5, image: "./assets/img/Central/5.png", show: "true"},
    {id: 6, image: "./assets/img/Central/6.png", show: "true"},
    {id: 7, image: "./assets/img/Central/7.png", show: "true"},
    {id: 8, image: "./assets/img/Central/8.png", show: "true"},
    {id: 9, image: "./assets/img/Central/9.jpg", show: "false"},
    {id: 10, image: "./assets/img/Central/10.jpg", show: "false"}
]

var bannersC = [
    {id: 1, image: "../assets/img/Central/1.png", show: "true"},
    {id: 2, image: "../assets/img/Central/2.png", show: "true"},
    {id: 3, image: "../assets/img/Central/3.png", show: "true"},
    {id: 4, image: "../assets/img/Central/4.png", show: "true"},
    {id: 5, image: "../assets/img/Central/5.png", show: "true"},
    {id: 6, image: "../assets/img/Central/6.png", show: "true"},
    {id: 7, image: "../assets/img/Central/7.png", show: "true"},
    {id: 8, image: "../assets/img/Central/8.png", show: "true"},
    {id: 9, image: "../assets/img/Central/9.jpg", show: "false"},
    {id: 10, image: "../assets/img/Central/10.jpg", show: "false"}
]

var bannersW = [
    {id: 1, image: "../assets/img/WR/1.png", show: "true"},
    {id: 2, image: "../assets/img/WR/2.png", show: "true"},
    {id: 3, image: "../assets/img/WR/3.png", show: "true"},
    {id: 4, image: "../assets/img/WR/4.png", show: "true"},
    {id: 5, image: "../assets/img/WR/5.png", show: "true"},
    {id: 6, image: "../assets/img/WR/6.png", show: "true"},
    {id: 7, image: "../assets/img/WR/7.png", show: "true"},
    {id: 8, image: "../assets/img/WR/8.png", show: "true"},
    {id: 9, image: "../assets/img/WR/9.jpg", show: "false"},
    {id: 10, image: "../assets/img/WR/10.jpg", show: "false"}
]

var bannersK = [
    {id: 1, image: "../assets/img/Keystone/1.png", show: "true"},
    {id: 2, image: "../assets/img/Keystone/2.png", show: "true"},
    {id: 3, image: "../assets/img/Keystone/3.png", show: "true"},
    {id: 4, image: "../assets/img/Keystone/4.png", show: "true"},
    {id: 5, image: "../assets/img/Keystone/5.png", show: "true"},
    {id: 6, image: "../assets/img/Keystone/6.png", show: "true"},
    {id: 7, image: "../assets/img/Keystone/7.png", show: "true"},
    {id: 8, image: "../assets/img/Keystone/8.png", show: "true"},
    {id: 9, image: "../assets/img/Keystone/9.jpg", show: "false"},
    {id: 10, image: "../assets/img/Keystone/10.jpg", show: "false"}
]

var bannersS = [
    {id: 1, image: "../assets/img/South/1.png", show: "true"},
    {id: 2, image: "../assets/img/South/2.png", show: "true"},
    {id: 3, image: "../assets/img/South/3.png", show: "true"},
    {id: 4, image: "../assets/img/South/4.png", show: "true"},
    {id: 5, image: "../assets/img/South/5.png", show: "true"},
    {id: 6, image: "../assets/img/South/6.png", show: "true"},
    {id: 7, image: "../assets/img/South/7.png", show: "true"},
    {id: 8, image: "../assets/img/South/8.png", show: "true"},
    {id: 9, image: "../assets/img/South/9.jpg", show: "false"},
    {id: 10, image: "../assets/img/South/10.jpg", show: "false"}
]

var bannersT = [
    {id: 1, image: "../assets/img/Taylor/1.png", show: "true"},
    {id: 2, image: "../assets/img/Taylor/2.png", show: "true"},
    {id: 3, image: "../assets/img/Taylor/3.png", show: "true"},
    {id: 4, image: "../assets/img/Taylor/4.png", show: "true"},
    {id: 5, image: "../assets/img/Taylor/5.png", show: "true"},
    {id: 6, image: "../assets/img/Taylor/6.png", show: "true"},
    {id: 7, image: "../assets/img/Taylor/7.png", show: "true"},
    {id: 8, image: "../assets/img/Taylor/8.png", show: "true"},
    {id: 9, image: "../assets/img/Taylor/9.jpg", show: "false"},
    {id: 10, image: "../assets/img/Taylor/10.jpg", show: "false"}
]

var timeCArr = [
    {id: 1, day: "Sunday", close: "Hours:15 Minutes:45 Seconds:0"},
    {id: 2, day: "Monday", close: "Hours:19 Minutes:45 Seconds:0"},
    {id: 3, day: "Tuesday", close: "Hours:19 Minutes:45 Seconds:0"},
    {id: 4, day: "Wednesday", close: "Hours:19 Minutes:45 Seconds:0"},
    {id: 5, day: "Thursday", close: "Hours:16 Minutes:45 Seconds:0"},
    {id: 6, day: "Friday", close: "Hours:16 Minutes:45 Seconds:0"},
    {id: 7, day: "Saturday", close: "Hours:16 Minutes:45 Seconds:0"}
];

var timeWArr = [
    {id: 1, day: "Sunday", close: "Hours:19 Minutes:45 Seconds:0"},
    {id: 2, day: "Monday", close: "Hours:19 Minutes:45 Seconds:0"},
    {id: 3, day: "Tuesday", close: "Hours:19 Minutes:45 Seconds:0"},
    {id: 4, day: "Wednesday", close: "Hours:19 Minutes:45 Seconds:0"},
    {id: 5, day: "Thursday", close: "Hours:19 Minutes:45 Seconds:0"},
    {id: 6, day: "Friday", close: "Hours:16 Minutes:45 Seconds:0"},
    {id: 7, day: "Saturday", close: "Hours:16 Minutes:45 Seconds:0"}
];

var timeKArr = [
    {id: 1, day: "Sunday", close: "Hours:19 Minutes:45 Seconds:0"},
    {id: 2, day: "Monday", close: "Hours:19 Minutes:45 Seconds:0"},
    {id: 3, day: "Tuesday", close: "Hours:19 Minutes:45 Seconds:0"},
    {id: 4, day: "Wednesday", close: "Hours:19 Minutes:45 Seconds:0"},
    {id: 5, day: "Thursday", close: "Hours:19 Minutes:45 Seconds:0"},
    {id: 6, day: "Friday", close: "Hours:16 Minutes:45 Seconds:0"},
    {id: 7, day: "Saturday", close: "Hours:16 Minutes:45 Seconds:0"}
];

var timeSArr = [
    {id: 1, day: "Sunday", close: "Hours:19 Minutes:45 Seconds:0"},
    {id: 2, day: "Monday", close: "Hours:19 Minutes:45 Seconds:0"},
    {id: 3, day: "Tuesday", close: "Hours:19 Minutes:45 Seconds:0"},
    {id: 4, day: "Wednesday", close: "Hours:19 Minutes:45 Seconds:0"},
    {id: 5, day: "Thursday", close: "Hours:19 Minutes:45 Seconds:0"},
    {id: 6, day: "Friday", close: "Hours:16 Minutes:45 Seconds:0"},
    {id: 7, day: "Saturday", close: "Hours:16 Minutes:45 Seconds:0"}
];

var timeTArr = [
    {id: 1, day: "Sunday", close: "Hours:19 Minutes:45 Seconds:0"},
    {id: 2, day: "Monday", close: "Hours:19 Minutes:45 Seconds:0"},
    {id: 3, day: "Tuesday", close: "Hours:19 Minutes:45 Seconds:0"},
    {id: 4, day: "Wednesday", close: "Hours:19 Minutes:45 Seconds:0"},
    {id: 5, day: "Thursday", close: "Hours:19 Minutes:45 Seconds:0"},
    {id: 6, day: "Friday", close: "Hours:16 Minutes:45 Seconds:0"},
    {id: 7, day: "Saturday", close: "Hours:16 Minutes:45 Seconds:0"}
];

var timeC = "Hours:19 Minutes:45 Seconds:0";
var timeW = "Hours:19 Minutes:45 Seconds:0";
var timeK = "Hours:19 Minutes:45 Seconds:0";
var timeS = "Hours:19 Minutes:45 Seconds:0";
var timeT = "Hours:19 Minutes:45 Seconds:0";

//Links mySQL database to the Node server
/*var db = mysql.createPool({
    host: 'localhost', 
    user: 'root', 
    password: 'pass', 
    database: 'rentingspecialcollections'
    //port: 3000;
});*/

//This connects to the service that sends and returns live data
io.on('connection', function(socket){
    //Lets the admin know when a user is connected. Only states when a connection is made to the login/landing page.
    console.log('A user connected');    
    socket.emit('banners', banners);
    socket.emit('centList', bannersC);
    socket.emit('wrList', bannersW);
    socket.emit('keyList', bannersK);
    socket.emit('southList', bannersS);
    socket.emit('TayList', bannersT);
    
    socket.on('send_Alert', function(Item){
        console.log(Item);
        io.emit('refresh', Item);
    });
    
    socket.on('send_Reload', function(){
        //console.log(Item);
        io.emit('reload');
    });
    
    socket.on('Cent_Alert', function(Item){
        console.log(Item);
        io.emit('CentRefresh', Item);
    });
    
    socket.on('Cent_Reload', function(){
        //console.log(Item);
        io.emit('CentReload');
    });
    
    socket.on('WR_Alert', function(Item){
        console.log(Item);
        io.emit('WRRefresh', Item);
    });
    
    socket.on('WR_Reload', function(){
        //console.log(Item);
        io.emit('WRReload');
    });
    
    socket.on('Key_Alert', function(Item){
        console.log(Item);
        io.emit('KeyRefresh', Item);
    });
    
    socket.on('Key_Reload', function(){
        //console.log(Item);
        io.emit('KeyReload');
    });
    
    socket.on('South_Alert', function(Item){
        console.log(Item);
        io.emit('SouthRefresh', Item);
    });
    
    socket.on('South_Reload', function(){
        //console.log(Item);
        io.emit('SouthReload');
    });
    
    socket.on('Tay_Alert', function(Item){
        console.log(Item);
        io.emit('TayRefresh', Item);
    });
    
    socket.on('Tay_Reload', function(){
        //console.log(Item);
        io.emit('TayReload');
    });
    
    socket.on('upload', function(data){
        console.log(data);
        getBranch(data.branch, (res) => {
            console.log(res.upd);
            console.log(res.nam);
            var loc = res.upd[data.id].image.replace('../', 'files/')
            //console.log(loc);
            
            function decodeBase64Image(dataString) {
                var matches = dataString.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/),
                    response = {};
                if (matches.length !== 3) {
                    return new Error('Invalid input string');
                }

                response.type = matches[1];
                response.data = new Buffer(matches[2], 'base64');
                
                return response;
            }

            var imageBuffer = decodeBase64Image(data.img);
            fs.writeFile(loc, imageBuffer.data, function(err) {
                if(err){
                    console.log("failed to write image");
                }else{
                    //callback("true"); 
                    console.log("succesfully wrote image");
                }
            });
        });
        //io.emit('reload');
    });
    
    socket.on('sh', function(data){
        console.log("SH "+data);
        getBranch(data.branch, (res) => {
            console.log(res);
            var index = res.upd.findIndex((e) => e.id === data.id);
            console.log("Index "+index);
            res.upd[index].show = data.sh;
            console.log("Res.upd "+res.upd);
            io.emit(res.nam, res.upd);
            
            //console.log("bannersC "+JSON.stringify(bannersC))
            //console.log("bannersW "+JSON.stringify(bannersW))
            var wrt = [
                {id: 0, name: "banners", data: banners},
                {id: 1, name: "bannersC", data: bannersC, time: timeC},
                {id: 2, name: "bannersW", data: bannersW, time: timeW}, 
                {id: 3, name: "bannersK", data: bannersK, time: timeK},
                {id: 4, name: "bannersS", data: bannersS, time: timeS},
                {id: 5, name: "bannersT", data: bannersT, time: timeT}
            ]
            
            //console.log("wrt "+ JSON.stringify(wrt));

            fs.writeFile(__dirname + '/files/buildings.json', JSON.stringify(wrt), function(err) {
                if(err){
                    console.log("failed to write file");
                }else{
                    //callback("true"); 
                    console.log("succesfully wrote file");
                }
            });
        });
        //upd[index] = cOb;
       /* if (index === -1) {
            cArr.push(cOb);
        } else {
            cArr[index] = cOb;
        }*/
        //io.emit('reload');
    });
    
    socket.on('save', function(data){
        console.log(data);
        //io.emit('reload');
    });
    
    socket.on('page_Access', function(page){
        console.log("Computer joined a new location: "+page.location);
        socket.join(page.location);
        io.emit('banners', banners);
        //socketName = page.pUser;
    });
    
    //disconnects link to server to prevent too many connections to the server
    socket.on('disconnect', function() {
     //Code inserted in here will run on user disconnect. 
     console.log('A user has disconnected');
        socket.disconnect();
    });
});

//used to start and run the server
server.listen(3012, function(){
    console.log("listening on *:3012");
    fs.readFile(__dirname + '/files/buildings.json', 'utf8', function(err, contents) {
        //console.log(JSON.parse(contents));
        console.log(err);
        var con = JSON.parse(contents); 
        banners = con[0].data;
        bannersC = con[1].data;
        bannersW = con[2].data;
        bannersK = con[3].data;
        bannersS = con[4].data;
        bannersT = con[5].data;
        /*console.log(banners)*/
        console.log(bannersC)
        console.log(bannersW)
        /*console.log(bannersK)
        console.log(bannersS)
        console.log(bannersT)*/
    });
    loadData((res) => {
        setData(res, (dat) =>{
            console.log("Recieved Dat "+dat);
        });
    })
    
    getDay();
    
    var dayinterval = setInterval(function(str1, str2) {
        getDay();
    }, 1000*60*60)
    
    var interval = setInterval(function(str1, str2) {
        var curTime = new Date();
        // current hours
        var hours = curTime.getHours();
        // current minutes
        var minutes = curTime.getMinutes();
        
        var seconds = curTime.getSeconds();
        //console.log("Hours:"+hours + " Minutes:"+minutes);
        var theTime = "Hours:"+hours + " Minutes:"+minutes + " Seconds:"+seconds;
        //console.log(theTime);
        if(theTime == timeC){
            io.emit('CentRefresh', "C");
            console.log("CentRefresh has been refreshed");
        }
        if(theTime == timeW){
            io.emit('WRRefresh', "c");
            console.log("WRRefresh has been refreshed");
        }
        if(theTime == timeK){
            io.emit('KeyRefresh', "c");
            console.log("KeyRefresh has been refreshed");
        }
        if(theTime == timeS){
            io.emit('SouthRefresh', "c");
            console.log("SouthRefresh has been refreshed");
        }
        if(theTime == timeT){
            io.emit('TayRefresh', "c");
            console.log("TayRefresh has been refreshed");
        }
        
        if(theTime == "Hours:13 Minutes:05 Seconds:0"){
            io.emit('reload');
            console.log("Reload");
        }
    }, 1000);
});

app.use(express.static('files'));
app.use(bodyParser.urlencoded({ extended: false}));
app.use(bodyParser.json());

//In this version of app.get, the '/' sets the home page when you access the URL/link. 
app.get('/', function(req, res){
    res.sendFile(__dirname + '/index.html');
});

var loadData = function(callback){
    callback("success");
}

var setData = function(data, callback){
    console.log(data);
    callback("Successfully set data to "+data);
}

var getBranch = function(data, callback){
    console.log("getBranch "+ JSON.stringify(data));
    switch (data) {
            case "Central":
                var upd = bannersC;
                var nam = 'centList';
                break;
            case "WR":
                var upd = bannersW;
                var nam = 'wrList';
                break;
            case "Keystone":
                var upd = bannersK;
                var nam = 'keyList';
                break;
            case "South":
                var upd = bannersS;
                var nam = 'southList';
                break;
            case "Taylor":
                var upd = bannersT;
                var nam = 'TayList';
                break;
        }
    callback({upd: upd, nam: nam});
    
}

var getDay = function(){
    var d = new Date();
    var weekday = new Array(7);
    weekday[0] = "Sunday";
    weekday[1] = "Monday";
    weekday[2] = "Tuesday";
    weekday[3] = "Wednesday";
    weekday[4] = "Thursday";
    weekday[5] = "Friday";
    weekday[6] = "Saturday";

    var n = weekday[d.getDay()];
    console.log(n);
    todDate = n;
    timeC = timeFilt(timeCArr);
    timeW = timeFilt(timeWArr);
    timeK = timeFilt(timeKArr);
    timeS = timeFilt(timeSArr);
    timeT = timeFilt(timeTArr);
    
    /*console.log(todDate)
    console.log(timeC)
    console.log(timeW)
    console.log(timeK)
    console.log(timeS)
    console.log(timeT)*/
    
}
    
var timeFilt = function(arr) {
    var resp = arr.filter(function(item) {
        return item.day == todDate;
    });
    
    return resp[0].close;
}