import { estoqueInicial } from "../../data/estoque";
import { EstoqueProduto } from "../../models/estoque";

export type TipoMovimentacao = "entrada" | "saida";

export interface Movimentacao {
	id: number;
	descricao: string;
	codigoProduto: number;
	quantidade: number;
	tipo: TipoMovimentacao;
}

export interface ResultadoMovimentacao {
	movimentacao: Movimentacao;
	descricaoProduto: string;
	estoqueFinal: number;
}

const descricoes: Record<TipoMovimentacao, string> = {
	entrada: "Entrada",
	saida: "Saída",
};

export class ControleEstoque {
	private readonly produtos: EstoqueProduto[];
	private readonly movimentacoes: Movimentacao[] = [];
	private proximoId = 1;

	constructor(produtos: readonly EstoqueProduto[]) {
		this.produtos = produtos.map((produto) => ({ ...produto }));
	}

	movimentar(
		tipo: TipoMovimentacao,
		codigoProduto: number,
		quantidade: number,
	): ResultadoMovimentacao {
		if (!Number.isInteger(quantidade) || quantidade <= 0) {
			throw new Error(
				"A quantidade deve ser um número inteiro maior que zero.",
			);
		}

		const produto = this.produtos.find(
			(item) => item.codigoProduto === codigoProduto,
		);

		if (!produto) {
			throw new Error(`Produto ${codigoProduto} não encontrado.`);
		}

		const novoEstoque =
			tipo === "entrada"
				? produto.estoque + quantidade
				: produto.estoque - quantidade;

		if (novoEstoque < 0) {
			throw new Error(
				`Saída de ${quantidade} maior que o estoque de ${produto.descricaoProduto} (${produto.estoque}).`,
			);
		}

		produto.estoque = novoEstoque;

		const movimentacao: Movimentacao = {
			id: this.proximoId,
			descricao: descricoes[tipo],
			codigoProduto,
			quantidade,
			tipo,
		};

		this.proximoId += 1;
		this.movimentacoes.push(movimentacao);

		return {
			movimentacao,
			descricaoProduto: produto.descricaoProduto,
			estoqueFinal: produto.estoque,
		};
	}

	historico(): readonly Movimentacao[] {
		return [...this.movimentacoes];
	}

	listarProdutos(): readonly EstoqueProduto[] {
		return this.produtos.map((produto) => ({ ...produto }));
	}
}

function formatarResultado(resultado: ResultadoMovimentacao): string {
	const { movimentacao, descricaoProduto, estoqueFinal } = resultado;

	return `${movimentacao.descricao} de ${movimentacao.quantidade} em ${descricaoProduto}. Estoque final: ${estoqueFinal}`;
}

function formatarHistorico(
	movimentacoes: readonly Movimentacao[],
	produtos: readonly EstoqueProduto[],
): string {
	if (movimentacoes.length === 0) {
		return "Nenhuma movimentação realizada.";
	}

	return movimentacoes
		.map((movimentacao) => {
			const produto = produtos.find(
				(item) => item.codigoProduto === movimentacao.codigoProduto,
			);
			const nome =
				produto?.descricaoProduto ?? `Produto ${movimentacao.codigoProduto}`;

			return `${movimentacao.id} | ${movimentacao.descricao} | ${nome} | ${movimentacao.quantidade}`;
		})
		.join("\n");
}

export function executar(): void {
	const controle = new ControleEstoque(estoqueInicial);

	console.log("Desafio 2\n");

	//função para adicionar o remover do estoque
	const operacoes: Array<() => ResultadoMovimentacao> = [
		() => controle.movimentar("entrada", 101, 10),
		// () => controle.movimentar("saida", 102, 25),
		// () => controle.movimentar("saida", 103, 500),
		// () => controle.movimentar("saida", 105, 90),
	];

	for (const operacao of operacoes) {
		try {
			console.log(formatarResultado(operacao()));
		} catch (erro) {
			const mensagem =
				erro instanceof Error ? erro.message : "Movimentação recusada.";
			console.log(`Movimentação recusada: ${mensagem}`);
		}
	}

	console.log("\nHistórico");
	console.log(
		formatarHistorico(controle.historico(), controle.listarProdutos()),
	);
}
