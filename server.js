const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);

// Файлдарды интернетке шығару
app.use(express.static('public'));

// Топтардың ұпайы (бастапқыда 0)
let scores = { red: 0, blue: 0 };

// Біреу сайтқа кіргенде
io.on('connection', (socket) => {
  console.log('Жаңа ойыншы қосылды!');
  
  // Жаңа кірген адамға қазіргі ұпайды жіберу
  socket.emit('updateScores', scores);

  // Телефоннан жауап келгенде
  socket.on('answer', (data) => {
    if(data.correct) {
      scores[data.team] += 10; // Дұрыс болса 10 ұпай қосылады
      if(scores[data.team] > 90) scores[data.team] = 90; // Мәреден асып кетпеуі үшін
      io.emit('updateScores', scores); // Барлық экранға жаңа ұпайды жіберу
    }
  });

  // Ойынды қайта бастау (Админ үшін)
  socket.on('resetGame', () => {
    scores = { red: 0, blue: 0 };
    io.emit('updateScores', scores);
  });
});

const PORT = process.env.PORT || 3000;
http.listen(PORT, () => {
  console.log('Сервер іске қосылды!');
});
