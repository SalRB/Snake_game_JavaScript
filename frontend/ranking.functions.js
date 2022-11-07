// Builds the numbered list to print the scores 
function makelist(array) {
    let myList = "";
    for (var i = 0; i < 5; i++) {
        myList += '<li>' + array[i]['score'] + ' ' + array[i]['username'] + '</li>';
    }
    return myList
}

// Print the best scores for each mode
function printRankings(easyRanking, mediumRanking, hardRanking) {
    const divRankingEasy = document.getElementById('rankingEasy');
    const divRankingMedium = document.getElementById('rankingMedium');
    const divRankingHard = document.getElementById('rankingHard');

    const easyList = '<ol><h2>EASY</h2>' + makelist(easyRanking) + '</ol>';
    divRankingEasy.innerHTML = easyList;
    const mediumList = '<ol><h2>MEDIUM</h2>' + makelist(mediumRanking) + '</ol>';
    divRankingMedium.innerHTML = mediumList;
    const hardList = '<ol><h2>HARD</h2>' + makelist(hardRanking) + '</ol>';
    divRankingHard.innerHTML = hardList;
}

// Prints the best scores of a logged user
function printPersonalBest(score) {
    document.getElementById('personalScores').innerHTML = `<p><b>EASY:</p>` + score['easy'] + `</b>
                                                            ` + `<p><b>MEDIUM:</p>` + score['medium'] + `</b>
                                                            ` + `<p><b>HARD:</p>` + score['hard'] + `</b>`;
}