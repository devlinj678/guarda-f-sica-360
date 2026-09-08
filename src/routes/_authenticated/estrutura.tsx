import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { PageHeader } from "@/components/page-header";
import { StatusBadge } from "@/components/status-badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export const Route = createFileRoute("/_authenticated/estrutura")({
  head: () => ({
    meta: [
      { title: "Estrutura Física — GoDocs 360" },
      { name: "description", content: "Unidades, galpões, vagas de endereçamento e áreas temporárias." },
      { property: "og:title", content: "Estrutura Física — GoDocs 360" },
      { property: "og:description", content: "Mapa físico dos galpões e vagas de guarda." },
    ],
  }),
  component: Estrutura,
});

const areaTipos = [
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
];

function Estrutura() {
  const qc = useQueryClient();
  const [openVaga, setOpenVaga] = useState(false);

  const { data: unidades } = useQuery({
    queryKey: ["unidades"],
    queryFn: async () => (await supabase.from("unidades").select("*").order("nome")).data ?? [],
  });
  const { data: galpoes } = useQuery({
    queryKey: ["galpoes"],
    queryFn: async () =>
      (await supabase.from("galpoes").select("*, unidades(nome)").order("nome")).data ?? [],
  });
  const { data: vagas } = useQuery({
    queryKey: ["vagas"],
    queryFn: async () =>
      (await supabase.from("estrutura_vagas").select("*").order("codigo_vaga").limit(500)).data ?? [],
  });
  const { data: areas } = useQuery({
    queryKey: ["areas"],
    queryFn: async () =>
      (await supabase.from("areas_temporarias").select("*, galpoes(nome)").order("tipo")).data ?? [],
  });

  const mut = (tabela: string, chave: string, msg: string) =>
    // eslint-disable-next-line react-hooks/rules-of-hooks
    ({
      mutationFn: async (form: any) => {
        const { error } = await supabase.from(tabela as never).insert(form);
        if (error) throw error;
      },
      onSuccess: () => {
        toast.success(msg);
        qc.invalidateQueries({ queryKey: [chave] });
      },
      onError: (e: Error) => toast.error(e.message),
    });

  const criarUnidade = useMutation(mut("unidades", "unidades", "Unidade criada."));
  const criarGalpao = useMutation(mut("galpoes", "galpoes", "Galpão criado."));
  const criarArea = useMutation(mut("areas_temporarias", "areas", "Área temporária criada."));
  const criarVaga = useMutation({
    ...mut("estrutura_vagas", "vagas", "Vaga criada."),
    onSuccess: () => {
      toast.success("Vaga criada.");
      setOpenVaga(false);
      qc.invalidateQueries({ queryKey: ["vagas"] });
    },
  });

  return (
    <>
      <PageHeader
        titulo="Estrutura Física"
        descricao="Unidades, galpões, vagas (R01-M01-C01-A01-V01) e áreas temporárias."
      />

      <Tabs defaultValue="vagas">
        <TabsList>
          <TabsTrigger value="vagas">Vagas</TabsTrigger>
          <TabsTrigger value="galpoes">Unidades e galpões</TabsTrigger>
          <TabsTrigger value="areas">Áreas temporárias</TabsTrigger>
        </TabsList>

        <TabsContent value="vagas" className="pt-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="font-display text-base">Vagas de endereçamento</CardTitle>
              <Dialog open={openVaga} onOpenChange={setOpenVaga}>
                <DialogTrigger asChild>
                  <Button size="sm">Nova vaga</Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Nova vaga</DialogTitle>
                  </DialogHeader>
                  <form
                    className="space-y-4"
                    onSubmit={(e) => {
                      e.preventDefault();
                      const f = new FormData(e.currentTarget);
                      const p = (k: string) => String(f.get(k)).padStart(2, "0");
                      criarVaga.mutate({
                        galpao_id: String(f.get("galpao_id")),
                        rua: p("rua"),
                        modulo: p("modulo"),
                        coluna: p("coluna"),
                        altura: p("altura"),
                        vao: p("vao"),
                        codigo_vaga: `R${p("rua")}-M${p("modulo")}-C${p("coluna")}-A${p("altura")}-V${p("vao")}`,
                        tipo_caixa_compativel: String(f.get("tipo")),
                        peso_max_kg: Number(f.get("peso_max_kg")),
                      });
                    }}
                  >
                    <div className="space-y-2">
                      <Label>Galpão</Label>
                      <Select name="galpao_id" required>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione" />
                        </SelectTrigger>
                        <SelectContent>
                          {(galpoes ?? []).map((g: any) => (
                            <SelectItem key={g.id} value={g.id}>
                              {g.unidades?.nome} · {g.nome}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid grid-cols-5 gap-2">
                      {["rua", "modulo", "coluna", "altura", "vao"].map((c) => (
                        <div key={c} className="space-y-2">
                          <Label htmlFor={c} className="label-industrial">
                            {c}
                          </Label>
                          <Input id={c} name={c} defaultValue="1" required />
                        </div>
                      ))}
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-2">
                        <Label>Tipo compatível</Label>
                        <Select name="tipo" defaultValue="caixa20">
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="caixa20">Caixa 20kg</SelectItem>
                            <SelectItem value="box5">Box 5kg</SelectItem>
                            <SelectItem value="especial">Especial</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="peso_max_kg">Peso máx. (kg)</Label>
                        <Input id="peso_max_kg" name="peso_max_kg" type="number" step="0.1" defaultValue={20} />
                      </div>
                    </div>
                    <Button type="submit" className="w-full">
                      Criar vaga
                    </Button>
                  </form>
                </DialogContent>
              </Dialog>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Código</TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead>Peso máx.</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {(vagas ?? []).map((v: any) => (
                    <TableRow key={v.id}>
                      <TableCell className="font-mono text-xs font-medium">{v.codigo_vaga}</TableCell>
                      <TableCell>{v.tipo_caixa_compativel}</TableCell>
                      <TableCell>{v.peso_max_kg} kg</TableCell>
                      <TableCell>
                        <StatusBadge status={v.status} />
                      </TableCell>
                    </TableRow>
                  ))}
                  {(vagas ?? []).length === 0 && (
                    <TableRow>
                      <TableCell colSpan={4} className="text-muted-foreground">
                        Nenhuma vaga cadastrada.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="galpoes" className="grid gap-4 pt-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="font-display text-base">Unidades</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <form
                className="flex flex-wrap gap-2"
                onSubmit={(e) => {
                  e.preventDefault();
                  const f = new FormData(e.currentTarget);
                  criarUnidade.mutate({
                    nome: String(f.get("nome")),
                    endereco: String(f.get("endereco") || ""),
                    responsavel: String(f.get("responsavel") || ""),
                  });
                  e.currentTarget.reset();
                }}
              >
                <Input name="nome" placeholder="Nome da unidade" required className="flex-1" />
                <Input name="endereco" placeholder="Endereço" className="flex-1" />
                <Input name="responsavel" placeholder="Responsável" className="flex-1" />
                <Button type="submit">Adicionar</Button>
              </form>
              <ul className="space-y-2 text-sm">
                {(unidades ?? []).map((u: any) => (
                  <li key={u.id} className="border-b pb-2">
                    <span className="font-medium">{u.nome}</span>
                    <span className="text-muted-foreground"> · {u.endereco || "sem endereço"}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="font-display text-base">Galpões</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <form
                className="flex flex-wrap gap-2"
                onSubmit={(e) => {
                  e.preventDefault();
                  const f = new FormData(e.currentTarget);
                  criarGalpao.mutate({ unidade_id: String(f.get("unidade_id")), nome: String(f.get("nome")) });
                  e.currentTarget.reset();
                }}
              >
                <Select name="unidade_id" required>
                  <SelectTrigger className="flex-1">
                    <SelectValue placeholder="Unidade" />
                  </SelectTrigger>
                  <SelectContent>
                    {(unidades ?? []).map((u: any) => (
                      <SelectItem key={u.id} value={u.id}>
                        {u.nome}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Input name="nome" placeholder="Nome do galpão" required className="flex-1" />
                <Button type="submit">Adicionar</Button>
              </form>
              <ul className="space-y-2 text-sm">
                {(galpoes ?? []).map((g: any) => (
                  <li key={g.id} className="border-b pb-2">
                    <span className="font-medium">{g.nome}</span>
                    <span className="text-muted-foreground"> · {g.unidades?.nome}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="areas" className="pt-4">
          <Card>
            <CardHeader>
              <CardTitle className="font-display text-base">Áreas temporárias</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <form
                className="flex flex-wrap gap-2"
                onSubmit={(e) => {
                  e.preventDefault();
                  const f = new FormData(e.currentTarget);
                  criarArea.mutate({
                    galpao_id: String(f.get("galpao_id")),
                    tipo: String(f.get("tipo")),
                    capacidade_max: Number(f.get("capacidade_max") || 0) || null,
                    tempo_max_horas: Number(f.get("tempo_max_horas") || 0) || null,
                    alerta_horas: Number(f.get("alerta_horas") || 0) || null,
                  });
                  e.currentTarget.reset();
                }}
              >
                <Select name="galpao_id" required>
                  <SelectTrigger className="w-52">
                    <SelectValue placeholder="Galpão" />
                  </SelectTrigger>
                  <SelectContent>
                    {(galpoes ?? []).map((g: any) => (
                      <SelectItem key={g.id} value={g.id}>
                        {g.nome}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select name="tipo" required>
                  <SelectTrigger className="w-52">
                    <SelectValue placeholder="Tipo de área" />
                  </SelectTrigger>
                  <SelectContent>
                    {areaTipos.map((t) => (
                      <SelectItem key={t} value={t}>
                        {t.replaceAll("_", " ")}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Input name="capacidade_max" type="number" placeholder="Capacidade" className="w-32" />
                <Input name="tempo_max_horas" type="number" placeholder="Tempo máx (h)" className="w-36" />
                <Input name="alerta_horas" type="number" placeholder="Alerta (h)" className="w-32" />
                <Button type="submit">Adicionar</Button>
              </form>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Tipo</TableHead>
                    <TableHead>Galpão</TableHead>
                    <TableHead>Capacidade</TableHead>
                    <TableHead>Tempo máx.</TableHead>
                    <TableHead>Alerta</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {(areas ?? []).map((a: any) => (
                    <TableRow key={a.id}>
                      <TableCell className="font-medium">{a.tipo.replaceAll("_", " ")}</TableCell>
                      <TableCell>{a.galpoes?.nome}</TableCell>
                      <TableCell>{a.capacidade_max ?? "—"}</TableCell>
                      <TableCell>{a.tempo_max_horas ? `${a.tempo_max_horas}h` : "—"}</TableCell>
                      <TableCell>{a.alerta_horas ? `${a.alerta_horas}h` : "—"}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </>
  );
}
