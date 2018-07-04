export class Cidade {
    name: string;
}

export class Estado {
    sigla: string;
    nome: string;
    cidades: Cidade[]
}

export class EstadoCidade {
    estados: Estado[];
}