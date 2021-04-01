var backImage,backgr;
var player, player_running;
var ground,ground_img;

var END =0;
var PLAY =1;
var gameState = PLAY;

var restart;
var restartImg;

var gameOver; 
var score = 0;

function preload(){
  backImage=loadImage("jungle.jpg");
  player_running = loadAnimation("Monkey_01.png","Monkey_02.png","Monkey_03.png","Monkey_04.png","Monkey_05.png","Monkey_06.png","Monkey_07.png","Monkey_08.png","Monkey_09.png","Monkey_10.png");
  bananaImage = loadImage("banana.png");
  obstacle_img = loadImage("stone.png"); 
  gameOverImg = loadImage("gameOver.png");
  restartImg = loadImage("RESTART.png");
}

function setup() {
  createCanvas(800,400);
  
  backgr=createSprite(0,0,800,400);
  backgr.addImage(backImage);
  backgr.scale=1.5;
  backgr.x=backgr.width/2;
  backgr.velocityX=-(5 + 10*score/50);
  
  player = createSprite(100,340,20,50);
  player.addAnimation("Running",player_running);
  player.scale = 0.1;
  
  ground = createSprite(400,350,800,10);
  ground.x=ground.width/2;
  ground.visible=false;
  
  restart = createSprite(width/2,height/2+50,50,50);
  restart.addImage(restartImg);
  restart.scale = 0.05

  FoodGroup = new Group();
  obstaclesGroup = new Group();
  
  score = 0;
}

function draw() { 
  background(0);
  drawSprites();

  textSize(20);
  strokeWeight(2);
  stroke("Black");
  fill("white");
  text("Score: "+ score, 650,50);

  if(gameState===PLAY){
    restart.visible = false;
    player.visible = true;

    if(backgr.x<100){
      backgr.x=backgr.width/2;
    }

    if(keyDown("space") && player.collide(ground) || mousePressedOver(backgr) && player.collide(ground)) {
      player.velocityY = -17;
    }

    player.velocityY = player.velocityY + 0.8;
    player.collide(ground);

    spawnFood();
    spawnObstacles();
    
    for (var i = 0; i < FoodGroup.length; i++) {
      if (FoodGroup.get(i).isTouching(player)) {
        FoodGroup.get(i).destroy();
        score = score + 2;
        player.scale += 0.03;
      }
    }

    if(obstaclesGroup.isTouching(player)){ 
      gameState = END;
    }

  }else if (gameState === END){
    restart.visible = true;
    player.velocityY = 0;

    FoodGroup.destroyEach();
    obstaclesGroup.destroyEach();

    backgr.velocityX = 0;
    player.visible = false;

    strokeWeight(4);
    textSize(40);
    text("GAME OVER", 300, height/2);

    if (keyDown("space") || mousePressedOver(restart)){
      reset();
    }
  }
}

function spawnFood(){
  if (frameCount % 200 === 0){
    var food = createSprite(820,random(100,200),10,10);
    food.addImage(bananaImage);
    food.scale = 0.05;
    food.velocityX = -(5.5 + 10*score/50);
    food.lifetime = 250;

    FoodGroup.add(food);
  }
}

function spawnObstacles(){
  if (frameCount % 190 === 0){
    var obstacle = createSprite(800,330,10,40);
    obstacle.velocityX=-(5 + 10*score/50); 
    obstacle.addImage(obstacle_img);    
    obstacle.scale = 0.14;
    obstacle.lifetime = 300;

    obstaclesGroup.add(obstacle);
  }
}

function reset(){
  FoodGroup.destroyEach();
  obstaclesGroup.destroyEach();
  player.visible = true;
  backgr.velocityX=-4;
  score = 0;
  player.scale = 0.1;
  gameState = PLAY; 
}