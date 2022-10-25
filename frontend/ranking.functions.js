function makelist(array) {
    let myList = "";
    for (var i = 0; i < 5; i++) {
        myList += '<li>' + array[i]['score'] + ' ' + array[i]['username'] + '</li>';
    }
    return myList
}

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
