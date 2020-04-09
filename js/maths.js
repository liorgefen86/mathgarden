var answer;
var score = 0;
var backgroundImages = [];

function nextQuestion() {
    const n1 = Math.floor(Math.random() * 5);
    const n2 = Math.floor(Math.random() * 6);
    document.getElementById('n1').innerHTML = n1;
    document.getElementById('n2').innerHTML = n2;

    answer = n1 + n2;
 }

 function checkAnswer() {
    const prediction = predictImage()[0];

    if (prediction == answer) {
        if (score < 6) {
            score++;
            backgroundImages.push(`url('images/background${score}.svg')`);
            document.body.style.backgroundImage = backgroundImages;
        } else {
            window.alert('Congratulations! You answered correctly to all quizzes!')
            score = 0;
            backgroundImages = [];
            document.body.style.backgroundImage = backgroundImages;
        }

        console.log('Nicely done!');
        console.log(`Score is: ${score}`);
    } else {
        if (score != 0) {
            score--
            backgroundImages.pop();
            window.alert('Your garden is perishing!')
            window.setTimeout(function () {
                document.body.style.backgroundImage = backgroundImages;
            }, 1000);
        }

        console.log('Do you even Math?');
        console.log(`Score is: ${score}`);
    }
 }