var app = angular.module('myApp', []);

app.factory('socket', function ($rootScope) {
  var socket = io.connect();
  return {
    on: function (eventName, callback) {
      socket.on(eventName, function () {  
        var args = arguments;
        $rootScope.$apply(function () {
          callback.apply(socket, args);
        });
      });
    },
    emit: function (eventName, data, callback) {
      socket.emit(eventName, data, function () {
        var args = arguments;
        $rootScope.$apply(function () {
          if (callback) {
            callback.apply(socket, args);
          }
        });
      })
    },
      removeAllListeners: function (eventName, callback) {
          socket.removeAllListeners(eventName, function() {
              var args = arguments;
              $rootScope.$apply(function () {
                callback.apply(socket, args);
              });
          }); 
      }
  };
});

// Before separation into branches/pages 
app.controller('data_get', function($scope, $http, socket, $window){
    // This variable changes the display between clock and alert. 
    var x;
    $scope.vers = '0';
    $scope.countDown = "0";
    $scope.imageList = [];
    $scope.centList = [];
    $scope.wrList = [];
    $scope.keyList = [];
    $scope.southList = [];
    $scope.TayList = [];
    $scope.ucentList = [];
    $scope.uwrList = [];
    $scope.ukeyList = [];
    $scope.usouthList = [];
    $scope.uTayList = [];
    $scope.sa = false;
    
    $scope.save = function(branch) {
        var a;
        switch (branch) {
            case "Central":
                a = {branch: branch, data: $scope.ucentList}
                break;
            case "WR":
                a = {branch: branch, data: $scope.uwrList}
                break;
            case "Keystone":
                a = {branch: branch, data: $scope.ukeyList}
                break;
            case "South":
                a = {branch: branch, data: $scope.usouthList}
                break;
            case "Taylor":
                a = {branch: branch, data: $scope.uTayList}
                break;
        }
        socket.emit('save', a)
    }
    
    $scope.sHide = function(tf, branch, id) {
        console.log("Show?: "+ tf);
        var ob = {type:"show", sh:tf, id: id, branch: branch};
        socket.emit('sh', ob);
        return tf;
    }
    
    var checkSH = function(cArr, cOb){
        var index = cArr.findIndex((e) => e.id === cOb.id);
        console.log(index);
        if (index === -1) {
            cArr.push(cOb);
        } else {
            cArr[index] = cOb;
        }
    }
    
    $scope.reload = function(){
        socket.emit('send_Reload');
    }
    
    socket.on('banners', function(data){
        $scope.centList = data;
        console.log('banners');
        console.log(data);
    });
    
    socket.on('centList', function(data){
        $scope.centList = data;
        console.log('banners');
        console.log(data);
    });
    
    socket.on('wrList', function(data){
        $scope.wrList = data;
    });
    
    socket.on('keyList', function(data){
        $scope.keyList = data;
    });
    
    socket.on('southList', function(data){
        $scope.southList = data;
    });
    
    socket.on('TayList', function(data){
        $scope.TayList = data;
    });
    
    // This sends the server request to update the display to be an alert or to revert. 
    $scope.change = function(ale){
        socket.emit('send_Alert', ale);
        console.log("Sending");
    };
    
    socket.on('reload', function(){
        console.log("reloading");
        $window.location.reload();
    });
    
    // When something has been changed on the server, this will update the page to reflect it.  
    socket.on('refresh', function(a){
        clearInterval(x);
        console.log(a);
        $scope.vers = a;        
        $scope.countDown = "Library will be closing soon";
        if(a == "C"){
            var curTime = new Date().getTime();
            var countDownDate = new Date(curTime + 15*60000);
            console.log(countDownDate);

            // Update the count down every 1 second
            x = setInterval(function() {

                // Get today's date and time
                var now = new Date().getTime();

                // Find the distance between now and the count down date
                var distance = countDownDate - now;

                // Time calculations for days, hours, minutes and seconds
                var days = Math.floor(distance / (1000 * 60 * 60 * 24));
                var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
                var seconds = Math.floor((distance % (1000 * 60)) / 1000);

                // Output the result in an element with id="demo"
                $scope.countDown = "Closing in: "+ minutes + "m " + seconds + "s ";
                console.log($scope.countDown);
                  // If the count down is over, write some text 
                  if (distance < 0) {
                    clearInterval(x);
                    $scope.countDown = "We are now closed";
                  }
                $scope.$apply()
            }, 1000);
        }
    });
    
    $scope.imageChoose = function (data, branch) {
        var id = data.id.split("_");
        console.log(id);
        id = id[1] - 1;
        console.log(id);
        var elem = document.getElementById(data.id);
        if (typeof (FileReader) != "undefined") {
            var reader = new FileReader();
            reader.onload = function (e) {
                $scope.$apply(function() {
                    switch (branch) {
                        case "Central":
                            $scope.centList[id].image = e.target.result;
                            break;
                        case "WR":
                            $scope.wrList[id].image = e.target.result;
                            break;
                        case "Keystone":
                            $scope.keyList[id].image = e.target.result;
                            break;
                        case "South":
                            $scope.southList[id].image = e.target.result;
                            break;
                        case "Taylor":
                            $scope.TayList[id].image = e.target.result;
                            break;
                    }
                    console.log(data);
                    socket.emit('upload', { branch: branch, id: id, img: e.target.result });
                });
            };
            reader.readAsDataURL(elem.files[0]);
        } else {
            alert("This browser does not support FileReader. Please use either Chrome or Firefox.");
        }
    };
})

app.controller('data_Alert', function($scope, $http, socket, $window){
    
    $scope.reload = function(){
        socket.emit('send_Reload');
    }
    
    // This sends the server request to update the display to be an alert or to revert. 
    $scope.change = function(ale){
        socket.emit('send_Alert', ale);
        console.log("Sending");
    };
})

app.controller('data_CentAlert', function($scope, $http, socket, $window){
    
    $scope.reload = function(){
        socket.emit('Cent_Reload');
    }
    
    // This sends the server request to update the display to be an alert or to revert. 
    $scope.change = function(ale){
        socket.emit('Cent_Alert', ale);
        console.log("Sending");
    };
})

app.controller('data_WRAlert', function($scope, $http, socket, $window){
    
    $scope.reload = function(){
        socket.emit('WR_Reload');
    }
    
    // This sends the server request to update the display to be an alert or to revert. 
    $scope.change = function(ale){
        socket.emit('WR_Alert', ale);
        console.log("Sending");
    };
})

app.controller('data_KeyAlert', function($scope, $http, socket, $window){
    
    $scope.reload = function(){
        socket.emit('Key_Reload');
    }
    
    // This sends the server request to update the display to be an alert or to revert. 
    $scope.change = function(ale){
        socket.emit('Key_Alert', ale);
        console.log("Sending");
    };
})

app.controller('data_SouthAlert', function($scope, $http, socket, $window){
    
    $scope.reload = function(){
        socket.emit('South_Reload');
    }
    
    // This sends the server request to update the display to be an alert or to revert. 
    $scope.change = function(ale){
        socket.emit('South_Alert', ale);
        console.log("Sending");
    };
})

app.controller('data_TayAlert', function($scope, $http, socket, $window){
    
    $scope.reload = function(){
        socket.emit('Tay_Reload');
    }
    
    // This sends the server request to update the display to be an alert or to revert. 
    $scope.change = function(ale){
        socket.emit('Tay_Alert', ale);
        console.log("Sending");
    };
})

app.controller('data_Console', function($scope, $http, socket, $window){
    // This variable changes the display between clock and alert. 
    var x;
    $scope.vers = '0';
    $scope.countDown = "0";
    /*$scope.imageList = [];*/
    $scope.centList = [];
    $scope.wrList = [];
    $scope.keyList = [];
    $scope.southList = [];
    $scope.TayList = [];
    $scope.ucentList = [];
    $scope.uwrList = [];
    $scope.ukeyList = [];
    $scope.usouthList = [];
    $scope.uTayList = [];
    
    $scope.sHide = function(tf, branch, id) {
        console.log("Show?: "+ tf+ ", Branch: "+ branch +", Id: "+ id);
        var ob = {type:"show", sh:tf, id: id, branch: branch};
        socket.emit('sh', ob);
        return tf;
    }
    
    var checkSH = function(cArr, cOb){
        var index = cArr.findIndex((e) => e.id === cOb.id);
        console.log(index);
        if (index === -1) {
            cArr.push(cOb);
        } else {
            cArr[index] = cOb;
        }
    }
    
    socket.on('centList', function(data){
        $scope.centList = data;
        console.log('banners');
        console.log(data);
    });
    
    socket.on('wrList', function(data){
        $scope.wrList = data;
    });
    
    socket.on('keyList', function(data){
        $scope.keyList = data;
    });
    
    socket.on('southList', function(data){
        $scope.southList = data;
    });
    
    socket.on('TayList', function(data){
        $scope.TayList = data;
    });
    
    $scope.imageChoose = function (data, branch) {
        var id = data.id.split("_");
        console.log(id);
        id = id[1] - 1;
        console.log(id);
        var elem = document.getElementById(data.id);
        if (typeof (FileReader) != "undefined") {
            var reader = new FileReader();
            reader.onload = function (e) {
                $scope.$apply(function() {
                    switch (branch) {
                        case "Central":
                            $scope.centList[id].image = e.target.result;
                            break;
                        case "WR":
                            $scope.wrList[id].image = e.target.result;
                            break;
                        case "Keystone":
                            $scope.keyList[id].image = e.target.result;
                            break;
                        case "South":
                            $scope.southList[id].image = e.target.result;
                            break;
                        case "Taylor":
                            $scope.TayList[id].image = e.target.result;
                            break;
                    }
                    console.log(data);
                    socket.emit('upload', { branch: branch, id: id, img: e.target.result });
                });
            };
            reader.readAsDataURL(elem.files[0]);
        } else {
            alert("This browser does not support FileReader. Please use either Chrome or Firefox.");
        }
    };
})

app.controller('data_Central', function($scope, $http, socket, $window){
    // This variable changes the display between clock and alert. 
    var x;
    $scope.vers = '0';
    $scope.countDown = "0";
    $scope.imgList = [];
    
    socket.on('centList', function(data){
        $scope.imgList = data;
        console.log('banners');
        console.log(data);
    });
    
    socket.on('CentReload', function(){
        console.log("reloading");
        $window.location.reload();
    });
    
    // When something has been changed on the server, this will update the page to reflect it.  
    socket.on('CentRefresh', function(a){
        clearInterval(x);
        console.log(a);
        $scope.vers = a;        
        $scope.countDown = "Library will be closing soon";
        if(a == "C"){
            var curTime = new Date().getTime();
            var countDownDate = new Date(curTime + 15*60000);
            console.log(countDownDate);

            // Update the count down every 1 second
            x = setInterval(function() {

                // Get today's date and time
                var now = new Date().getTime();

                // Find the distance between now and the count down date
                var distance = countDownDate - now;

                // Time calculations for days, hours, minutes and seconds
                var days = Math.floor(distance / (1000 * 60 * 60 * 24));
                var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
                var seconds = Math.floor((distance % (1000 * 60)) / 1000);

                // Output the result in an element with id="demo"
                $scope.countDown = "Closing in: "+ minutes + "m " + seconds + "s ";
                console.log($scope.countDown);
                  // If the count down is over, write some text 
                  if (distance < 0) {
                    clearInterval(x);
                    $scope.countDown = "We are now closed";
                  }
                $scope.$apply()
            }, 1000);
        }
    });
})

app.controller('data_Keystone', function($scope, $http, socket, $window){
    // This variable changes the display between clock and alert. 
    var x;
    $scope.vers = '0';
    $scope.countDown = "0";
    $scope.imgList = [];
    
    socket.on('keyList', function(data){
        $scope.imgList = data;
        console.log('banners');
        console.log(data);
    });
    
    socket.on('KeyReload', function(){
        console.log("reloading");
        $window.location.reload();
    });
    
    // When something has been changed on the server, this will update the page to reflect it.  
    socket.on('KeyRefresh', function(a){
        clearInterval(x);
        console.log(a);
        $scope.vers = a;        
        $scope.countDown = "Library will be closing soon";
        if(a == "C"){
            var curTime = new Date().getTime();
            var countDownDate = new Date(curTime + 15*60000);
            console.log(countDownDate);

            // Update the count down every 1 second
            x = setInterval(function() {

                // Get today's date and time
                var now = new Date().getTime();

                // Find the distance between now and the count down date
                var distance = countDownDate - now;

                // Time calculations for days, hours, minutes and seconds
                var days = Math.floor(distance / (1000 * 60 * 60 * 24));
                var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
                var seconds = Math.floor((distance % (1000 * 60)) / 1000);

                // Output the result in an element with id="demo"
                $scope.countDown = "Closing in: "+ minutes + "m " + seconds + "s ";
                console.log($scope.countDown);
                  // If the count down is over, write some text 
                  if (distance < 0) {
                    clearInterval(x);
                    $scope.countDown = "We are now closed";
                  }
                $scope.$apply()
            }, 1000);
        }
    });
})

app.controller('data_South', function($scope, $http, socket, $window){
    // This variable changes the display between clock and alert. 
    var x;
    $scope.vers = '0';
    $scope.countDown = "0";
    $scope.imgList = [];
    
    socket.on('southList', function(data){
        $scope.imgList = data;
        console.log('banners');
        console.log(data);
    });
    
    socket.on('SouthReload', function(){
        console.log("reloading");
        $window.location.reload();
    });
    
    // When something has been changed on the server, this will update the page to reflect it.  
    socket.on('SouthRefresh', function(a){
        clearInterval(x);
        console.log(a);
        $scope.vers = a;        
        $scope.countDown = "Library will be closing soon";
        if(a == "C"){
            var curTime = new Date().getTime();
            var countDownDate = new Date(curTime + 15*60000);
            console.log(countDownDate);

            // Update the count down every 1 second
            x = setInterval(function() {

                // Get today's date and time
                var now = new Date().getTime();

                // Find the distance between now and the count down date
                var distance = countDownDate - now;

                // Time calculations for days, hours, minutes and seconds
                var days = Math.floor(distance / (1000 * 60 * 60 * 24));
                var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
                var seconds = Math.floor((distance % (1000 * 60)) / 1000);

                // Output the result in an element with id="demo"
                $scope.countDown = "Closing in: "+ minutes + "m " + seconds + "s ";
                console.log($scope.countDown);
                  // If the count down is over, write some text 
                  if (distance < 0) {
                    clearInterval(x);
                    $scope.countDown = "We are now closed";
                  }
                $scope.$apply()
            }, 1000);
        }
    });
})

app.controller('data_Taylor', function($scope, $http, socket, $window){
    // This variable changes the display between clock and alert. 
    var x;
    $scope.vers = '0';
    $scope.countDown = "0";
    $scope.imgList = [];
    
    socket.on('TayList', function(data){
        $scope.imgList = data;
        console.log('banners');
        console.log(data);
    });
    
    socket.on('TayReload', function(){
        console.log("reloading");
        $window.location.reload();
    });
    
    // When something has been changed on the server, this will update the page to reflect it.  
    socket.on('TayRefresh', function(a){
        clearInterval(x);
        console.log(a);
        $scope.vers = a;        
        $scope.countDown = "Library will be closing soon";
        if(a == "C"){
            var curTime = new Date().getTime();
            var countDownDate = new Date(curTime + 15*60000);
            console.log(countDownDate);

            // Update the count down every 1 second
            x = setInterval(function() {

                // Get today's date and time
                var now = new Date().getTime();

                // Find the distance between now and the count down date
                var distance = countDownDate - now;

                // Time calculations for days, hours, minutes and seconds
                var days = Math.floor(distance / (1000 * 60 * 60 * 24));
                var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
                var seconds = Math.floor((distance % (1000 * 60)) / 1000);

                // Output the result in an element with id="demo"
                $scope.countDown = "Closing in: "+ minutes + "m " + seconds + "s ";
                console.log($scope.countDown);
                  // If the count down is over, write some text 
                  if (distance < 0) {
                    clearInterval(x);
                    $scope.countDown = "We are now closed";
                  }
                $scope.$apply()
            }, 1000);
        }
    });
})

app.controller('data_WR', function($scope, $http, socket, $window){
    // This variable changes the display between clock and alert. 
    var x;
    $scope.vers = '0';
    $scope.countDown = "0";
    $scope.imgList = [];
    
    socket.on('WRList', function(data){
        $scope.imgList = data;
        console.log('banners');
        console.log(data);
    });
    
    socket.on('WRReload', function(){
        console.log("reloading");
        $window.location.reload();
    });
    
    // When something has been changed on the server, this will update the page to reflect it.  
    socket.on('WRRefresh', function(a){
        clearInterval(x);
        console.log(a);
        $scope.vers = a;        
        $scope.countDown = "Library will be closing soon";
        if(a == "C"){
            var curTime = new Date().getTime();
            var countDownDate = new Date(curTime + 15*60000);
            console.log(countDownDate);

            // Update the count down every 1 second
            x = setInterval(function() {

                // Get today's date and time
                var now = new Date().getTime();

                // Find the distance between now and the count down date
                var distance = countDownDate - now;

                // Time calculations for days, hours, minutes and seconds
                var days = Math.floor(distance / (1000 * 60 * 60 * 24));
                var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
                var seconds = Math.floor((distance % (1000 * 60)) / 1000);

                // Output the result in an element with id="demo"
                $scope.countDown = "Closing in: "+ minutes + "m " + seconds + "s ";
                console.log($scope.countDown);
                  // If the count down is over, write some text 
                  if (distance < 0) {
                    clearInterval(x);
                    $scope.countDown = "We are now closed";
                  }
                $scope.$apply()
            }, 1000);
        }
    });
})