const { Knapsack } = require('./knapsack');
const { createCanvas } = require('canvas');

class App {
    constructor(itens) {
        this.itens = itens;
        this.i = 0;

        // Inicializa a canvas
        this.canvas = createCanvas(150, 150);
        this.ctx = this.canvas.getContext('2d');

        this.run();
    }

    draw() {
        this.ctx.clearRect(0, 0, 150, 150);  // Limpa a tela

        for (let j = 0; j < this.i; j++) {
            let y = 3;
            let x = 20;
            for (let index of this.itens[j]) {
                this.ctx.fillRect(x, y + (8 * j), 4, 4);  // Desenha um retângulo
                x += 8;
            }
            x = 20;
        }
    }

    update() {
        if (this.i < this.itens.length) {
            this.i++;
        }
    }

    run() {
        const intervalId = setInterval(() => {
            this.update();
            this.draw();

            if (this.i >= this.itens.length) {
                clearInterval(intervalId);
            }
        }, 1000 / 5);  // FPS = 5 (200ms)
    }
}

const knapsack = new Knapsack();
knapsack.set().then(() => {
    const [maxValor, itensEscolhidos] = knapsack.knapsack();

    itensEscolhidos.forEach(row => {
        console.log(row);
    });

    new App(itensEscolhidos);
});