// Declaraciones de variables y objetos
var declarations = function () {
   // Obtenemos canvas
   canvas = document.getElementById("canvas");
   context = canvas.getContext("2d");
   // Definimos posiciones de x e y
   x = window.innerWidth / 2;
   y = window.innerHeight - 30;
   // Valores de desplazamiento (velocidad)
   dx = 3;
   dy = -3;
   // Tamaño de la bola
   ballRadius = 10;
   //  Definimos tamaño de la pala
   paddleHeight = 10;
   paddleWidth = 100;
   // Posiciones de la pala
   paddleX = (window.innerWidth - paddleWidth) / 2;
   paddleY = window.innerHeight - paddleHeight;
   // Variables de posicion
   rightPressed = false;
   leftPressed = false;
   // Variables para los ladrillos
   brickRowCount = 6;
   brickColumnCount = 10;
   brickWidth = 75;
   brickHeight = 20;
   brickPadding = 10;
   brickOffsetTop = 60;
   if (window.innerWidth < 1280) {
      brickOffsetLeft = (window.innerWidth - ((brickWidth + brickPadding) * brickColumnCount)) / 2;
   } else {
      brickOffsetLeft = (1280 - ((brickWidth + brickPadding) * brickColumnCount)) / 2;
   }
   // Array con los bloques generados
   bricks = [];
   // Variable para el contador
   score = 0;
   // Contador de vidas
   lives = 3;
   // Juego iniciado
   started = false;
   // Color bola
   colorBall = '#ffffff';
   // Color pala
   colorPaddle = '#ffffff';
   // Color ladrillos
   colorBrick = '#ffffff';
};

// Funcion para crear el muro de ladrillos
var createWall = function () {
   for (c = 0; c < brickColumnCount; c++) {
      bricks[c] = [];
      for (r = 0; r < brickRowCount; r++) {
         bricks[c][r] = {x: 0, y: 0, status: 1};
      }
   }
};

/*** EVENTOS ***/

// Declaraciones de eventos
var events = function () {
   // Añadimos evento al redimensionar ventana
   window.addEventListener('resize', resizeCanvas, false);
   // Añadimos evento para gestionar presion de teclas de movimiento de la pala
   document.addEventListener('keydown', keyDownHandler, false);
   document.addEventListener('keyup', keyUpHandler, false);
   // Añadirmos evento para gestionar el movimiento de la pala con el raton
   // document.addEventListener("mousemove", mouseMoveHandler, false);
};

/** EVENT HANDLERS **/

// Funcion que controla cuando se presiona una tecla
var keyDownHandler = function (e) {
   // Cuando se presiona fecha derecha o flecha izquierda
   if (e.keyCode === 39) {
      rightPressed = true;
   } else if (e.keyCode === 37) {
      leftPressed = true;
   }
};

// Funcion que controla cuando se suelta una tecla
var keyUpHandler = function (e) {
   // Cuando se suelta flecha derecha o flecha izquierda
   if (e.keyCode === 39) {
      rightPressed = false;
   } else if (e.keyCode === 37) {
      leftPressed = false;
   }
};

// Funcion que controla el movimiento de la pala con el raton
var mouseMoveHandler = function (e) {
   var relativeX = e.clientX - canvas.offsetLeft;
   if(relativeX > 0 && relativeX < canvas.width) {
      paddleX = relativeX - (paddleWidth / 2);
   }
};

/**/

/** GRAFICOS **/

// Funcion que se ejecuta cada vez que se redimensiona la pantalla
var resizeCanvas = function () {
   // Obtenemos tamaño de pantalla
   if (window.innerWidth < 1280) {
      canvas.width = window.innerWidth;
   } else {
      canvas.width = 1280;
   }
   canvas.height = window.innerHeight;
   // Dibujamos contenido
   screen();
};

// Funcion para pintar pantalla
var screen = function () {
   // LLamada a dibujar pelota
   drawBall();
   // Dibujamos la pala
   drawPaddle();
   // Comprobamos movimiento de pala
   checkPaddle();
   // Pintamos los ladrillos
   drawBricks();
   // Comprobamos colisiones
   collisionDetection();
   // Pintamos marcador
   drawScore();
   // Pintamos el numero de vidas
   drawLives();
   // Si el juego esta iniciado, repintamos
   if(started === true) {
      // Refrescamos pantalla
      requestAnimationFrame(screen);
   }
};

// Funcion que pinta un bola azul en las posiciones indicadas
var drawBall = function () {
   // Limpiamos recta
   context.clearRect(0, 0, canvas.width, canvas.height);
   // Creamos elemento circular de color azul
   context.beginPath();
   context.arc(x, y, ballRadius, 0, Math.PI * 2);
   context.fillStyle = colorBall;
   context.fill();
   context.closePath();
   // Actualizamos valores de x e y por el desplazamiento
   x += dx;
   y += dy;
   // Comprobando limites
   checkLimits();
};

// Funcion que pinta la pala que controla la bola
var drawPaddle = function () {
   context.beginPath();
   context.rect(paddleX, paddleY, paddleWidth, paddleHeight);
   context.fillStyle = colorPaddle;
   context.fill();
   context.closePath();
};

// Funcion que pinta los ladrillos
var drawBricks = function () {
   for (c = 0; c < brickColumnCount; c++) {
      for (r = 0; r < brickRowCount; r++) {
         // Si el ladrillo no esta destruido
         if(bricks[c][r].status === 1) {
            // Pintamos ladrillo en la posicion correspondiente
            var brickX = (c * (brickWidth + brickPadding)) + brickOffsetLeft;
            var brickY = (r * (brickHeight + brickPadding)) + brickOffsetTop;
            bricks[c][r].x = brickX;
            bricks[c][r].y = brickY;
            context.beginPath();
            context.rect(brickX, brickY, brickWidth, brickHeight);
            context.fillStyle = colorBrick;
            context.fill();
            context.closePath();
         }
      }
   }
};

// Funcion para pinta contador
var drawScore = function () {
   context.font = "18px Arial";
   context.fillStyle = "#FFF";
   context.fillText("Score: " + score, 8, 20);
};

// Funcion para pintar numero de vidas
var drawLives = function () {
   context.font = "18px Arial";
   context.fillStyle = "#FFF";
   context.fillText("Lives: " + lives, canvas.width - 75, 20);
};

// Random color ball
var randomColorBall = function () {
   colorBall = "#" + Math.floor(Math.random()*16777215).toString(16);
};

/**/

/** COMPROBACIONES **/

// Funcion comprueba limites de rebote de la bola
var checkLimits = function () {
   // Comprobando limite superior
   if (y + dy < ballRadius) {
      randomColorBall();
      dy = -dy;
   }
   // Comprobando limite inferior
   if (y + dy > (canvas.height - ballRadius)) {
      // Si toca la pala
      if (x > paddleX && x < (paddleX + paddleWidth)) {
         randomColorBall();
         // Desplazamo mas rapido
         dy = -(dy + 0.1);
      } else {
         // Restamos vida si toca el lado inferior
         lives--;
         // Si no quedan vidas
         if(!lives) {
            // Sino fin del juego
            game_over();
         } else {
            // Si tiene vidas colocamos bola y pala en el centro
            x = canvas.width / 2;
            y = canvas.height - 30;
            dx = 2;
            dy = -2;
            paddleX = (canvas.width - paddleWidth) / 2;
         }
      }
   }
   // Comprobando limite izquierdo
   if (x + dx < ballRadius) {
      randomColorBall();
      dx = -dx;
   }
   // Comprobando limite derecho
   if (x + dx > (canvas.width - ballRadius)) {
      randomColorBall();
      dx = -dx;
   }
};

// Funcion para comprobar limites de movimiento de la pala
var checkPaddle = function () {
   if (rightPressed && paddleX < (canvas.width - paddleWidth)) {
      paddleX += 7;
   }
   else if (leftPressed && paddleX > 0) {
      paddleX -= 7;
   }
};

// Funcion para detecta colisiones de los ladrillos
var collisionDetection = function () {
   for (c = 0; c < brickColumnCount; c++) {
      for (r= 0; r < brickRowCount; r++) {
         // Almacenamos ladrillo
         var b = bricks[c][r];
         // Si el estado el ladrillo esta mostrado
         if(b.status === 1) {
            if (x > b.x && x < (b.x + brickWidth) && y > b.y && y < (b.y + brickHeight)) {
               randomColorBall();
               // desplazamos bola
               dy = -dy;
               // Ocultamos ladrillo
               b.status = 0;
               // Actualizamos marcador
               score++;
               // Fin del juego
               if(score === (brickRowCount * brickColumnCount)) {
                  winner();
               }
            }
         }
      }
   }
};

/**/

// Funcion para iniciar el juego
var startGame = function () {
   // Background
   document.getElementById('start').addEventListener('click', function () {
      overlay('hide');
      started = true;
      // Llamamos a función para pintar pantalla
      screen();
   }, false);
};

// Funcion para mostra y ocultar overlay
var overlay = function (status) {
   var overlay = document.getElementsByClassName('overlay')[0];
   if(status === 'hide') {
      overlay.style.display = 'none';
   } else if(status === 'show') {
      overlay.style.display = 'block';
   }
};

// Funcion para enviar contenido a info
var info = function (contenido) {
   var info = document.getElementById('info');
   info.innerHTML = contenido;
};

// Funcion game over
var game_over = function () {
   started = false;
   overlay('show');
   var html = '<h1 id="start">Volver a Jugar</h1>';
   html += '<h1 class="big_red">GAME OVER!</h1>';
   info(html);
};

// Funcion win
var winner = function () {
   started = false;
   overlay('show');
   var html = '<h1 id="start">Volver a Jugar</h1>';
   html += '<h1 class="big_green">YOU WIN, CONGRATULATIONS!</h1>';
   info(html);
};

// Inicio de la ejecucion del juego
(function () {
   // Declaraciones de variables y objetos
   declarations();
   // Declaraciones de eventos
   events();
   // Creamos el muro de ladrillos
   createWall();
   // LLamada a funcion de redimension de pantalla
   resizeCanvas();
   // Comenzar el juego
   startGame();
})();
