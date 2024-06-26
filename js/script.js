const tg = window.Telegram.WebApp;
tg.expand();
tg.MainButton.text = "Close App";
tg.MainButton.show();
tg.MainButton.onClick(() => tg.close());

let score = localStorage.getItem('score') ? parseInt(localStorage.getItem('score')) : 0;
let timer = 60;
let canClick = false;

document.getElementById('score').innerText = `Bricks Built: ${score}`;

document.getElementById('brick-button').addEventListener('click', () => {
    if (canClick) {
        score++;
        localStorage.setItem('score', score);
        animateScore();
        document.getElementById('score').innerText = `Bricks Built: ${score}`;
        canClick = false;
        document.getElementById('brick-button').disabled = true;
        startTimer();
    }
});

function startTimer() {
    let countdown = setInterval(() => {
        timer--;
        document.getElementById('timer-text').innerText = `${timer}s`;
        document.getElementById('progress').style.width = `${(60 - timer) / 60 * 100}%`;
        if (timer === 0) {
            clearInterval(countdown);
            timer = 60;
            canClick = true;
            document.getElementById('brick-button').disabled = false;
            document.getElementById('timer-text').innerText = `60s`;
            document.getElementById('progress').style.width = `0%`;
        }
    }, 1000);
}

function animateScore() {
    const scoreElement = document.getElementById('score');
    scoreElement.style.transition = "transform 0.3s, color 0.3s";
    scoreElement.style.transform = "scale(1.5)";
    scoreElement.style.color = "#ff0000";
    setTimeout(() => {
        scoreElement.style.transform = "scale(1)";
        scoreElement.style.color = "#000000";
    }, 300);
}

document.addEventListener('DOMContentLoaded', () => {
    startTimer();
    tg.ready();
    const user = tg.initDataUnsafe.user;
    document.getElementById('user-photo').src = user.photo_url;
    document.body.style.backgroundColor = tg.themeParams.bg_color;
    document.body.style.color = tg.themeParams.text_color;
    document.querySelector('.container').style.backgroundColor = tg.themeParams.secondary_bg_color;
});

document.getElementById('user-info').addEventListener('click', () => {
    const user = tg.initDataUnsafe.user;
    const userDetails = `
        <p><strong>Name:</strong> ${user.first_name} ${user.last_name}</p>
        <p><strong>Username:</strong> ${user.username}</p>
        <p><strong>ID:</strong> ${user.id}</p>
    `;
    document.getElementById('user-details').innerHTML = userDetails;
    document.getElementById('invite-link').href = `https://t.me/brick_robot?start=${user.username}`;
    document.getElementById('user-popup').style.display = "block";
});

document.querySelector('.close').addEventListener('click', () => {
    document.getElementById('user-popup').style.display = "none";
});
