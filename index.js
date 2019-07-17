let canvas = document.querySelector('canvas');
let dimentions = 500;
let score = document.querySelector('span');
canvas.width = dimentions, canvas.height = dimentions;
let c = canvas.getContext('2d');
let dir = 0;
let radius = 10;
let time = 0;
let speed = 9;
function randomCordinate() {
    let n = (Math.floor((Math.random() + 0.1)*dimentions))%(dimentions-radius);
    return n>=radius ? n : n + radius; 
}

function createCircle(x, y, radius, color) {
    c.beginPath();
    c.arc(x, y, radius, 0, Math.PI*2, false);
    c.fillStyle = color;
    c.fill();
}

function Food(x, y) {
    this.x = x;
    this.y = y;
    this.generateFood = function(bodyCoOrdinate) {
        let x = randomCordinate(), y = randomCordinate();
        for(let i=0;i<bodyCoOrdinate.length;i++){
            if(x >= bodyCoOrdinate[i].x && x <= (bodyCoOrdinate[i].x +100) && y >= bodyCoOrdinate[i].y && y <= (bodyCoOrdinate[i].y + 100)){
                return this.generateFood(bodyCoOrdinate);
            }
        }
        this.x = x, this.y = y;
    }
}

function BodyPart(x, y) {
    this.x = x;
    this.y = y;
}

function Snake() {;
    this.bodyCoOrdinate = [new BodyPart(randomCordinate(),randomCordinate())]
    this.dir = randomCordinate()%4;
    this.food = new Food(randomCordinate(), randomCordinate());
    this.steps = 5;
    this.score = 0;
    this.increaseSpeedAt = 50;
    this.addNewBodyPart = function(x, y) {
        this.bodyCoOrdinate.push(new BodyPart(x, y));
    }
    this.eatFood = function() {
        if(this.bodyCoOrdinate[this.bodyCoOrdinate.length - 1].x - this.food.x < radius &&
            this.bodyCoOrdinate[this.bodyCoOrdinate.length - 1].x - this.food.x > -radius &&
            this.bodyCoOrdinate[this.bodyCoOrdinate.length - 1].y - this.food.y < radius &&
            this.bodyCoOrdinate[this.bodyCoOrdinate.length - 1].y - this.food.y > -radius 
            ){
                this.bodyCoOrdinate.unshift(new BodyPart(0,0))
                this.food.generateFood(this.bodyCoOrdinate);
                this.score += 50; 
                score.innerHTML = `${this.score}`;
        }
    }
    this.updateDir = function(dir) {
        this.prevDir = this.dir;
        this.dir = dir;
    }
    this.moveInDirection = function() {
        this.eatFood();
        let x = this.bodyCoOrdinate[this.bodyCoOrdinate.length - 1].x;
        let y = this.bodyCoOrdinate[this.bodyCoOrdinate.length - 1].y;
        switch(this.dir){
            case 0: //left
                (x - this.steps - radius) < 0 ? this.bodyCoOrdinate.push(new BodyPart(500, y)) : this.bodyCoOrdinate.push(new BodyPart(x-this.steps, y));
                break;
            case 1: //up
                (y - this.steps - radius) < 0 ? this.bodyCoOrdinate.push(new BodyPart(x, 500)) : this.bodyCoOrdinate.push(new BodyPart(x, y - this.steps));
                break; 
            case 2: //right
                (x + this.steps  - radius > 500) ? this.bodyCoOrdinate.push(new BodyPart(0, y)) : this.bodyCoOrdinate.push(new BodyPart(x + this.steps, y));
                break;
            case 3: //down
                (y + this.steps  - radius) > 500 ? this.bodyCoOrdinate.push(new BodyPart(x, 0)) : this.bodyCoOrdinate.push(new BodyPart(x, y+this.steps));
                break;
        }
        this.bodyCoOrdinate.shift();
    }
}

let snake = new Snake();

function animate(){
    requestAnimationFrame(animate);
    // score.innerHTML = speed;
    if(time%5 === 0){
    	c.clearRect(0, 0, 500, 500);
	    snake.moveInDirection();
	    createCircle(snake.food.x, snake.food.y, radius/2, 'red')
	    snake.bodyCoOrdinate.forEach((value) => {
	        createCircle(value.x, value.y, radius, 'black')
	    })
    }
    time += 5;
}

window.addEventListener('keydown', (e) => {
    // console.log('dfgh');
    let dir = e.keyCode >= 37 && e.keyCode <= 40 ? e.keyCode - 37 : snake.dir;
    snake.updateDir(dir)
    // (2 + snake.dir)%4 != dir ? snake.updateDir(dir) : null;
})
animate()