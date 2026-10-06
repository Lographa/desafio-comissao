# Desafios em TypeScript

Programas de estudo em TypeScript e Node.js. Os dados ficam em memória, sem banco e sem framework. Cada desafio está em `src/desafios` e é chamado por `src/index.ts`.

## Desafios

### 1. Comissão de vendas

Calcula a comissão de cada venda e resume, por vendedor, o total vendido e o total de comissão.

- Abaixo de R$ 100,00: 0%
- De R$ 100,00 até R$ 499,99: 1%
- A partir de R$ 500,00: 5%

A comissão incide sobre cada venda. O total do vendedor é a soma dessas comissões.

### 2. Movimentação de estoque

Registra entradas e saídas dos produtos. A entrada aumenta o estoque e a saída diminui. Uma saída maior que a quantidade disponível é recusada. Depois de cada movimentação válida, o programa informa o estoque final do produto e, no fim, lista o histórico.

### 3. Juros por atraso

A partir de um valor e de uma data de vencimento, calcula quantos dias se passaram até hoje e aplica 2,5% ao dia sobre o valor original. Vencimento hoje ou no futuro gera juros zero.

## Como iniciar

É preciso ter o Node.js instalado.

```bash
npm install
npm start
```

`npm start` compila a pasta `src` para `dist` e executa os três desafios no console. Para ver só um deles, comente as outras chamadas em `src/index.ts`.
