# Guarda Física 360

Build a document warehouse management system (WMS) called "GoDocs Guarda Física 360".

Portuguese (pt-BR) interface. Use Supabase for database and auth.

DOMAIN CONTEXT

This system controls physical document archives stored in warehouses.

Physical hierarchy of tracked objects: Documento/Pasta -> Caixa Box 5kg -> Caixa 20kg.

One Caixa 20kg holds up to 3 Caixa Box. A Caixa 20kg belongs to exactly ONE client.

DATABASE SCHEMA (create all tables with RLS enabled)

clientes: id, razao_social, cnpj, unidade_padrao_id, ativo, created_at

contratos: id, cliente_id, nome, modelo_operacional, sla_normal_horas, sla_urgente_horas,

  servicos_habilitados (jsonb), exige_lacre bool, exige_triagem bool, guarda_dirigida bool,

  teto_etiquetas int, nivel_etiquetagem enum('caixa','box','documento'), status enum('ativo','suspenso','inativo')

unidades: id, nome, endereco, responsavel

galpoes: id, unidade_id, nome

estrutura_vagas: id, galpao_id, rua (text), modulo, coluna, altura, vao,

  codigo_vaga (unique, format R01-M01-C01-A01-V01), tipo_caixa_compativel enum('caixa20','box5','especial'),

  peso_max_kg numeric, status enum('livre','reservada','ocupada','bloqueada','neutra','divergente','em_auditoria','inativa'),

  caixa_cativa_id (nullable fk), reservada_ate timestamptz, reservada_por_ordem_id

areas_temporarias: id, galpao_id, tipo enum('recebimento','conferencia','separacao_guarda','separacao_ged',

  'producao','expedicao','divergencia','quarentena','auditoria','implantacao','retirada_presencial'),

  capacidade_max int, tempo_max_horas int, alerta_horas int

caixas: id, codigo_barras (unique global), identificador_interno (unique global), cliente_id, contrato_id,

  tipo enum('caixa20','box5','documento'), caixa_pai_id (nullable, self ref for hierarchy),

  peso_kg numeric, espelho_1 varchar(60), espelho_2 varchar(60),

  status enum -> ('pre_cadastrada','coletada','em_transporte','recebida','em_conferencia','em_divergencia',

  'aguardando_inbound','aguardando_enderecamento','posicao_reservada','guardada_confirmada','em_operacao',

  'em_ged_producao','separada','em_atendimento','emprestada','aguardando_devolucao','conteudo_parcial',

  'em_transferencia','em_transito','em_auditoria','divergente','bloqueada','bloqueio_legal','em_quarentena',

  'aguardando_expurgo','expurgada','saida_definitiva','extraviada','cancelada'),

  vaga_atual_id, vaga_cativa_id, area_temporaria_id, indice_movimentacao int default 0,

  identificadores_externos jsonb, temporalidade_ate date

ordens_servico: id, numero (auto, format OS-YYYY-NNNNNN), tipo enum('GUARDA','GED','EXPURGO','DEVOLUCAO',

  'TRANSFERENCIA','COLETA','ATENDIMENTO','INVENTARIO','MOV-01'..'MOV-10'),

  cliente_id, contrato_id, unidade_id, prioridade enum('normal','urgente'), sla_vencimento timestamptz,

  status enum('rascunho','aberta','aprovada','atribuida','em_execucao','pausada','com_divergencia',

  'aguardando_aprovacao','emergencia','concluida','cancelada','vencida','reaberta'),

  operador_id, origem, destino, motivo, created_at

ordem_itens: id, ordem_id, caixa_id, status_item, vaga_destino_id, executado_em

eventos_log: id, caixa_id, ordem_id, acao, origem, destino, usuario_id, dispositivo,

  status_antes, status_depois, justificativa, payload jsonb, created_at

  -- THIS TABLE IS APPEND ONLY. Create a Postgres trigger that raises an exception on UPDATE or DELETE.

ocorrencias: id, codigo (REC-01..REC-10 e CONS-01..CONS-13), caixa_id, ordem_id, severidade,

  descricao, evidencias jsonb, cliente_notificado bool, resolvida bool, created_at

usuarios (extend auth): id, nome, perfil enum('admin_global','admin_unidade','gestor_operacional',

  'lider_galpao','operador_galpao','motorista','auditor','comercial','financeiro','cliente','cpad'),

  unidades_permitidas uuid[]

CRITICAL BUSINESS RULES to enforce at database level

1. codigo_barras and identificador_interno must be globally unique across all units.

2. eventos_log is immutable. No updates, no deletes, ever.

3. Every physical movement must reference an ordem_servico. A caixa status change without ordem_id

   must be rejected unless it is an "emergencia" order.

Start by creating the schema, the auth, and a sidebar layout with these sections:

Dashboard, Clientes e Contratos, Estrutura Física, Recebimento, Inbound, Endereçamento,

Ordens de Serviço, Atendimento, Auditoria, Relatórios.

Use a clean industrial UI, dark mode support, shadcn components, orange accent (#F26B21).

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/7eac4c4f-2c87-469d-8a61-cd73b66af040).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
