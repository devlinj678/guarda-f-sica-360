
-- ENUMS
CREATE TYPE public.nivel_etiquetagem AS ENUM ('caixa','box','documento');
CREATE TYPE public.contrato_status AS ENUM ('ativo','suspenso','inativo');
CREATE TYPE public.tipo_caixa_compativel AS ENUM ('caixa20','box5','especial');
CREATE TYPE public.vaga_status AS ENUM ('livre','reservada','ocupada','bloqueada','neutra','divergente','em_auditoria','inativa');
CREATE TYPE public.area_tipo AS ENUM ('recebimento','conferencia','separacao_guarda','separacao_ged','producao','expedicao','divergencia','quarentena','auditoria','implantacao','retirada_presencial');
CREATE TYPE public.caixa_tipo AS ENUM ('caixa20','box5','documento');
CREATE TYPE public.caixa_status AS ENUM ('pre_cadastrada','coletada','em_transporte','recebida','em_conferencia','em_divergencia','aguardando_inbound','aguardando_enderecamento','posicao_reservada','guardada_confirmada','em_operacao','em_ged_producao','separada','em_atendimento','emprestada','aguardando_devolucao','conteudo_parcial','em_transferencia','em_transito','em_auditoria','divergente','bloqueada','bloqueio_legal','em_quarentena','aguardando_expurgo','expurgada','saida_definitiva','extraviada','cancelada');
CREATE TYPE public.os_tipo AS ENUM ('GUARDA','GED','EXPURGO','DEVOLUCAO','TRANSFERENCIA','COLETA','ATENDIMENTO','INVENTARIO','MOV-01','MOV-02','MOV-03','MOV-04','MOV-05','MOV-06','MOV-07','MOV-08','MOV-09','MOV-10');
CREATE TYPE public.os_prioridade AS ENUM ('normal','urgente');
CREATE TYPE public.os_status AS ENUM ('rascunho','aberta','aprovada','atribuida','em_execucao','pausada','com_divergencia','aguardando_aprovacao','emergencia','concluida','cancelada','vencida','reaberta');
CREATE TYPE public.perfil_usuario AS ENUM ('admin_global','admin_unidade','gestor_operacional','lider_galpao','operador_galpao','motorista','auditor','comercial','financeiro','cliente','cpad');

-- USUARIOS (perfil ligado ao auth)
CREATE TABLE public.usuarios (
  id uuid PRIMARY KEY,
  nome text NOT NULL DEFAULT '',
  email text,
  perfil public.perfil_usuario NOT NULL DEFAULT 'operador_galpao',
  unidades_permitidas uuid[] NOT NULL DEFAULT '{}',
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.usuarios TO authenticated;
GRANT ALL ON public.usuarios TO service_role;
ALTER TABLE public.usuarios ENABLE ROW LEVEL SECURITY;
CREATE POLICY "usuarios_select" ON public.usuarios FOR SELECT TO authenticated USING (true);
CREATE POLICY "usuarios_insert_self" ON public.usuarios FOR INSERT TO authenticated WITH CHECK (id = auth.uid());
CREATE POLICY "usuarios_update_self" ON public.usuarios FOR UPDATE TO authenticated USING (id = auth.uid()) WITH CHECK (id = auth.uid());

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  INSERT INTO public.usuarios (id, nome, email)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'nome', NEW.raw_user_meta_data->>'full_name', split_part(NEW.email,'@',1)), NEW.email)
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END; $$;
CREATE TRIGGER on_auth_user_created AFTER INSERT ON auth.users FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- UNIDADES / GALPOES
CREATE TABLE public.unidades (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  nome text NOT NULL,
  endereco text,
  responsavel text,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE public.galpoes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  unidade_id uuid NOT NULL REFERENCES public.unidades(id) ON DELETE CASCADE,
  nome text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- CLIENTES / CONTRATOS
CREATE TABLE public.clientes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  razao_social text NOT NULL,
  cnpj text UNIQUE,
  unidade_padrao_id uuid REFERENCES public.unidades(id) ON DELETE SET NULL,
  ativo boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE public.contratos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  cliente_id uuid NOT NULL REFERENCES public.clientes(id) ON DELETE CASCADE,
  nome text NOT NULL,
  modelo_operacional text,
  sla_normal_horas int NOT NULL DEFAULT 48,
  sla_urgente_horas int NOT NULL DEFAULT 8,
  servicos_habilitados jsonb NOT NULL DEFAULT '[]'::jsonb,
  exige_lacre boolean NOT NULL DEFAULT false,
  exige_triagem boolean NOT NULL DEFAULT false,
  guarda_dirigida boolean NOT NULL DEFAULT false,
  teto_etiquetas int,
  nivel_etiquetagem public.nivel_etiquetagem NOT NULL DEFAULT 'caixa',
  status public.contrato_status NOT NULL DEFAULT 'ativo',
  created_at timestamptz NOT NULL DEFAULT now()
);

-- ESTRUTURA FISICA
CREATE TABLE public.estrutura_vagas (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  galpao_id uuid NOT NULL REFERENCES public.galpoes(id) ON DELETE CASCADE,
  rua text NOT NULL,
  modulo text NOT NULL,
  coluna text NOT NULL,
  altura text NOT NULL,
  vao text NOT NULL,
  codigo_vaga text NOT NULL UNIQUE,
  tipo_caixa_compativel public.tipo_caixa_compativel NOT NULL DEFAULT 'caixa20',
  peso_max_kg numeric NOT NULL DEFAULT 20,
  status public.vaga_status NOT NULL DEFAULT 'livre',
  caixa_cativa_id uuid,
  reservada_ate timestamptz,
  reservada_por_ordem_id uuid,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE public.areas_temporarias (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  galpao_id uuid NOT NULL REFERENCES public.galpoes(id) ON DELETE CASCADE,
  tipo public.area_tipo NOT NULL,
  capacidade_max int,
  tempo_max_horas int,
  alerta_horas int,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- CAIXAS
CREATE TABLE public.caixas (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  codigo_barras text NOT NULL UNIQUE,
  identificador_interno text NOT NULL UNIQUE,
  cliente_id uuid NOT NULL REFERENCES public.clientes(id) ON DELETE RESTRICT,
  contrato_id uuid REFERENCES public.contratos(id) ON DELETE SET NULL,
  tipo public.caixa_tipo NOT NULL DEFAULT 'caixa20',
  caixa_pai_id uuid REFERENCES public.caixas(id) ON DELETE SET NULL,
  peso_kg numeric,
  espelho_1 varchar(60),
  espelho_2 varchar(60),
  status public.caixa_status NOT NULL DEFAULT 'pre_cadastrada',
  vaga_atual_id uuid REFERENCES public.estrutura_vagas(id) ON DELETE SET NULL,
  vaga_cativa_id uuid REFERENCES public.estrutura_vagas(id) ON DELETE SET NULL,
  area_temporaria_id uuid REFERENCES public.areas_temporarias(id) ON DELETE SET NULL,
  indice_movimentacao int NOT NULL DEFAULT 0,
  identificadores_externos jsonb NOT NULL DEFAULT '{}'::jsonb,
  temporalidade_ate date,
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.estrutura_vagas ADD CONSTRAINT estrutura_vagas_caixa_cativa_fk FOREIGN KEY (caixa_cativa_id) REFERENCES public.caixas(id) ON DELETE SET NULL;

-- ORDENS DE SERVICO
CREATE SEQUENCE public.os_numero_seq;
CREATE TABLE public.ordens_servico (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  numero text NOT NULL UNIQUE DEFAULT ('OS-' || to_char(now(),'YYYY') || '-' || lpad(nextval('public.os_numero_seq')::text, 6, '0')),
  tipo public.os_tipo NOT NULL,
  cliente_id uuid REFERENCES public.clientes(id) ON DELETE SET NULL,
  contrato_id uuid REFERENCES public.contratos(id) ON DELETE SET NULL,
  unidade_id uuid REFERENCES public.unidades(id) ON DELETE SET NULL,
  prioridade public.os_prioridade NOT NULL DEFAULT 'normal',
  sla_vencimento timestamptz,
  status public.os_status NOT NULL DEFAULT 'rascunho',
  operador_id uuid,
  origem text,
  destino text,
  motivo text,
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.estrutura_vagas ADD CONSTRAINT estrutura_vagas_ordem_fk FOREIGN KEY (reservada_por_ordem_id) REFERENCES public.ordens_servico(id) ON DELETE SET NULL;

CREATE TABLE public.ordem_itens (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  ordem_id uuid NOT NULL REFERENCES public.ordens_servico(id) ON DELETE CASCADE,
  caixa_id uuid REFERENCES public.caixas(id) ON DELETE SET NULL,
  status_item text NOT NULL DEFAULT 'pendente',
  vaga_destino_id uuid REFERENCES public.estrutura_vagas(id) ON DELETE SET NULL,
  executado_em timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- LOG IMUTAVEL
CREATE TABLE public.eventos_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  caixa_id uuid REFERENCES public.caixas(id) ON DELETE SET NULL,
  ordem_id uuid REFERENCES public.ordens_servico(id) ON DELETE SET NULL,
  acao text NOT NULL,
  origem text,
  destino text,
  usuario_id uuid,
  dispositivo text,
  status_antes text,
  status_depois text,
  justificativa text,
  payload jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE OR REPLACE FUNCTION public.eventos_log_imutavel()
RETURNS trigger LANGUAGE plpgsql SET search_path = public AS $$
BEGIN
  RAISE EXCEPTION 'eventos_log e append-only: alteracoes e exclusoes sao proibidas';
END; $$;
CREATE TRIGGER eventos_log_no_update BEFORE UPDATE ON public.eventos_log FOR EACH ROW EXECUTE FUNCTION public.eventos_log_imutavel();
CREATE TRIGGER eventos_log_no_delete BEFORE DELETE ON public.eventos_log FOR EACH ROW EXECUTE FUNCTION public.eventos_log_imutavel();

-- OCORRENCIAS
CREATE TABLE public.ocorrencias (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  codigo text NOT NULL,
  caixa_id uuid REFERENCES public.caixas(id) ON DELETE SET NULL,
  ordem_id uuid REFERENCES public.ordens_servico(id) ON DELETE SET NULL,
  severidade text NOT NULL DEFAULT 'media',
  descricao text,
  evidencias jsonb NOT NULL DEFAULT '[]'::jsonb,
  cliente_notificado boolean NOT NULL DEFAULT false,
  resolvida boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- REGRA: mudanca de status de caixa exige ordem de servico
CREATE OR REPLACE FUNCTION public.caixa_exige_ordem()
RETURNS trigger LANGUAGE plpgsql SET search_path = public AS $$
DECLARE
  v_ordem uuid;
  v_status public.os_status;
BEGIN
  IF NEW.status IS DISTINCT FROM OLD.status THEN
    BEGIN
      v_ordem := nullif(current_setting('app.ordem_id', true), '')::uuid;
    EXCEPTION WHEN others THEN
      v_ordem := NULL;
    END;
    IF v_ordem IS NULL THEN
      RAISE EXCEPTION 'Movimentacao sem ordem de servico: defina app.ordem_id antes de alterar o status da caixa';
    END IF;
    SELECT status INTO v_status FROM public.ordens_servico WHERE id = v_ordem;
    IF v_status IS NULL THEN
      RAISE EXCEPTION 'Ordem de servico % inexistente', v_ordem;
    END IF;
    IF v_status = 'cancelada' THEN
      RAISE EXCEPTION 'Ordem de servico cancelada nao pode movimentar caixas';
    END IF;
    INSERT INTO public.eventos_log (caixa_id, ordem_id, acao, usuario_id, status_antes, status_depois)
    VALUES (NEW.id, v_ordem, 'mudanca_status', auth.uid(), OLD.status::text, NEW.status::text);
  END IF;
  RETURN NEW;
END; $$;
CREATE TRIGGER caixas_exige_ordem BEFORE UPDATE ON public.caixas FOR EACH ROW EXECUTE FUNCTION public.caixa_exige_ordem();

-- GRANTS + RLS (dados operacionais internos: apenas autenticados)
DO $$
DECLARE t text;
BEGIN
  FOREACH t IN ARRAY ARRAY['unidades','galpoes','clientes','contratos','estrutura_vagas','areas_temporarias','caixas','ordens_servico','ordem_itens','ocorrencias']
  LOOP
    EXECUTE format('GRANT SELECT, INSERT, UPDATE, DELETE ON public.%I TO authenticated', t);
    EXECUTE format('GRANT ALL ON public.%I TO service_role', t);
    EXECUTE format('ALTER TABLE public.%I ENABLE ROW LEVEL SECURITY', t);
    EXECUTE format('CREATE POLICY "%s_auth_all" ON public.%I FOR ALL TO authenticated USING (true) WITH CHECK (true)', t, t);
  END LOOP;
END $$;

GRANT SELECT, INSERT ON public.eventos_log TO authenticated;
GRANT SELECT, INSERT ON public.eventos_log TO service_role;
ALTER TABLE public.eventos_log ENABLE ROW LEVEL SECURITY;
CREATE POLICY "eventos_log_select" ON public.eventos_log FOR SELECT TO authenticated USING (true);
CREATE POLICY "eventos_log_insert" ON public.eventos_log FOR INSERT TO authenticated WITH CHECK (true);

CREATE INDEX idx_caixas_cliente ON public.caixas(cliente_id);
CREATE INDEX idx_caixas_status ON public.caixas(status);
CREATE INDEX idx_vagas_galpao ON public.estrutura_vagas(galpao_id);
CREATE INDEX idx_os_status ON public.ordens_servico(status);
CREATE INDEX idx_eventos_caixa ON public.eventos_log(caixa_id);
