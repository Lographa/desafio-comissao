import { vendas } from "../../data/vendas";
import { Venda } from "../../models/venda";

interface ResumoVendedor {
	vendedor: string;
	totalVendido: number;
	totalComissao: number;
}

interface FaixaComissao {
	valorMinimo: number;
	percentual: number;
}

const faixas: readonly FaixaComissao[] = [
	{ valorMinimo: 500, percentual: 0.05 },
	{ valorMinimo: 100, percentual: 0.01 },
	{ valorMinimo: 0, percentual: 0 },
];

function arredondarCentavos(valor: number): number {
	return Math.round(valor * 100) / 100;
}

function calcularComissao(valor: number): number {
	const faixa = faixas.find((item) => valor >= item.valorMinimo);
	const percentual = faixa?.percentual ?? 0;
	const centavos = Math.round(valor * 100);

	return Math.round(centavos * percentual) / 100;
}

function resumirPorVendedor(lista: readonly Venda[]): ResumoVendedor[] {
	const porVendedor = new Map<string, ResumoVendedor>();

	for (const venda of lista) {
		const atual = porVendedor.get(venda.vendedor) ?? {
			vendedor: venda.vendedor,
			totalVendido: 0,
			totalComissao: 0,
		};

		atual.totalVendido = arredondarCentavos(atual.totalVendido + venda.valor);
		atual.totalComissao = arredondarCentavos(
			atual.totalComissao + calcularComissao(venda.valor),
		);

		porVendedor.set(venda.vendedor, atual);
	}

	return [...porVendedor.values()];
}

function formatarResumo(resumos: readonly ResumoVendedor[]): string {
	const moeda = new Intl.NumberFormat("pt-BR", {
		style: "currency",
		currency: "BRL",
	});

	return resumos
		.map((resumo) =>
			[
				resumo.vendedor,
				`Total vendido: ${moeda.format(resumo.totalVendido)}`,
				`Total comissão: ${moeda.format(resumo.totalComissao)}`,
			].join("\n"),
		)
		.join("\n\n");
}

export function executar(): void {
	console.log("Desafio 1\n");
	console.log(formatarResumo(resumirPorVendedor(vendas)));
}
