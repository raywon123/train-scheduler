$(document).ready(function () {

    // This function remove element from an array
    function removeElement(array, element) {
        let index = array.indexOf(element);
        if (index > -1) {
            array.splice(index, 1);
        }
    }

    // This function counts element occurances in an array
    function countElement(array, element) {
        let counts = {};
        for (var i = 0; i < array.length; i++) {
            if (!counts.hasOwnProperty(array[i])) {
                counts[array[i]] = 1;
            }
            else {
                counts[array[i]]++;
            }
        }
        return counts[element];
    }

    // This function finds index of duplicate elements in an array
    function findDuplicateElement(array, element) {
        let duplicates = {};
        for (var i = 0; i < array.length; i++) {
            if (duplicates.hasOwnProperty(array[i])) {
                duplicates[array[i]].push(i);
            }
            else if (array.lastIndexOf(array[i]) !== i) {
                duplicates[array[i]] = [i];
            }
        }
        return duplicates[element];
    }

    // -- main program

    let firstNumber = 0;

    $(".number").on("click", function () {
        console.log($(this).val());
        firstNumber += $(this).val();
        $("#first-number").text(firstNumber);
        console.log(firstNumber);
        let result = firstNumber + 2;  // '2 '+ '2' = 22  string addition
        console.log("result=" + result);
    });

});