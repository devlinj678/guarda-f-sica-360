import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Boxes, ClipboardList, MapPin, AlertTriangle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatusBadge } from "@/components/status-badge";

export const Route = createFileRoute("/_authenticated/dashboard")({
  head: () => ({
    meta: [
      { title: "Dashboard — GoDocs Guarda Física 360" },
      { name: "description", content: "Indicadores da operação de guarda física: caixas, vagas, OS e ocorrências." },
      { property: "og:title", content: "Dashboard — GoDocs 360" },
      { property: "og:description", content: "Visão geral da operação de guarda física." },
    ],
  }),
  component: Dashboard,
});

async function contar(tabela: string, filtro?: (q: any) => any) {
  let q = supabase.from(tabela as never).select("*", { count: "exact", head: true });
  if (filtro) q = filtro(q);
  const { count } = await q;
  return count ?? 0;
}

function Dashboard() {
  const { data: kpis } = useQuery({
    queryKey: ["dashboard-kpis"],
    queryFn: async () => ({
      caixas: await contar("caixas"),
      guardadas: await contar("caixas", (q) => q.eq("status", "guardada_confirmada")),
      vagasLivres: await contar("estrutura_vagas", (q) => q.eq("status", "livre")),
      osAbertas: await contar("ordens_servico", (q) =>
        q.in("status", ["aberta", "aprovada", "atribuida", "em_execucao", "emergencia"]),
      ),
      ocorrencias: await contar("ocorrencias", (q) => q.eq("resolvida", false)),
      divergencias: await contar("caixas", (q) => q.in("status", ["em_divergencia", "divergente"])),
    }),
  });

  const { data: eventos } = useQuery({
    queryKey: ["dashboard-eventos"],
    queryFn: async () => {
      const { data } = await supabase
        .from("eventos_log")
        .select("id, acao, status_antes, status_depois, created_at")
        .order("created_at", { ascending: false })
        .limit(8);
      return data ?? [];
    },
  });

  const cards = [
    { t: "Caixas cadastradas", v: kpis?.caixas, i: Boxes },
    { t: "Guarda confirmada", v: kpis?.guardadas, i: Boxes },
    { t: "Vagas livres", v: kpis?.vagasLivres, i: MapPin },
    { t: "OS em andamento", v: kpis?.osAbertas, i: ClipboardList },
    { t: "Ocorrências abertas", v: kpis?.ocorrencias, i: AlertTriangle },
    { t: "Caixas divergentes", v: kpis?.divergencias, i: AlertTriangle },
  ];

  return (
    <>
      <PageHeader titulo="Dashboard" descricao="Situação operacional consolidada da guarda física." />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map((c) => (
          <Card key={c.t}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="label-industrial text-muted-foreground">{c.t}</CardTitle>
              <c.i className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="font-display text-3xl font-bold">{c.v ?? "—"}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="font-display text-base">Últimos eventos registrados</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {(eventos ?? []).length === 0 && (
            <p className="text-sm text-muted-foreground">Nenhum evento registrado ainda.</p>
          )}
          {(eventos ?? []).map((e) => (
            <div key={e.id} className="flex flex-wrap items-center gap-3 border-b pb-2 last:border-0">
              <span className="label-industrial text-muted-foreground">
                {new Date(e.created_at).toLocaleString("pt-BR")}
              </span>
              <span className="text-sm font-medium">{e.acao}</span>
              <StatusBadge status={e.status_antes} />
              <span className="text-muted-foreground">→</span>
              <StatusBadge status={e.status_depois} />
            </div>
          ))}
        </CardContent>
      </Card>
    </>
  );
}
