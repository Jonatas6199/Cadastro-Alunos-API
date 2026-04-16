const express = require('express');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');

const app = express();
app.use(cors());
app.use(express.json());

// ==========================
// "BANCO DE DADOS" EM MEMÓRIA
// ==========================
let alunos = [];
let id = 1;

// ==========================
// ROTAS
// ==========================

// GET - listar todos
app.get('/alunos', (req, res) => {
    res.json(alunos);
});

// GET - por id
app.get('/alunos/:id', (req, res) => {
    const aluno = alunos.find(a => a.id == req.params.id);
    if (!aluno) return res.status(404).json({ erro: 'Aluno não encontrado' });
    res.json(aluno);
});

// POST - criar
app.post('/alunos', (req, res) => {
    const { nome, idade, nota } = req.body;

    const novoAluno = {
        id: id++,
        nome,
        idade,
        nota
    };

    alunos.push(novoAluno);
    res.status(201).json(novoAluno);
});

// PUT - atualizar
app.put('/alunos/:id', (req, res) => {
    const aluno = alunos.find(a => a.id == req.params.id);
    if (!aluno) return res.status(404).json({ erro: 'Aluno não encontrado' });

    const { nome, idade, nota } = req.body;

    aluno.nome = nome;
    aluno.idade = idade;
    aluno.nota = nota;

    res.json(aluno);
});

// DELETE - remover
app.delete('/alunos/:id', (req, res) => {
    alunos = alunos.filter(a => a.id != req.params.id);
    res.json({ mensagem: 'Aluno removido' });
});

// ==========================
// SWAGGER (SEM JSDOC)
// ==========================
const swaggerDocument = {
    openapi: '3.0.0',
    info: {
        title: 'API de Alunos',
        version: '1.0.0',
        description: 'API simples para aprendizado'
    },
    paths: {

        '/alunos': {
            get: {
                summary: 'Lista todos os alunos',
                responses: {
                    200: {
                        description: 'Lista de alunos',
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'array',
                                    items: {
                                        type: 'object',
                                        properties: {
                                            id: { type: 'integer', example: 1 },
                                            nome: { type: 'string', example: 'João' },
                                            idade: { type: 'integer', example: 20 },
                                            nota: { type: 'number', example: 8.5 }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            },
            post: {
                summary: 'Cria um aluno',
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    nome: { type: 'string' },
                                    idade: { type: 'integer' },
                                    nota: { type: 'number' }
                                }
                            }
                        }
                    }
                },
                responses: {
                    201: {
                        description: 'Aluno criado'
                    }
                }
            }
        },
        '/alunos/{id}': {
            get: {
                summary: 'Busca aluno por ID',
                parameters: [
                    {
                        name: 'id',
                        in: 'path',
                        required: true,
                        schema: { type: 'integer' }
                    }
                ],
                responses: {
                    200: {
                        description: 'Aluno encontrado',
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    properties: {
                                        id: { type: 'integer', example: 1 },
                                        nome: { type: 'string', example: 'Maria' },
                                        idade: { type: 'integer', example: 22 },
                                        nota: { type: 'number', example: 9.0 }
                                    }
                                }
                            }
                        }
                    },
                    404: {
                        description: 'Aluno não encontrado'
                    }
                }
            },
            put: {
                summary: 'Atualiza um aluno',
                parameters: [
                    {
                        name: 'id',
                        in: 'path',
                        required: true,
                        schema: { type: 'integer' }
                    }
                ],
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    nome: { type: 'string' },
                                    idade: { type: 'integer' },
                                    nota: { type: 'number' }
                                }
                            }
                        }
                    }
                },
                responses: {
                    200: { description: 'Atualizado' },
                    404: { description: 'Não encontrado' }
                }
            },
            delete: {
                summary: 'Remove um aluno',
                parameters: [
                    {
                        name: 'id',
                        in: 'path',
                        required: true,
                        schema: { type: 'integer' }
                    }
                ],
                responses: {
                    200: { description: 'Removido' }
                }
            }
        }
    }
};

app.use('/swagger', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// ==========================
// SERVIDOR
// ==========================
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("Servidor rodando na porta " + PORT);
});

app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
    console.log(`Swagger em http://localhost:${PORT}/swagger`);
});
