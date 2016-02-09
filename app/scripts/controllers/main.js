'use strict';

angular.module('wrtsApp')
    //  .factory('Directions', [function(){
    //        var DirectionsRequest = {
    //            origin: patientAddress,
    //            destination: "26 Queen St
    //            Worcester, MA 01610",
    //            travelMode: google.maps.TravelMode.TRANSIT,
    //            transitOptions: {
    //                arrivalTime: appointmentTime
    //            },
    //            unitSystem: UnitSystem.IMPERIAL,
    //            provideRouteAlternatives: True,
    //        };//  }])
    .controller('MainCtrl', function ($scope, $timeout) {

        $scope.question1 = {};
        $scope.question1.value = true;
        $scope.question2 = {};
        $scope.question2.value = true;
        $scope.directView = true;
        $scope.outputView=false;
        $scope.selectedChoice = 0;
        $scope.choices = [{id: '1'}];
        $scope.ques1 = null;
        $scope.ques2 = null;

        $scope.q11 = function() {
            $scope.ques1='Yes'
        }
        $scope.q12 = function() {
            $scope.ques1='No'
        }
        $scope.q21 = function() {
            $scope.ques2='Yes'
        }
        $scope.q22 = function() {
            $scope.ques2='No'
        }
        $scope.addNewChoice = function() {

            var newItemNo = $scope.choices.length+1;
            $scope.choices.push({'id':/*choice'+*/newItemNo});

        };
        $scope.delNewChoice = function() {
            var delItem = $scope.choices.length -1;
            $scope.choices.splice(delItem);

        };

        $scope.showChoiceLabel = function (choice) {
            return choice.id === $scope.choices[0].id;
        }
        $scope.SubmitForm = function() {
            var StartingAddress = document.getElementById('patientAddress').value;
            var currentdate = new Date();
            var datetime = currentdate.getDate() + "/"
                + (currentdate.getMonth()+1)  + "/"
                + currentdate.getFullYear() + "  "
                + currentdate.getHours() + ":"
                + currentdate.getMinutes();

            window.location = 'https://script.google.com/a/macros/asu.edu/s/AKfycbxVwgNcVtkLUHhyDMJxKzX1Cm8kyV3WCnJ0sVSyi-SL/dev?Time='+datetime+'&Starting='+StartingAddress+"&Question1="+$scope.ques1+"&Question2="+$scope.ques2;
            alert("Response Submitted!")
            setTimeout(function() {
                window.location = 'https://fhcapp.firebaseapp.com/#/'
            },1000)




            /*xmlHttp.open('GET',url,false);
             var parameters =  //'Timestamp=' + Timestamp +
             'Starting='+ StartingAddress +
             '&Question1=' + 4 +
             '&Question2=' + 5;
             parameters = parameters.replace(/%20/g, '+');

             */

            $.ajax({
                url: url,
                type:"GET"
            })


        };

//    START OF GOOGLE MAPS API

        var directionsDisplay;
        var directionsService = new google.maps.DirectionsService();
        var map;

//    Methods that need to be called once view loads
        $scope.initialize = function () {
            directionsDisplay = new google.maps.DirectionsRenderer();
            directionsDisplay.setPanel(document.getElementById('directions-panel'));
            var Input = document.getElementsByClassName("GoogleAutoComplete");
            var GoogleAutoComplete = new google.maps.places.Autocomplete(Input[0]);
        }


        $scope.calcRoute = function(){
            //   $scope.summaryView = true;
            // $scope.view = true;
            //  $scope.outputView=false;
            var start = $scope.address;
            var end = "26 Queen St, Worcester, MA 01610";
            // var appointmentTime = new Date(2014, 10);
            //appointmentTime.setHours(13,30);
            //var appointmentDay = $scope.modelDay;
            //var appointmentHour = $scope.modelTime;

            var appointment = $scope.choices[0].name;
            var divide = appointment.split(" ");
            var myDate = divide[0];
            var myTime = divide[1];
            var chunks = myDate.split('-');

            var formattedDate = chunks[1]+'/'+chunks[0]+'/'+chunks[2]+ ' '+myTime;

//      Setting parameters of API Call
            var request = {
                origin: start,
                destination: end,
                travelMode: google.maps.TravelMode.TRANSIT,
                transitOptions: {
                    //  arrivalTime:  new Date(2015,8,1,16,0,0),

                    arrivalTime: new Date(formattedDate),


                },
                unitSystem: google.maps.UnitSystem.IMPERIAL,
                provideRouteAlternatives: true
            };

//      API Call
            directionsService.route(request, function(response, status) {
                if (status == google.maps.DirectionsStatus.OK) {
                    directionsDisplay.setDirections(response);
                    var day1 = new Date();
                    var day2 = new Date();
                    var walkTime = new Array();
                    var walkTime1 = new Array();
                    var waitTime = new Array();
                    var waitTime1 = new Array();
                    var timeUpdate= new Array();
                    var dump = new Date();
                    var len = response.routes.length;

                    for(var e=0;e<len;e++) {
                        walkTime[e] = 0;


                        var stepLength = response.routes[e].legs[0].steps.length;


                        if(stepLength ==1){

                            walkTime[e] = walkTime[e] + ((response.routes[e].legs[0].steps[0].duration.value)/60);
                            waitTime[e]=0;

                        }

                        //   waitTime[e]=0;






                        else {
                            waitTime[e]=0;
                            day1 = response.routes[e].legs[0].departure_time.value;
                            timeUpdate[e] =day1.getTime();

                            for (var y = 0; y < stepLength; y++) {
                                var ting = response.routes[e].legs[0].steps[y].instructions;
                                if (ting.indexOf('Walk') !== -1) {
                                    //  timeUpdate[e] = timeUpdate[e] + ((response.routes[e].legs[0].steps[y].duration.value) * 1000);
                                    walkTime[e] = walkTime[e] + (response.routes[e].legs[0].steps[y].duration.value) / 60;

                                }

                                else {


                                    dump = response.routes[e].legs[0].steps[y].transit.departure_time.value;
                                    waitTime[e] = waitTime[e] + (dump.getTime() - timeUpdate[e]);
                                    dump = response.routes[e].legs[0].steps[y].transit.arrival_time.value;
                                    timeUpdate[e] = dump.getTime();
                                }

                            }
                        }


                        walkTime1[e] = Math.round(walkTime[e]) +" "+ "mins";
                    }
                }
                else {
                    alert("Error: "+status)
                }


                for(e=0;e<len; e++){
                    if(waitTime[e] <0) waitTime[e] =0;
                    waitTime1[e] = Math.round(waitTime[e]/60000) +" "+ "mins";
                }



                var dist = document.getElementById("summary");

                document.getElementById("details").innerHTML ="";
                for(var t=0;t<len;t++) {
                    var str = "<b>Option no</b>"+":" +" "+ (t+1)+ "<br />" +"<b>Total Duration</b>"+":"+" " +(response.routes[t].legs[0].duration.text)+"<br />"+"<b>Total Waiting Time</b>"+":"+" " +(waitTime1[t])+ "<br />"+"<b>Total Walking Time</b>"+":"+" " +(walkTime1[t]);
                    str = str.toString();
                    document.getElementById("details").innerHTML = document.getElementById("details").innerHTML+ "<br />"+"<br/>"+ str ;



                }
            });
            google.maps.event.addDomListener(window, 'load', initialize);
        }

        $scope.calcCurrentRoute = function(){
            $scope.outputView=false;
            //  $scope.summaryView = true;
            var selected = $scope.selectedChoice.id - 1;
            var start = $scope.address;
            var end = "26 Queen St, Worcester, MA 01610";
            // var appointmentTime = new Date(2014, 10);
            //appointmentTime.setHours(13,30);
            //var appointmentDay = $scope.modelDay;
            //var appointmentHour = $scope.modelTime;

            var appointment = $scope.choices[selected].name;
            var divide = appointment.split(" ");
            var myDate = divide[0];
            var myTime = divide[1];
            var chunks = myDate.split('-');

            var formattedDate = chunks[1]+'/'+chunks[0]+'/'+chunks[2]+ ' '+myTime;

//      Setting parameters of API Call
            var request = {
                origin: start,
                destination: end,
                travelMode: google.maps.TravelMode.TRANSIT,
                transitOptions: {
                    //  arrivalTime:  new Date(2015,8,1,16,0,0),

                    arrivalTime: new Date(formattedDate),


                },
                unitSystem: google.maps.UnitSystem.IMPERIAL,
                provideRouteAlternatives: true
            };

//      API Call
            directionsService.route(request, function(response, status) {
                if (status == google.maps.DirectionsStatus.OK) {
                    directionsDisplay.setDirections(response);
                    var day1 = new Date();
                    var day2 = new Date();
                    var walkTime = new Array();
                    var walkTime1 = new Array();
                    var waitTime = new Array();
                    var waitTime1 = new Array();
                    var timeUpdate= new Array();
                    var dump = new Date();
                    var len = response.routes.length;

                    for(var e=0;e<len;e++) {
                        walkTime[e] = 0;


                        var stepLength = response.routes[e].legs[0].steps.length;


                        if(stepLength ==1){

                            walkTime[e] = walkTime[e] + ((response.routes[e].legs[0].steps[0].duration.value)/60);
                            waitTime[e]=0;

                        }

                        //   waitTime[e]=0;






                        else {
                            waitTime[e]=0;
                            day1 = response.routes[e].legs[0].departure_time.value;
                            timeUpdate[e] =day1.getTime();

                            for (var y = 0; y < stepLength; y++) {
                                var ting = response.routes[e].legs[0].steps[y].instructions;
                                if (ting.indexOf('Walk') !== -1) {
                                    //  timeUpdate[e] = timeUpdate[e] + ((response.routes[e].legs[0].steps[y].duration.value) * 1000);
                                    walkTime[e] = walkTime[e] + (response.routes[e].legs[0].steps[y].duration.value) / 60;

                                }

                                else {


                                    dump = response.routes[e].legs[0].steps[y].transit.departure_time.value;
                                    waitTime[e] = waitTime[e] + (dump.getTime() - timeUpdate[e]);
                                    dump = response.routes[e].legs[0].steps[y].transit.arrival_time.value;
                                    timeUpdate[e] = dump.getTime();
                                }

                            }
                        }


                        walkTime1[e] = Math.round(walkTime[e]) +" "+ "mins";
                    }
                }
                else {
                    alert("Error: "+status)
                }
                for(e=0;e<len; e++){
                    if(waitTime[e] <0) waitTime[e] =0;
                    waitTime1[e] = Math.round(waitTime[e]/60000) +" "+ "mins";
                }



                var dist = document.getElementById("summary");

                document.getElementById("details").innerHTML ="";
                for(var t=0;t<len;t++) {
                    var str = "<b>Option no</b>"+":" +" "+ (t+1)+ "<br />" +"<b>Total Duration</b>"+":"+" " +(response.routes[t].legs[0].duration.text)+"<br />"+"<b>Total Waiting Time</b>"+":"+" " +(waitTime1[t])+ "<br />"+"<b>Total Walking Time</b>"+":"+" " +(walkTime1[t]);
                    str = str.toString();
                    document.getElementById("details").innerHTML = document.getElementById("details").innerHTML+ "<br />"+"<br/>"+ str ;



                }
            });
            google.maps.event.addDomListener(window, 'load', initialize);
        }

        //var dateMoments = new Date(moment().subtract(15, 'minutes'));

//    END OF GOOGLE MAPS API
        function minTime(selDate, callback){
            var min;
            var arr = [];
            var start = $scope.address;
            var end = "26 Queen St, Worcester, MA 01610";
            var appointment = selDate;

            var divide = appointment.split(" ");
            var myDate = divide[0];
            var myTime = divide[1];
            var chunks = myDate.split('-');

            var formattedDate = chunks[1]+'/'+chunks[0]+'/'+chunks[2]+ ' '+myTime;
            var request = {
                origin: start,
                destination: end,
                travelMode: google.maps.TravelMode.TRANSIT,
                transitOptions: {
                    //  arrivalTime:  new Date(2015,8,1,16,0,0),

                    arrivalTime: new Date(formattedDate),


                },
                unitSystem: google.maps.UnitSystem.IMPERIAL,
                provideRouteAlternatives: true
            };


            directionsService.route(request, function(response, status) {
                if (status == google.maps.DirectionsStatus.OK) {
                    for(var f=0;f< response.routes.length;f++){
                        arr[f] = response.routes[f].legs[0].duration.value;

                    }

                    var min = arr[0];
                    var minLoc =0;
                    for(var r= 0; r<response.routes.length;r++){
                        if(arr[r] <min){
                            min = arr[r];
                            minLoc = r;
                        }
                    }
                    callback(min,minLoc);

                }
                else {
                    alert("Error: "+status)
                }
            });

        }
        $scope.leastTime= function(){

            $scope.directView =false;
            $scope.outputView=true;
            // $scope.summaryView = false;
            var timeArr = new Array();
            var routeArr = new Array();

            var l = $scope.choices.length;
            var round;

            document.getElementById("day1Label").innerHTML = "Day 1 least Time:"
            document.getElementById("day2Label").innerHTML = "Day 2 least Time:"
            document.getElementById("day3Label").innerHTML = "Day 3 least Time:"
            document.getElementById("day4Label").innerHTML = "Day 4 least Time:"
            document.getElementById("day5Label").innerHTML = "Day 5 least Time:"
            if (l>0) {
                minTime($scope.choices[0].name, function (result,minLoc) {
                        round = Math.round(result / 60);
                        var minLoc1 = minLoc +1;
                        document.getElementById("day1").value = round + " mins";
                        document.getElementById("day11").value = "Option:"+" "+ minLoc1;

                    }
                );
                setTimeout(function(){
                    var splitVar = document.getElementById("day1").value.split(" ");
                    timeArr.push(splitVar[0]);
                    routeArr.push(document.getElementById("day11").value)


                },1000);
                l--;
            }


            if(l>0) {
                minTime($scope.choices[1].name, function (result,minLoc) {
                        var round = Math.round(result / 60);
                        var minLoc1 = minLoc +1;

                        document.getElementById("day2").value = round +" mins";
                        document.getElementById("day22").value = "Option:"+" "+ minLoc1;


                    }
                );
                setTimeout(function(){
                    var splitVar = document.getElementById("day2").value.split(" ");

                    timeArr.push(splitVar[0]);
                    routeArr.push(document.getElementById("day22").value)

                },1000);
                l--;
            }


            if(l>0) {
                minTime($scope.choices[2].name, function (result,minLoc) {
                        var round = Math.round(result / 60);
                        var minLoc1 = minLoc +1;
                        document.getElementById("day3").value = round +" mins" ;
                        document.getElementById("day33").value = "Option:"+" "+ minLoc1;

                    }
                );
                setTimeout(function(){
                    var splitVar = document.getElementById("day3").value.split(" ");
                    timeArr.push(splitVar[0]);
                    routeArr.push(document.getElementById("day33").value)

                },1000);
                l--;
            }

            if(l>0) {
                minTime($scope.choices[3].name, function (result,minLoc) {
                        var round = Math.round(result / 60);
                        var minLoc1 = minLoc +1;
                        document.getElementById("day4").value = round +" mins" ;
                        document.getElementById("day44").value = "Option:"+" "+ minLoc1;
                    }
                );
                setTimeout(function(){
                    var splitVar = document.getElementById("day4").value.split(" ");
                    timeArr.push(splitVar[0]);
                    routeArr.push(document.getElementById("day44").value)

                },1000);
                l--;
            }
            if(l>0) {
                minTime($scope.choices[4].name, function (result,minLoc) {
                        var round = Math.round(result / 60);
                        var minLoc1 = minLoc +1;
                        document.getElementById("day5").value = round + " mins";
                        document.getElementById("day55").value = "Option:"+" "+ minLoc1;

                    }
                );
                setTimeout(function(){
                    var splitVar = document.getElementById("day5").value.split(" ");
                    timeArr.push(splitVar[0]);
                    routeArr.push(document.getElementById("day55").value)

                },1000);
                l--;
            }



            setTimeout(function(){
                var min = timeArr[0];
                var minLoc =0;
                for(var c=0;c<timeArr.length;c++){
                    if(timeArr[c]<min){
                        min = timeArr[c];
                        minLoc =c;
                    }

                }

                document.getElementById("result").value = " "+ $scope.choices[minLoc].name + "    "+ routeArr[minLoc];
                var routeAddress = routeArr[minLoc].split(" ")[1];

                var start = $scope.address;
                var end = "26 Queen St, Worcester, MA 01610";
                var appointment = $scope.choices[minLoc].name;

                var divide = appointment.split(" ");
                var myDate = divide[0];
                var myTime = divide[1];
                var chunks = myDate.split('-');

                var formattedDate = chunks[1]+'/'+chunks[0]+'/'+chunks[2]+ ' '+myTime;
                var request = {
                    origin: start,
                    destination: end,
                    travelMode: google.maps.TravelMode.TRANSIT,
                    transitOptions: {
                        //  arrivalTime:  new Date(2015,8,1,16,0,0),

                        arrivalTime: new Date(formattedDate),


                    },
                    unitSystem: google.maps.UnitSystem.IMPERIAL,
                    provideRouteAlternatives: true
                };

                directionsService.route(request, function(response, status) {
                    if (status == google.maps.DirectionsStatus.OK) {


                        directionsDisplay.setDirections(response);
                        directionsDisplay.setRouteIndex(parseInt(routeAddress-1));

                        /*   var stepLength = response.routes[minLoc].legs[0].steps.length;
                         var resultString=""
                         for( var i=0;i<stepLength;i++){
                         resultString=resultString + response.routes[minLoc].legs[0].steps[i].instructions;
                         }
                         alert(resultString);
                         */
                    }
                    else {
                        alert("Error: "+status)
                    }
                });

            },2500)

        }

        function minWaitTime(selDate, callback){

            var min;
            var arr = [];
            var start = $scope.address;
            var end = "26 Queen St, Worcester, MA 01610";
            var appointment = selDate;

            var divide = appointment.split(" ");
            var myDate = divide[0];
            var myTime = divide[1];
            var chunks = myDate.split('-');

            var formattedDate = chunks[1]+'/'+chunks[0]+'/'+chunks[2]+ ' '+myTime;
            var request = {
                origin: start,
                destination: end,
                travelMode: google.maps.TravelMode.TRANSIT,
                transitOptions: {
                    //  arrivalTime:  new Date(2015,8,1,16,0,0),

                    arrivalTime: new Date(formattedDate),


                },
                unitSystem: google.maps.UnitSystem.IMPERIAL,
                provideRouteAlternatives: true
            };


            directionsService.route(request, function(response, status) {
                if (status == google.maps.DirectionsStatus.OK) {
                    directionsDisplay.setDirections(response);
                    var day1 = new Date();
                    var day2 = new Date();

                    var waitTime = new Array();
                    var waitTime1 = new Array();
                    var timeUpdate= new Array();
                    var dump = new Date();
                    var len = response.routes.length;

                    for(var e=0;e<len;e++) {



                        var stepLength = response.routes[e].legs[0].steps.length;


                        if(stepLength ==1){


                            waitTime[e]=0;

                        }

                        else {
                            waitTime[e]=0;
                            day1 = response.routes[e].legs[0].departure_time.value;
                            timeUpdate[e] =day1.getTime();

                            for (var y = 0; y < stepLength; y++) {
                                var ting = response.routes[e].legs[0].steps[y].instructions;
                                if (ting.indexOf('Walk') !== -1) {


                                }

                                else {


                                    dump = response.routes[e].legs[0].steps[y].transit.departure_time.value;
                                    waitTime[e] = waitTime[e] + (dump.getTime() - timeUpdate[e]);
                                    dump = response.routes[e].legs[0].steps[y].transit.arrival_time.value;
                                    timeUpdate[e] = dump.getTime();
                                }

                            }
                        }



                    }
                }
                else {
                    alert("Error: "+status)
                }

                for(e=0;e<len; e++){
                    if(waitTime[e] <0) waitTime[e] =0;
                    waitTime1[e] = Math.round(waitTime[e]/60000) ;
                }
                var min = waitTime1[0];
                var minLoc =0;
                for(var r= 0; r<response.routes.length;r++){
                    if(waitTime1[r] <min){
                        min = waitTime1[r];
                        minLoc =r;
                    }
                }
                callback(min,minLoc);


            });
        }

        $scope.leastWaitTime = function(){
            $scope.outputView=true;
            // $scope.summaryView = false;
            var timeArr = new Array();
            var routeArr = new Array();
            var l = $scope.choices.length;
            var round;
            document.getElementById("day1Label").innerHTML = "Day 1 least waitTime:"
            document.getElementById("day2Label").innerHTML = "Day 2 least waitTime:"
            document.getElementById("day3Label").innerHTML = "Day 3 least waitTime:"
            document.getElementById("day4Label").innerHTML = "Day 4 least waitTime:"
            document.getElementById("day5Label").innerHTML = "Day 5 least waitTime:"

            if (l>0) {

                minWaitTime($scope.choices[0].name, function (result,minLoc) {

                        // round = Math.round(result / 60);
                        var minLoc1 = minLoc+1;
                        document.getElementById("day1").value = result +" mins";
                        document.getElementById("day11").value = "Option:"+" "+ minLoc1;

                    }
                );
                setTimeout(function(){
                    var spliVar = document.getElementById("day1").value.split(" ");
                    timeArr.push(spliVar[0])
                    routeArr.push(document.getElementById("day11").value)

                },1000);
                l--;
            }


            if(l>0) {
                minWaitTime($scope.choices[1].name, function (result,minLoc) {
                        // var round = Math.round(result / 60);
                        var minLoc1 = minLoc+1;
                        document.getElementById("day2").value = result +" mins" ;
                        document.getElementById("day22").value = "Option:"+" "+ minLoc1;


                    }
                );
                setTimeout(function(){
                    var splitVar = document.getElementById("day2").value.split(" ");
                    timeArr.push(splitVar[0])
                    routeArr.push(document.getElementById("day22").value)


                },1000);
                l--;
            }


            if(l>0) {
                minWaitTime($scope.choices[2].name, function (result,minLoc) {
                        //  var round = Math.round(result / 60);
                        var   minLoc1 = minLoc+1;
                        document.getElementById("day3").value = result + " mins" ;
                        document.getElementById("day33").value = "Option:"+" "+ minLoc1;

                    }
                );
                setTimeout(function(){
                    var splitVar = document.getElementById("day3").value.split(" ");
                    timeArr.push(splitVar[0]);
                    routeArr.push(document.getElementById("day33").value)


                },1000);
                l--;
            }

            if(l>0) {
                minWaitTime($scope.choices[3].name, function (result, minLoc) {
                        // var round = Math.round(result / 60);
                        var minLoc1 = minLoc+1;
                        document.getElementById("day4").value = result +" mins";
                        document.getElementById("day44").value = "Option:"+" "+ minLoc1;
                    }
                );
                setTimeout(function(){
                    var spliVar = document.getElementById("day4").value.split[0];
                    timeArr.push(spliVar[0])

                    routeArr.push(document.getElementById("day44").value)


                },1000);
                l--;
            }
            if(l>0) {
                minWaitTime($scope.choices[4].name, function (result, minLoc) {
                        //  var round = Math.round(result / 60);
                        var minLoc1 = minLoc+1;
                        document.getElementById("day5").value = result +" mins";
                        document.getElementById("day55").value = "Option:"+" "+ minLoc1;
                    }
                );
                setTimeout(function(){
                    var spliVar = document.getElementById("day5").value.split(" ");
                    timeArr.push(spliVar[0])

                    routeArr.push(document.getElementById("day55").value)


                },1000);
                l--;
            }
            setTimeout(function(){
                var min = timeArr[0];
                var minLoc =0;
                for(var c=0;c<timeArr.length;c++){
                    if(timeArr[c]<min){
                        min = timeArr[c];
                        minLoc =c;
                    }

                }

                document.getElementById("result").value = " "+ $scope.choices[minLoc].name + "    "+ routeArr[minLoc];
                var routeAddress = routeArr[minLoc].split(" ")[1]
                var start = $scope.address;
                var end = "26 Queen St, Worcester, MA 01610";
                var appointment = $scope.choices[minLoc].name;

                var divide = appointment.split(" ");
                var myDate = divide[0];
                var myTime = divide[1];
                var chunks = myDate.split('-');

                var formattedDate = chunks[1]+'/'+chunks[0]+'/'+chunks[2]+ ' '+myTime;
                var request = {
                    origin: start,
                    destination: end,
                    travelMode: google.maps.TravelMode.TRANSIT,
                    transitOptions: {
                        //  arrivalTime:  new Date(2015,8,1,16,0,0),

                        arrivalTime: new Date(formattedDate),


                    },
                    unitSystem: google.maps.UnitSystem.IMPERIAL,
                    provideRouteAlternatives: true
                };

                directionsService.route(request, function(response, status) {
                    if (status == google.maps.DirectionsStatus.OK) {
                        directionsDisplay.setDirections(response);
                        directionsDisplay.setRouteIndex(parseInt(routeAddress-1));
                    }
                    else {
                        alert("Error: "+status)
                    }
                });

            },2500)
        }

        function minWalkTime(selDate,callback){

            var min;
            var arr = [];
            var start = $scope.address;
            var end = "26 Queen St, Worcester, MA 01610";
            var appointment = selDate;

            var divide = appointment.split(" ");
            var myDate = divide[0];
            var myTime = divide[1];
            var chunks = myDate.split('-');

            var formattedDate = chunks[1]+'/'+chunks[0]+'/'+chunks[2]+ ' '+myTime;
            var request = {
                origin: start,
                destination: end,
                travelMode: google.maps.TravelMode.TRANSIT,
                transitOptions: {
                    //  arrivalTime:  new Date(2015,8,1,16,0,0),

                    arrivalTime: new Date(formattedDate),


                },
                unitSystem: google.maps.UnitSystem.IMPERIAL,
                provideRouteAlternatives: true
            };
            directionsService.route(request, function(response, status) {
                if (status == google.maps.DirectionsStatus.OK) {
                    directionsDisplay.setDirections(response);
                    var day1 = new Date();
                    var day2 = new Date();
                    var walkTime = new Array();
                    var walkTime1 = new Array();

                    var timeUpdate = new Array();
                    var dump = new Date();
                    var len = response.routes.length;

                    for (var e = 0; e < len; e++) {
                        walkTime[e] = 0;


                        var stepLength = response.routes[e].legs[0].steps.length;


                        if (stepLength == 1) {

                            walkTime[e] = walkTime[e] + ((response.routes[e].legs[0].steps[0].duration.value) / 60);


                        }

                        //   waitTime[e]=0;


                        else {

                            day1 = response.routes[e].legs[0].departure_time.value;
                            timeUpdate[e] = day1.getTime();

                            for (var y = 0; y < stepLength; y++) {
                                var ting = response.routes[e].legs[0].steps[y].instructions;
                                if (ting.indexOf('Walk') !== -1) {

                                    walkTime[e] = walkTime[e] + (response.routes[e].legs[0].steps[y].duration.value) / 60;

                                }

                                else {


                                    dump = response.routes[e].legs[0].steps[y].transit.departure_time.value;

                                    dump = response.routes[e].legs[0].steps[y].transit.arrival_time.value;
                                    timeUpdate[e] = dump.getTime();
                                }

                            }
                        }


                        walkTime1[e] = Math.round(walkTime[e]) + " " + "mins";
                    }
                }
                else {
                    alert("Error: "+status)
                }
                var min = walkTime[0];
                var minLoc=0;
                for(var h=0;h<walkTime.length;h++){
                    if(walkTime[h]<min){
                        min = walkTime[h];
                        minLoc=h;
                    }
                }
                callback(min,minLoc);


            });

        }

        $scope.leastWalkTime = function(){
            $scope.outputView=true;
            //  $scope.summaryView = false;
            var timeArr = new Array();
            var routeArr = new Array();
            var l = $scope.choices.length;
            var round;
            document.getElementById("day1Label").innerHTML = "Day 1 least walkTime:"
            document.getElementById("day2Label").innerHTML = "Day 2 least walkTime:"
            document.getElementById("day3Label").innerHTML = "Day 3 least walkTime:"
            document.getElementById("day4Label").innerHTML = "Day 4 least walkTime:"
            document.getElementById("day5Label").innerHTML = "Day 5 least walkTime:"
            if (l>0) {

                minWalkTime($scope.choices[0].name, function (result,minLoc) {

                        var minLoc1 = minLoc+1;
                        var round = Math.round(result);
                        document.getElementById("day1").value = round +" mins";
                        document.getElementById("day11").value = "Option: " + minLoc1;

                    }
                );
                setTimeout(function(){
                    var spliVar = document.getElementById("day1").value.split(" ");
                    timeArr.push(spliVar[0]);
                    routeArr.push(document.getElementById("day11").value);

                },1000);
                l--;
            }


            if(l>0) {
                minWalkTime($scope.choices[1].name, function (result,minLoc) {
                        var round = Math.round(result);
                        var minLoc1 = minLoc+1;
                        document.getElementById("day2").value = round + " mins" ;
                        document.getElementById("day22").value = "Option: " + minLoc1;


                    }
                );
                setTimeout(function(){
                    var spliVar = document.getElementById("day2").value.split(" ");
                    timeArr.push(spliVar[0])
                    routeArr.push(document.getElementById("day22").value);

                },1000);
                l--;
            }


            if(l>0) {
                minWalkTime($scope.choices[2].name, function (result, minLoc) {
                        var round = Math.round(result);
                        var minLoc1 = minLoc+1;
                        document.getElementById("day3").value = round + " mins" ;
                        document.getElementById("day33").value = "Option: " + minLoc1;

                    }
                );
                setTimeout(function(){
                    var spliVar = document.getElementById("day3").value.split(" ");
                    timeArr.push(spliVar[0])
                    routeArr.push(document.getElementById("day33").value);

                },1000);
                l--;
            }

            if(l>0) {
                minWalkTime($scope.choices[3].name, function (result, minLoc) {
                        var round = Math.round(result);
                        var minLoc1 = minLoc +1;
                        document.getElementById("day4").value = round + " mins";
                        document.getElementById("day44").value = "Option: "+minLoc1;
                    }
                );
                setTimeout(function(){
                    var spliVar = document.getElementById("day4").value.split(" ");
                    timeArr.push(spliVar[0])
                    routeArr.push(document.getElementById("day44").value);

                },1000);
                l--;
            }
            if(l>0) {
                minWalkTime($scope.choices[4].name, function (result,minLoc) {
                        var round = Math.round(result);
                        var minLoc1 = minLoc+1;
                        document.getElementById("day5").value = round + " mins";
                        document.getElementById("day55").value = "Option: " +minLoc1;
                    }
                );
                setTimeout(function(){
                    var spliVar = document.getElementById("day5").value.split(" ");
                    timeArr.push(spliVar[0])
                    routeArr.push(document.getElementById("day55").value);

                },1000);
                l--;
            }
            setTimeout(function(){
                var min = timeArr[0];
                var minLoc =0;
                for(var c=0;c<timeArr.length;c++){
                    if(timeArr[c]<min){
                        min = timeArr[c];
                        minLoc =c;
                    }

                }

                document.getElementById("result").value = " "+ $scope.choices[minLoc].name +" "+ routeArr[minLoc];
                var routeAddress = routeArr[minLoc].split(" ")[1];
                var start = $scope.address;
                var end = "26 Queen St, Worcester, MA 01610";
                var appointment = $scope.choices[minLoc].name;

                var divide = appointment.split(" ");
                var myDate = divide[0];
                var myTime = divide[1];
                var chunks = myDate.split('-');

                var formattedDate = chunks[1]+'/'+chunks[0]+'/'+chunks[2]+ ' '+myTime;
                var request = {
                    origin: start,
                    destination: end,
                    travelMode: google.maps.TravelMode.TRANSIT,
                    transitOptions: {
                        //  arrivalTime:  new Date(2015,8,1,16,0,0),

                        arrivalTime: new Date(formattedDate),


                    },
                    unitSystem: google.maps.UnitSystem.IMPERIAL,
                    provideRouteAlternatives: true
                };

                directionsService.route(request, function(response, status) {
                    if (status == google.maps.DirectionsStatus.OK) {
                        directionsDisplay.setDirections(response);
                        directionsDisplay.setRouteIndex(parseInt(routeAddress-1));

                    }
                    else {
                        alert("Error: "+status)
                    }
                });

            },2500)
        }

    });