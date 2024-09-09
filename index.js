class Knapsack {
    constructor() {
        this.valores = [];
        this.pesos = [];
        this.pesoMax = 0;
        this.quantiaItens = 0;
        this.table = [];
    }

    set(pesoMax, quantiaItens, valores, pesos) {
        this.pesoMax = pesoMax;
        this.quantiaItens = quantiaItens;
        this.valores = valores;
        this.pesos = pesos;
        return Promise.resolve();
    }

    knapsack() {
        this.table = Array.from({ length: this.quantiaItens + 1 }, () => Array(this.pesoMax + 1).fill(0));
        const listItensEscolhidos = [];

        for (let i = 1; i <= this.quantiaItens; i++) {
            for (let j = 1; j <= this.pesoMax; j++) {
                if (this.pesos[i - 1] <= j) {
                    this.table[i][j] = Math.max(this.valores[i - 1] + this.table[i - 1][j - this.pesos[i - 1]], this.table[i - 1][j]);
                } else {
                    this.table[i][j] = this.table[i - 1][j];
                }
            }
        }

        for (let i = 1; i <= this.quantiaItens; i++) {
            const itensEscolhidos = this.rastreiaItens(i);
            listItensEscolhidos.push(itensEscolhidos);
        }

        return [this.table[this.quantiaItens][this.pesoMax], listItensEscolhidos];
    }

    rastreiaItens(linha) {
        const itensEscolhidos = [];
        let i = linha;
        let j = this.pesoMax;

        while (i > 0 && j > 0) {
            if (this.table[i][j] !== this.table[i - 1][j]) {
                itensEscolhidos.push(i);
                j -= this.pesos[i - 1];
            }
            i--;
        }

        return itensEscolhidos.reverse();
    }
}

class Index {
    constructor(itens) {
        this.itens = itens;
        this.i = 0;

        this.canvas = document.getElementById('meuCanvas');
        this.ctx = this.canvas.getContext('2d');

        this.canvasTodosItens = document.getElementById('todosItensCanvas');
        this.ctxTodosItens = this.canvasTodosItens.getContext('2d');

        this.colors = ['red', 'green', 'blue', 'orange', 'purple',
            'cyan', 'magenta', 'yellow', 'lime', 'pink',
            'teal', 'brown', 'olive', 'navy', 'coral'];

        this.drawAllItems();
        this.run();
    }

    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        for (let j = 0; j < this.i; j++) {
            let y = 3;
            let x = 20;
            for (let index of this.itens[j]) {
                const color = this.getColorForItem(index);
                this.ctx.fillStyle = color;
                this.ctx.fillRect(x, y + (12 * j), 10, 10);
                x += 14;
            }
        }
    }

    drawAllItems() {
        this.ctxTodosItens.clearRect(0, 0, this.canvasTodosItens.width, this.canvasTodosItens.height);
        let y = 10;

        this.itens.forEach((item, index) => {
            const color = this.getColorForItem(index + 1);
            this.ctxTodosItens.fillStyle = color;
            this.ctxTodosItens.fillRect(10, y, 10, 10);

            this.ctxTodosItens.fillStyle = 'black';
            this.ctxTodosItens.font = '12px Arial';
            this.ctxTodosItens.fillText(`Item ${index + 1}`, 30, y + 10);

            y += 20;
        });
    }

    getColorForItem(index) {
        return this.colors[(index - 1) % this.colors.length];
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
        }, 1000 / 5);
    }
}

function iniciarKnapsack() {
    const pesoMax = parseInt(document.getElementById('pesoMax').value);
    const quantiaItens = parseInt(document.getElementById('quantiaItens').value);

    const valores = [];
    const pesos = [];

    for (let i = 0; i < quantiaItens; i++) {
        const valor = parseInt(prompt(`Digite o valor do item ${i + 1}:`));
        const peso = parseInt(prompt(`Digite o peso do item ${i + 1}:`));
        if (valor < 0 || peso < 0) {
            alert("Valores e pesos dos itens devem ser positivos.");
            return;
        }
        valores.push(valor);
        pesos.push(peso);
    }

    const knapsack = new Knapsack();

    const allItems = Array.from({ length: quantiaItens }, (_, i) => [i + 1]);
    new Index(allItems);

    knapsack.set(pesoMax, quantiaItens, valores, pesos).then(() => {
        const [maxValor, itensEscolhidos] = knapsack.knapsack();

        console.log(`Valor Máximo: ${maxValor}`);
        itensEscolhidos.forEach(row => {
            console.log(row);
        });

        new Index(itensEscolhidos);
    });
}
