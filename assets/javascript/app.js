
$(document).ready(function () {

    let name = "Scottland Regular";
    let location = "Edinburgh";
    let firstTrainTime = "6:08";
    let frequency = "35";
    let TrainTimes = [];


    // refresh the display section every 30 second
    intervalId = setInterval(display, 30000);

    // Initialize Firebase
    var config = {
        apiKey: "AIzaSyB0CklR3O_tqzDeqEdh3Jke_PYdb45huOo",
        authDomain: "mytrain-d87bc.firebaseapp.com",
        databaseURL: "https://mytrain-d87bc.firebaseio.com",
        projectId: "mytrain-d87bc",
        storageBucket: "mytrain-d87bc.appspot.com",
        messagingSenderId: "507538949490"
    };

    firebase.initializeApp(config);
    let database = firebase.database();


    // function: calculate the Arrival Time and Minute Until Train
    // returns in an array
    function calculate(firstTime, tFrequency) {

        // array to store the both Time: MUT and AT  
        let times = [];

     
        var firstTimeConverted = moment(firstTime, "HH:mm");
        console.log(firstTimeConverted);
    
        // Current Time
        var currentTime = moment();
        console.log("CURRENT TIME: " + moment(currentTime).format("hh:mm"));
      
    
        // Difference between the times
        var diffTime = moment().diff(moment(firstTimeConverted), "minutes");
        console.log("DIFFERENCE IN TIME: " + diffTime);
    
        // Time apart (remainder)
        var tRemainder = diffTime % tFrequency;
        console.log(tRemainder);
    
        // Minute Until Train
        var tMinutesTillTrain = tFrequency - tRemainder;
        console.log("MINUTES TILL TRAIN: " + tMinutesTillTrain);
       

        // Next Train
        var nextTrain = moment().add(tMinutesTillTrain, "minutes");
        console.log("ARRIVAL TIME: " + moment(nextTrain).format("hh:mm"));

        // save to the times array
        // - format LT is hh:mm and with AM/PM
        // - format LTS is adding seconds to LT
        times.push(moment(nextTrain).format("LT"));
        // times.push(moment(nextTrain).format("LTS"));
        times.push(tMinutesTillTrain);

        return times;
        
    }
 
    // display the train schedules onto HTML
    function display() {

        $(".name-display").text(name);
        $(".location-display").text(location);
        $(".firstTime-display").text(firstTrainTime);
        $(".frequency-display").text(frequency);

        // use function to calcualte Next Train Arriaval Time
        TrainTimes = calculate(firstTrainTime, frequency);

        $(".nextTrain-display").text(TrainTimes[0]);
        $(".timeleft-display").text(TrainTimes[1]);

    }

    // --- main program

    display();

    // handling click submit button
    $(".add-train").on("click", function (event) {
        // Don't refresh the page!
        event.preventDefault();

        // getting input values
        name = $(".name-input").val().trim();
        location = $(".location-input").val().trim();
        firstTrainTime = $(".time-input").val().trim();
        frequency = $(".freq-input").val().trim();


        // Console log each of the user inputs to confirm we are receiving them
        console.log(name);
        console.log(location);
        console.log(firstTrainTime);
        console.log(frequency);

        // Display function will
        // - Use function to calcualte Next Train Arriaval Time
        // - Output all of the new information into the relevant HTML sections
        display();

    });

});