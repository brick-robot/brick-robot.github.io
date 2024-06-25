
let score = localStorage.getItem('score') ? parseInt(localStorage.getItem('score')) : 0;
let timer = 60;
let canClick = false;

document.getElementById('score').innerText = score;

function incrementScore() {
    if (canClick) {
        score++;
        localStorage.setItem('score', score);
        document.getElementById('score').innerText = score;
        canClick = false;
        document.querySelector('.brick-button').disabled = true;
        startTimer();
    }
}

function startTimer() {
    let countdown = setInterval(() => {
        timer--;
        document.getElementById('timer').innerText = `Next brick in: ${timer}s`;
        if (timer === 0) {
            clearInterval(countdown);
            timer = 60;
            canClick = true;
            document.querySelector('.brick-button').disabled = false;
            document.getElementById('timer').innerText = `Next brick in: ${timer}s`;
        }
    }, 1000);
}

document.addEventListener('DOMContentLoaded', () => {
    startTimer();
});
