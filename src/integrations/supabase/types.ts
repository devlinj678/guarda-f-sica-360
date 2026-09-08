export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      areas_temporarias: {
        Row: {
          alerta_horas: number | null
          capacidade_max: number | null
          created_at: string
          galpao_id: string
          id: string
          tempo_max_horas: number | null
          tipo: Database["public"]["Enums"]["area_tipo"]
        }
        Insert: {
          alerta_horas?: number | null
          capacidade_max?: number | null
          created_at?: string
          galpao_id: string
          id?: string
          tempo_max_horas?: number | null
          tipo: Database["public"]["Enums"]["area_tipo"]
        }
        Update: {
          alerta_horas?: number | null
          capacidade_max?: number | null
          created_at?: string
          galpao_id?: string
          id?: string
          tempo_max_horas?: number | null
          tipo?: Database["public"]["Enums"]["area_tipo"]
        }
        Relationships: [
          {
            foreignKeyName: "areas_temporarias_galpao_id_fkey"
            columns: ["galpao_id"]
            isOneToOne: false
            referencedRelation: "galpoes"
            referencedColumns: ["id"]
          },
        ]
      }
      caixas: {
        Row: {
          area_temporaria_id: string | null
          caixa_pai_id: string | null
          cliente_id: string
          codigo_barras: string
          contrato_id: string | null
          created_at: string
          espelho_1: string | null
          espelho_2: string | null
          id: string
          identificador_interno: string
          identificadores_externos: Json
          indice_movimentacao: number
          peso_kg: number | null
          status: Database["public"]["Enums"]["caixa_status"]
          temporalidade_ate: string | null
          tipo: Database["public"]["Enums"]["caixa_tipo"]
          vaga_atual_id: string | null
          vaga_cativa_id: string | null
        }
        Insert: {
          area_temporaria_id?: string | null
          caixa_pai_id?: string | null
          cliente_id: string
          codigo_barras: string
          contrato_id?: string | null
          created_at?: string
          espelho_1?: string | null
          espelho_2?: string | null
          id?: string
          identificador_interno: string
          identificadores_externos?: Json
          indice_movimentacao?: number
          peso_kg?: number | null
          status?: Database["public"]["Enums"]["caixa_status"]
          temporalidade_ate?: string | null
          tipo?: Database["public"]["Enums"]["caixa_tipo"]
          vaga_atual_id?: string | null
          vaga_cativa_id?: string | null
        }
        Update: {
          area_temporaria_id?: string | null
          caixa_pai_id?: string | null
          cliente_id?: string
          codigo_barras?: string
          contrato_id?: string | null
          created_at?: string
          espelho_1?: string | null
          espelho_2?: string | null
          id?: string
          identificador_interno?: string
          identificadores_externos?: Json
          indice_movimentacao?: number
          peso_kg?: number | null
          status?: Database["public"]["Enums"]["caixa_status"]
          temporalidade_ate?: string | null
          tipo?: Database["public"]["Enums"]["caixa_tipo"]
          vaga_atual_id?: string | null
          vaga_cativa_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "caixas_area_temporaria_id_fkey"
            columns: ["area_temporaria_id"]
            isOneToOne: false
            referencedRelation: "areas_temporarias"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "caixas_caixa_pai_id_fkey"
            columns: ["caixa_pai_id"]
            isOneToOne: false
            referencedRelation: "caixas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "caixas_cliente_id_fkey"
            columns: ["cliente_id"]
            isOneToOne: false
            referencedRelation: "clientes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "caixas_contrato_id_fkey"
            columns: ["contrato_id"]
            isOneToOne: false
            referencedRelation: "contratos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "caixas_vaga_atual_id_fkey"
            columns: ["vaga_atual_id"]
            isOneToOne: false
            referencedRelation: "estrutura_vagas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "caixas_vaga_cativa_id_fkey"
            columns: ["vaga_cativa_id"]
            isOneToOne: false
            referencedRelation: "estrutura_vagas"
            referencedColumns: ["id"]
          },
        ]
      }
      clientes: {
        Row: {
          ativo: boolean
          cnpj: string | null
          created_at: string
          id: string
          razao_social: string
          unidade_padrao_id: string | null
        }
        Insert: {
          ativo?: boolean
          cnpj?: string | null
          created_at?: string
          id?: string
          razao_social: string
          unidade_padrao_id?: string | null
        }
        Update: {
          ativo?: boolean
          cnpj?: string | null
          created_at?: string
          id?: string
          razao_social?: string
          unidade_padrao_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "clientes_unidade_padrao_id_fkey"
            columns: ["unidade_padrao_id"]
            isOneToOne: false
            referencedRelation: "unidades"
            referencedColumns: ["id"]
          },
        ]
      }
      contratos: {
        Row: {
          cliente_id: string
          created_at: string
          exige_lacre: boolean
          exige_triagem: boolean
          guarda_dirigida: boolean
          id: string
          modelo_operacional: string | null
          nivel_etiquetagem: Database["public"]["Enums"]["nivel_etiquetagem"]
          nome: string
          servicos_habilitados: Json
          sla_normal_horas: number
          sla_urgente_horas: number
          status: Database["public"]["Enums"]["contrato_status"]
          teto_etiquetas: number | null
        }
        Insert: {
          cliente_id: string
          created_at?: string
          exige_lacre?: boolean
          exige_triagem?: boolean
          guarda_dirigida?: boolean
          id?: string
          modelo_operacional?: string | null
          nivel_etiquetagem?: Database["public"]["Enums"]["nivel_etiquetagem"]
          nome: string
          servicos_habilitados?: Json
          sla_normal_horas?: number
          sla_urgente_horas?: number
          status?: Database["public"]["Enums"]["contrato_status"]
          teto_etiquetas?: number | null
        }
        Update: {
          cliente_id?: string
          created_at?: string
          exige_lacre?: boolean
          exige_triagem?: boolean
          guarda_dirigida?: boolean
          id?: string
          modelo_operacional?: string | null
          nivel_etiquetagem?: Database["public"]["Enums"]["nivel_etiquetagem"]
          nome?: string
          servicos_habilitados?: Json
          sla_normal_horas?: number
          sla_urgente_horas?: number
          status?: Database["public"]["Enums"]["contrato_status"]
          teto_etiquetas?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "contratos_cliente_id_fkey"
            columns: ["cliente_id"]
            isOneToOne: false
            referencedRelation: "clientes"
            referencedColumns: ["id"]
          },
        ]
      }
      estrutura_vagas: {
        Row: {
          altura: string
          caixa_cativa_id: string | null
          codigo_vaga: string
          coluna: string
          created_at: string
          galpao_id: string
          id: string
          modulo: string
          peso_max_kg: number
          reservada_ate: string | null
          reservada_por_ordem_id: string | null
          rua: string
          status: Database["public"]["Enums"]["vaga_status"]
          tipo_caixa_compativel: Database["public"]["Enums"]["tipo_caixa_compativel"]
          vao: string
        }
        Insert: {
          altura: string
          caixa_cativa_id?: string | null
          codigo_vaga: string
          coluna: string
          created_at?: string
          galpao_id: string
          id?: string
          modulo: string
          peso_max_kg?: number
          reservada_ate?: string | null
          reservada_por_ordem_id?: string | null
          rua: string
          status?: Database["public"]["Enums"]["vaga_status"]
          tipo_caixa_compativel?: Database["public"]["Enums"]["tipo_caixa_compativel"]
          vao: string
        }
        Update: {
          altura?: string
          caixa_cativa_id?: string | null
          codigo_vaga?: string
          coluna?: string
          created_at?: string
          galpao_id?: string
          id?: string
          modulo?: string
          peso_max_kg?: number
          reservada_ate?: string | null
          reservada_por_ordem_id?: string | null
          rua?: string
          status?: Database["public"]["Enums"]["vaga_status"]
          tipo_caixa_compativel?: Database["public"]["Enums"]["tipo_caixa_compativel"]
          vao?: string
        }
        Relationships: [
          {
            foreignKeyName: "estrutura_vagas_caixa_cativa_fk"
            columns: ["caixa_cativa_id"]
            isOneToOne: false
            referencedRelation: "caixas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "estrutura_vagas_galpao_id_fkey"
            columns: ["galpao_id"]
            isOneToOne: false
            referencedRelation: "galpoes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "estrutura_vagas_ordem_fk"
            columns: ["reservada_por_ordem_id"]
            isOneToOne: false
            referencedRelation: "ordens_servico"
            referencedColumns: ["id"]
          },
        ]
      }
      eventos_log: {
        Row: {
          acao: string
          caixa_id: string | null
          created_at: string
          destino: string | null
          dispositivo: string | null
          id: string
          justificativa: string | null
          ordem_id: string | null
          origem: string | null
          payload: Json
          status_antes: string | null
          status_depois: string | null
          usuario_id: string | null
        }
        Insert: {
          acao: string
          caixa_id?: string | null
          created_at?: string
          destino?: string | null
          dispositivo?: string | null
          id?: string
          justificativa?: string | null
          ordem_id?: string | null
          origem?: string | null
          payload?: Json
          status_antes?: string | null
          status_depois?: string | null
          usuario_id?: string | null
        }
        Update: {
          acao?: string
          caixa_id?: string | null
          created_at?: string
          destino?: string | null
          dispositivo?: string | null
          id?: string
          justificativa?: string | null
          ordem_id?: string | null
          origem?: string | null
          payload?: Json
          status_antes?: string | null
          status_depois?: string | null
          usuario_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "eventos_log_caixa_id_fkey"
            columns: ["caixa_id"]
            isOneToOne: false
            referencedRelation: "caixas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "eventos_log_ordem_id_fkey"
            columns: ["ordem_id"]
            isOneToOne: false
            referencedRelation: "ordens_servico"
            referencedColumns: ["id"]
          },
        ]
      }
      galpoes: {
        Row: {
          created_at: string
          id: string
          nome: string
          unidade_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          nome: string
          unidade_id: string
        }
        Update: {
          created_at?: string
          id?: string
          nome?: string
          unidade_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "galpoes_unidade_id_fkey"
            columns: ["unidade_id"]
            isOneToOne: false
            referencedRelation: "unidades"
            referencedColumns: ["id"]
          },
        ]
      }
      ocorrencias: {
        Row: {
          caixa_id: string | null
          cliente_notificado: boolean
          codigo: string
          created_at: string
          descricao: string | null
          evidencias: Json
          id: string
          ordem_id: string | null
          resolvida: boolean
          severidade: string
        }
        Insert: {
          caixa_id?: string | null
          cliente_notificado?: boolean
          codigo: string
          created_at?: string
          descricao?: string | null
          evidencias?: Json
          id?: string
          ordem_id?: string | null
          resolvida?: boolean
          severidade?: string
        }
        Update: {
          caixa_id?: string | null
          cliente_notificado?: boolean
          codigo?: string
          created_at?: string
          descricao?: string | null
          evidencias?: Json
          id?: string
          ordem_id?: string | null
          resolvida?: boolean
          severidade?: string
        }
        Relationships: [
          {
            foreignKeyName: "ocorrencias_caixa_id_fkey"
            columns: ["caixa_id"]
            isOneToOne: false
            referencedRelation: "caixas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ocorrencias_ordem_id_fkey"
            columns: ["ordem_id"]
            isOneToOne: false
            referencedRelation: "ordens_servico"
            referencedColumns: ["id"]
          },
        ]
      }
      ordem_itens: {
        Row: {
          caixa_id: string | null
          created_at: string
          executado_em: string | null
          id: string
          ordem_id: string
          status_item: string
          vaga_destino_id: string | null
        }
        Insert: {
          caixa_id?: string | null
          created_at?: string
          executado_em?: string | null
          id?: string
          ordem_id: string
          status_item?: string
          vaga_destino_id?: string | null
        }
        Update: {
          caixa_id?: string | null
          created_at?: string
          executado_em?: string | null
          id?: string
          ordem_id?: string
          status_item?: string
          vaga_destino_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "ordem_itens_caixa_id_fkey"
            columns: ["caixa_id"]
            isOneToOne: false
            referencedRelation: "caixas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ordem_itens_ordem_id_fkey"
            columns: ["ordem_id"]
            isOneToOne: false
            referencedRelation: "ordens_servico"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ordem_itens_vaga_destino_id_fkey"
            columns: ["vaga_destino_id"]
            isOneToOne: false
            referencedRelation: "estrutura_vagas"
            referencedColumns: ["id"]
          },
        ]
      }
      ordens_servico: {
        Row: {
          cliente_id: string | null
          contrato_id: string | null
          created_at: string
          destino: string | null
          id: string
          motivo: string | null
          numero: string
          operador_id: string | null
          origem: string | null
          prioridade: Database["public"]["Enums"]["os_prioridade"]
          sla_vencimento: string | null
          status: Database["public"]["Enums"]["os_status"]
          tipo: Database["public"]["Enums"]["os_tipo"]
          unidade_id: string | null
        }
        Insert: {
          cliente_id?: string | null
          contrato_id?: string | null
          created_at?: string
          destino?: string | null
          id?: string
          motivo?: string | null
          numero?: string
          operador_id?: string | null
          origem?: string | null
          prioridade?: Database["public"]["Enums"]["os_prioridade"]
          sla_vencimento?: string | null
          status?: Database["public"]["Enums"]["os_status"]
          tipo: Database["public"]["Enums"]["os_tipo"]
          unidade_id?: string | null
        }
        Update: {
          cliente_id?: string | null
          contrato_id?: string | null
          created_at?: string
          destino?: string | null
          id?: string
          motivo?: string | null
          numero?: string
          operador_id?: string | null
          origem?: string | null
          prioridade?: Database["public"]["Enums"]["os_prioridade"]
          sla_vencimento?: string | null
          status?: Database["public"]["Enums"]["os_status"]
          tipo?: Database["public"]["Enums"]["os_tipo"]
          unidade_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "ordens_servico_cliente_id_fkey"
            columns: ["cliente_id"]
            isOneToOne: false
            referencedRelation: "clientes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ordens_servico_contrato_id_fkey"
            columns: ["contrato_id"]
            isOneToOne: false
            referencedRelation: "contratos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ordens_servico_unidade_id_fkey"
            columns: ["unidade_id"]
            isOneToOne: false
            referencedRelation: "unidades"
            referencedColumns: ["id"]
          },
        ]
      }
      unidades: {
        Row: {
          created_at: string
          endereco: string | null
          id: string
          nome: string
          responsavel: string | null
        }
        Insert: {
          created_at?: string
          endereco?: string | null
          id?: string
          nome: string
          responsavel?: string | null
        }
        Update: {
          created_at?: string
          endereco?: string | null
          id?: string
          nome?: string
          responsavel?: string | null
        }
        Relationships: []
      }
      usuarios: {
        Row: {
          created_at: string
          email: string | null
          id: string
          nome: string
          perfil: Database["public"]["Enums"]["perfil_usuario"]
          unidades_permitidas: string[]
        }
        Insert: {
          created_at?: string
          email?: string | null
          id: string
          nome?: string
          perfil?: Database["public"]["Enums"]["perfil_usuario"]
          unidades_permitidas?: string[]
        }
        Update: {
          created_at?: string
          email?: string | null
          id?: string
          nome?: string
          perfil?: Database["public"]["Enums"]["perfil_usuario"]
          unidades_permitidas?: string[]
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      area_tipo:
        | "recebimento"
        | "conferencia"
        | "separacao_guarda"
        | "separacao_ged"
        | "producao"
        | "expedicao"
        | "divergencia"
        | "quarentena"
        | "auditoria"
        | "implantacao"
        | "retirada_presencial"
      caixa_status:
        | "pre_cadastrada"
        | "coletada"
        | "em_transporte"
        | "recebida"
        | "em_conferencia"
        | "em_divergencia"
        | "aguardando_inbound"
        | "aguardando_enderecamento"
        | "posicao_reservada"
        | "guardada_confirmada"
        | "em_operacao"
        | "em_ged_producao"
        | "separada"
        | "em_atendimento"
        | "emprestada"
        | "aguardando_devolucao"
        | "conteudo_parcial"
        | "em_transferencia"
        | "em_transito"
        | "em_auditoria"
        | "divergente"
        | "bloqueada"
        | "bloqueio_legal"
        | "em_quarentena"
        | "aguardando_expurgo"
        | "expurgada"
        | "saida_definitiva"
        | "extraviada"
        | "cancelada"
      caixa_tipo: "caixa20" | "box5" | "documento"
      contrato_status: "ativo" | "suspenso" | "inativo"
      nivel_etiquetagem: "caixa" | "box" | "documento"
      os_prioridade: "normal" | "urgente"
      os_status:
        | "rascunho"
        | "aberta"
        | "aprovada"
        | "atribuida"
        | "em_execucao"
        | "pausada"
        | "com_divergencia"
        | "aguardando_aprovacao"
        | "emergencia"
        | "concluida"
        | "cancelada"
        | "vencida"
        | "reaberta"
      os_tipo:
        | "GUARDA"
        | "GED"
        | "EXPURGO"
        | "DEVOLUCAO"
        | "TRANSFERENCIA"
        | "COLETA"
        | "ATENDIMENTO"
        | "INVENTARIO"
        | "MOV-01"
        | "MOV-02"
        | "MOV-03"
        | "MOV-04"
        | "MOV-05"
        | "MOV-06"
        | "MOV-07"
        | "MOV-08"
        | "MOV-09"
        | "MOV-10"
      perfil_usuario:
        | "admin_global"
        | "admin_unidade"
        | "gestor_operacional"
        | "lider_galpao"
        | "operador_galpao"
        | "motorista"
        | "auditor"
        | "comercial"
        | "financeiro"
        | "cliente"
        | "cpad"
      tipo_caixa_compativel: "caixa20" | "box5" | "especial"
      vaga_status:
        | "livre"
        | "reservada"
        | "ocupada"
        | "bloqueada"
        | "neutra"
        | "divergente"
        | "em_auditoria"
        | "inativa"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      area_tipo: [
        "recebimento",
        "conferencia",
        "separacao_guarda",
        "separacao_ged",
        "producao",
        "expedicao",
        "divergencia",
        "quarentena",
        "auditoria",
        "implantacao",
        "retirada_presencial",
      ],
      caixa_status: [
        "pre_cadastrada",
        "coletada",
        "em_transporte",
        "recebida",
        "em_conferencia",
        "em_divergencia",
        "aguardando_inbound",
        "aguardando_enderecamento",
        "posicao_reservada",
        "guardada_confirmada",
        "em_operacao",
        "em_ged_producao",
        "separada",
        "em_atendimento",
        "emprestada",
        "aguardando_devolucao",
        "conteudo_parcial",
        "em_transferencia",
        "em_transito",
        "em_auditoria",
        "divergente",
        "bloqueada",
        "bloqueio_legal",
        "em_quarentena",
        "aguardando_expurgo",
        "expurgada",
        "saida_definitiva",
        "extraviada",
        "cancelada",
      ],
      caixa_tipo: ["caixa20", "box5", "documento"],
      contrato_status: ["ativo", "suspenso", "inativo"],
      nivel_etiquetagem: ["caixa", "box", "documento"],
      os_prioridade: ["normal", "urgente"],
      os_status: [
        "rascunho",
        "aberta",
        "aprovada",
        "atribuida",
        "em_execucao",
        "pausada",
        "com_divergencia",
        "aguardando_aprovacao",
        "emergencia",
        "concluida",
        "cancelada",
        "vencida",
        "reaberta",
      ],
      os_tipo: [
        "GUARDA",
        "GED",
        "EXPURGO",
        "DEVOLUCAO",
        "TRANSFERENCIA",
        "COLETA",
        "ATENDIMENTO",
        "INVENTARIO",
        "MOV-01",
        "MOV-02",
        "MOV-03",
        "MOV-04",
        "MOV-05",
        "MOV-06",
        "MOV-07",
        "MOV-08",
        "MOV-09",
        "MOV-10",
      ],
      perfil_usuario: [
        "admin_global",
        "admin_unidade",
        "gestor_operacional",
        "lider_galpao",
        "operador_galpao",
        "motorista",
        "auditor",
        "comercial",
        "financeiro",
        "cliente",
        "cpad",
      ],
      tipo_caixa_compativel: ["caixa20", "box5", "especial"],
      vaga_status: [
        "livre",
        "reservada",
        "ocupada",
        "bloqueada",
        "neutra",
        "divergente",
        "em_auditoria",
        "inativa",
      ],
    },
  },
} as const
