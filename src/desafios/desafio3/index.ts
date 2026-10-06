const MULTA_AO_DIA = 0.025;
const MILISSEGUNDOS_POR_DIA = 24 * 60 * 60 * 1000;

function inicioDoDia(data: Date): Date {
	return new Date(data.getFullYear(), data.getMonth(), data.getDate());
}

function diasEmAtraso(vencimento: Date, hoje: Date): number {
	const inicioVencimento = inicioDoDia(vencimento).getTime();
	const inicioHoje = inicioDoDia(hoje).getTime();
	const diferenca = Math.round(
		(inicioHoje - inicioVencimento) / MILISSEGUNDOS_POR_DIA,
	);

	return diferenca > 0 ? diferenca : 0;
}

function arredondarCentavos(valor: number): number {
	return Math.round(valor * 100) / 100;
}

function calcularJuros(valor: number, vencimento: Date, hoje: Date): number {
	const dias = diasEmAtraso(vencimento, hoje);

	return arredondarCentavos(valor * MULTA_AO_DIA * dias);
}

function somarDias(data: Date, dias: number): Date {
	const resultado = new Date(data);
	resultado.setDate(resultado.getDate() + dias);
	return resultado;
}

function formatarMoeda(valor: number): string {
	return new Intl.NumberFormat("pt-BR", {
		style: "currency",
		currency: "BRL",
	}).format(valor);
}

export function executar(): void {
	const hoje = new Date();

	const casos = [
		{
			descricao: "Vencido há 3 dias",
			valor: 200,
			vencimento: somarDias(hoje, -3),
		},
		{ descricao: "Vence hoje", valor: 200, vencimento: hoje },
		{
			descricao: "Vence em 5 dias",
			valor: 200,
			vencimento: somarDias(hoje, 5),
		},
	];

	console.log("Desafio 3\n");

	for (const caso of casos) {
		const dias = diasEmAtraso(caso.vencimento, hoje);
		const juros = calcularJuros(caso.valor, caso.vencimento, hoje);

		console.log(caso.descricao);
		console.log(`Valor: ${formatarMoeda(caso.valor)}`);
		console.log(`Vencimento: ${caso.vencimento.toLocaleDateString("pt-BR")}`);
		console.log(`Dias em atraso: ${dias}`);
		console.log(`Juros: ${formatarMoeda(juros)}`);
		console.log("");
	}
}
