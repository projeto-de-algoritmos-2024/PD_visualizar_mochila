const readline = require('readline');

class Knapsack {
    constructor() {
        this.valores = [];
        this.pesos = [];
        this.pesoMax = 0;
        this.quantiaItens = 0;
        this.table = [];
    }

    set() {
        return new Promise((resolve) => {
            const rl = readline.createInterface({
                input: process.stdin,
                output: process.stdout
            });

            rl.question('Digite o peso máximo da sua mochila: ', (pesoMax) => {
                this.pesoMax = parseInt(pesoMax);

                rl.question('Digite o número de itens a serem processados: ', (quantiaItens) => {
                    this.quantiaItens = parseInt(quantiaItens);

                    const perguntas = Array(this.quantiaItens).fill(null).map((_, i) => [
                        `Digite o valor do item ${i + 1}: `,
                        `Digite o peso do item ${i + 1}: `
                    ]);

                    let index = 0;
                    const processaItem = () => {
                        if (index < this.quantiaItens) {
                            rl.question(perguntas[index][0], (valorItem) => {
                                rl.question(perguntas[index][1], (pesoItem) => {
                                    this.valores.push(parseInt(valorItem));
                                    this.pesos.push(parseInt(pesoItem));
                                    index++;
                                    processaItem();
                                });
                            });
                        } else {
                            rl.close();
                            resolve();
                        }
                    };

                    processaItem();
                });
            });
        });
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

module.exports = { Knapsack };