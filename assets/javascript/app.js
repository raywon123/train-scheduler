
$(document).ready(function () {

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

    // array to hold train objects
    let trains = [];

    // ----- Non-Firebase Solutions begin -------------
    // Train Object
    function Train(name, location, firstTrainTime, frequency) {
        this.name = name;
        this.location = location;
        this.firstTrainTime = firstTrainTime;
        this.frequency = frequency;
    }

    // For testing
    // - initial trains for testing
    // - pushing into array
    let train1 = new Train("Hogwarts Express", "Hogsmeade", "5:35", "60");
    let train2 = new Train("London Express", "King's Cross Station", "6:08", "70");
    let train3 = new Train("Scottland Regular", "Edinburgh", "6:25", "35");

    trains = [train1, train2, train3];
    console.log(trains);

    // ----- Non-Firebase Solution Ends -------------


    // refresh the display section every 60 second

    // -- Non-Firebase Solution
    intervalId = setInterval(display, 60000);

    // -- Firebase Solution
    // intervalId = setInterval(displayFirebase, 60000);

    // function: calculate the Arrival Time and Minute Until Train
    // returns in an array
    function calculate(firstTime, tFrequency) {

        // array to store the both Time: MUT and AT  
        let times = [];


        var firstTimeConverted = moment(firstTime, "HH:mm");
        // console.log(firstTimeConverted);

        // Current Time
        var currentTime = moment();
        // console.log("CURRENT TIME: " + moment(currentTime).format("hh:mm"));


        // Difference between the times
        var diffTime = moment().diff(moment(firstTimeConverted), "minutes");
        // console.log("DIFFERENCE IN TIME: " + diffTime);

        // Time apart (remainder)
        var tRemainder = diffTime % tFrequency;
        // console.log(tRemainder);

        // Minute Until Train
        var tMinutesTillTrain = tFrequency - tRemainder;
        // console.log("MINUTES TILL TRAIN: " + tMinutesTillTrain);


        // Next Train
        var nextTrain = moment().add(tMinutesTillTrain, "minutes");
        // console.log("ARRIVAL TIME: " + moment(nextTrain).format("hh:mm"));

        // save to the times array
        // - format LT is hh:mm and with AM/PM
        // - format LTS is adding seconds to LT
        times.push(moment(nextTrain).format("LT"));
        // times.push(moment(nextTrain).format("LTS"));
        times.push(tMinutesTillTrain);

        return times;

    }

    // display the train schedules onto HTML using array (Non-Firebase Solution)
    function display() {

        // getting the HTML element
        let trainRow = $(".display-trains");

        // reset the display area.
        trainRow.empty();

        for (let i = 0; i < trains.length; i++) {

            // use function to calcualte Next Train Arriaval Time
            let trainTimes = calculate(trains[i].firstTrainTime, trains[i].frequency);

            // display onto HTML
            trainRow.append("<tr><td>" + trains[i].name + "</td>"
                + "<td>" + trains[i].location + "</td>"
                + "<td>" + trains[i].frequency + "</td>"
                + "<td>" + trainTimes[0] + "</td>"
                + "<td>" + trainTimes[1] + "</td></tr>"
            );

            // - for testing
            // trainRow.append("<td>" + trains[i].location + "</td>");
            // trainRow.append("<td>" + trains[i].firstTrainTime + "</td>");
            // trainRow.append("<td>" + trains[i].frequency + "</td>");
            // trainRow.append("<td>" + trainTimes[0] + "</td>");
            // trainRow.append("<td>" + trainTimes[1] + "</td></tr>");

            // - for testing
            // TrainTimes = calculate(firstTrainTime, frequency); 
            // $(".name-display").text(name);
            // $(".location-display").text(location);
            // $(".firstTime-display").text(firstTrainTime);
            // $(".frequency-display").text(frequency);
            // $(".nextTrain-display").text(TrainTimes[0]);
            // $(".timeleft-display").text(TrainTimes[1]);

        }
    }

    // function to display onto HTML using data from Firebase (Firebase Solution)
    function displayFirebase() {

        // getting the HTML element
        let trainRow = $(".display-trains");

        // reset the display area.
        trainRow.empty();

        // retrieving data from Firebase (it is already in a loop)
        database.ref('trains/').on('child_added', function (snapshot) {
            console.log("from_child = " + snapshot.val().name);
            console.log(snapshot.val());
            let data = snapshot.val();
            console.log("---" + data.name);

            // use function to calcualte Next Train Arriaval Time
            let trainTimes = calculate(data.firstTrainTime, data.frequency);

            // display onto HTML
            trainRow.append("<tr><td>" + data.name + "</td>"
                + "<td>" + data.location + "</td>"
                + "<td>" + data.frequency + "</td>"
                + "<td>" + trainTimes[0] + "</td>"
                + "<td>" + trainTimes[1] + "</td></tr>"
            );


        });
    }

    // handling click submit button
    $(".add-train").on("click", function (event) {
        // Don't refresh the page!
        event.preventDefault();

        // getting input values
        let name = $(".name-input").val().trim();
        let location = $(".location-input").val().trim();
        let firstTrainTime = $(".time-input").val().trim();
        let frequency = $(".freq-input").val().trim();

        // Console log each of the user inputs to confirm we are receiving them
        console.log(name);
        console.log(location);
        console.log(firstTrainTime);
        console.log(frequency);

        //-- frequency cannot be 0 - leads to divide by 0 problem
        if (frequency === '0') {
            frequency = '1';
        }
       
        // store the new train info into the trains array (Non-Firebase Solution)
        let newTrain = new Train(name, location, firstTrainTime, frequency);
        trains.push(newTrain);
        console.log(trains);

        // store in Firebase (Firebase Solution)
        database.ref('trains/').push({
            name: name,
            location: location,
            firstTrainTime: firstTrainTime,
            frequency: frequency
        });


        // Display function will
        // - Use function to calcualte Next Train Arriaval Time
        // - Output all of the new information into the relevant HTML sections

        //-- non-Firebase Solution
        display();

        //-- Firebase Solution
        // displayFirebase();


    });

    // --- main program

    //-- non-Firebase Solution
    display();

    //-- Firebase Solution
    // displayFirebase();

});