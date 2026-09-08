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
import { Switch } from "@/components/ui/switch";

export const Route = createFileRoute("/_authenticated/clientes")({
  head: () => ({
    meta: [
      { title: "Clientes e Contratos — GoDocs 360" },
      { name: "description", content: "Cadastro de clientes, contratos, SLA e regras de etiquetagem." },
      { property: "og:title", content: "Clientes e Contratos — GoDocs 360" },
      { property: "og:description", content: "Gestão de clientes e contratos da guarda física." },
    ],
  }),
  component: Clientes,
});

function Clientes() {
  const qc = useQueryClient();
  const [openCliente, setOpenCliente] = useState(false);
  const [openContrato, setOpenContrato] = useState(false);

  const { data: clientes } = useQuery({
    queryKey: ["clientes"],
    queryFn: async () => {
      const { data, error } = await supabase.from("clientes").select("*").order("razao_social");
      if (error) throw error;
      return data;
    },
  });

  const { data: contratos } = useQuery({
    queryKey: ["contratos"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("contratos")
        .select("*, clientes(razao_social)")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const criarCliente = useMutation({
    mutationFn: async (form: { razao_social: string; cnpj: string; ativo: boolean }) => {
      const { error } = await supabase.from("clientes").insert(form);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Cliente cadastrado.");
      setOpenCliente(false);
      qc.invalidateQueries({ queryKey: ["clientes"] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const criarContrato = useMutation({
    mutationFn: async (form: any) => {
      const { error } = await supabase.from("contratos").insert(form);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Contrato cadastrado.");
      setOpenContrato(false);
      qc.invalidateQueries({ queryKey: ["contratos"] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  return (
    <>
      <PageHeader
        titulo="Clientes e Contratos"
        descricao="Base comercial da operação: razão social, CNPJ, SLA e serviços habilitados."
        acoes={
          <>
            <Dialog open={openCliente} onOpenChange={setOpenCliente}>
              <DialogTrigger asChild>
                <Button variant="outline">Novo cliente</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Novo cliente</DialogTitle>
                </DialogHeader>
                <form
                  className="space-y-4"
                  onSubmit={(e) => {
                    e.preventDefault();
                    const f = new FormData(e.currentTarget);
                    criarCliente.mutate({
                      razao_social: String(f.get("razao_social")),
                      cnpj: String(f.get("cnpj")),
                      ativo: f.get("ativo") === "on",
                    });
                  }}
                >
                  <div className="space-y-2">
                    <Label htmlFor="razao_social">Razão social</Label>
                    <Input id="razao_social" name="razao_social" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="cnpj">CNPJ</Label>
                    <Input id="cnpj" name="cnpj" placeholder="00.000.000/0000-00" />
                  </div>
                  <div className="flex items-center gap-3">
                    <Switch id="ativo" name="ativo" defaultChecked />
                    <Label htmlFor="ativo">Cliente ativo</Label>
                  </div>
                  <Button type="submit" className="w-full">
                    Salvar
                  </Button>
                </form>
              </DialogContent>
            </Dialog>

            <Dialog open={openContrato} onOpenChange={setOpenContrato}>
              <DialogTrigger asChild>
                <Button>Novo contrato</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Novo contrato</DialogTitle>
                </DialogHeader>
                <form
                  className="space-y-4"
                  onSubmit={(e) => {
                    e.preventDefault();
                    const f = new FormData(e.currentTarget);
                    criarContrato.mutate({
                      cliente_id: String(f.get("cliente_id")),
                      nome: String(f.get("nome")),
                      modelo_operacional: String(f.get("modelo_operacional") || ""),
                      sla_normal_horas: Number(f.get("sla_normal_horas")),
                      sla_urgente_horas: Number(f.get("sla_urgente_horas")),
                      nivel_etiquetagem: String(f.get("nivel_etiquetagem")),
                      exige_lacre: f.get("exige_lacre") === "on",
                      exige_triagem: f.get("exige_triagem") === "on",
                      guarda_dirigida: f.get("guarda_dirigida") === "on",
                    });
                  }}
                >
                  <div className="space-y-2">
                    <Label>Cliente</Label>
                    <Select name="cliente_id" required>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione" />
                      </SelectTrigger>
                      <SelectContent>
                        {(clientes ?? []).map((c) => (
                          <SelectItem key={c.id} value={c.id}>
                            {c.razao_social}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="nome">Nome do contrato</Label>
                    <Input id="nome" name="nome" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="modelo_operacional">Modelo operacional</Label>
                    <Input id="modelo_operacional" name="modelo_operacional" placeholder="Guarda + GED" />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-2">
                      <Label htmlFor="sla_normal_horas">SLA normal (h)</Label>
                      <Input id="sla_normal_horas" name="sla_normal_horas" type="number" defaultValue={48} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="sla_urgente_horas">SLA urgente (h)</Label>
                      <Input id="sla_urgente_horas" name="sla_urgente_horas" type="number" defaultValue={8} />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Nível de etiquetagem</Label>
                    <Select name="nivel_etiquetagem" defaultValue="caixa">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="caixa">Caixa</SelectItem>
                        <SelectItem value="box">Box</SelectItem>
                        <SelectItem value="documento">Documento</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex flex-wrap gap-4">
                    <label className="flex items-center gap-2 text-sm">
                      <Switch name="exige_lacre" /> Exige lacre
                    </label>
                    <label className="flex items-center gap-2 text-sm">
                      <Switch name="exige_triagem" /> Exige triagem
                    </label>
                    <label className="flex items-center gap-2 text-sm">
                      <Switch name="guarda_dirigida" /> Guarda dirigida
                    </label>
                  </div>
                  <Button type="submit" className="w-full">
                    Salvar contrato
                  </Button>
                </form>
              </DialogContent>
            </Dialog>
          </>
        }
      />

      <Card>
        <CardHeader>
          <CardTitle className="font-display text-base">Clientes</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Razão social</TableHead>
                <TableHead>CNPJ</TableHead>
                <TableHead>Situação</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {(clientes ?? []).map((c) => (
                <TableRow key={c.id}>
                  <TableCell className="font-medium">{c.razao_social}</TableCell>
                  <TableCell className="font-mono text-xs">{c.cnpj ?? "—"}</TableCell>
                  <TableCell>
                    <StatusBadge status={c.ativo ? "ativo" : "inativo"} />
                  </TableCell>
                </TableRow>
              ))}
              {(clientes ?? []).length === 0 && (
                <TableRow>
                  <TableCell colSpan={3} className="text-muted-foreground">
                    Nenhum cliente cadastrado.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="font-display text-base">Contratos</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Contrato</TableHead>
                <TableHead>Cliente</TableHead>
                <TableHead>SLA normal / urgente</TableHead>
                <TableHead>Etiquetagem</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {(contratos ?? []).map((c: any) => (
                <TableRow key={c.id}>
                  <TableCell className="font-medium">{c.nome}</TableCell>
                  <TableCell>{c.clientes?.razao_social ?? "—"}</TableCell>
                  <TableCell className="font-mono text-xs">
                    {c.sla_normal_horas}h / {c.sla_urgente_horas}h
                  </TableCell>
                  <TableCell>
                    <StatusBadge status={c.nivel_etiquetagem} />
                  </TableCell>
                  <TableCell>
                    <StatusBadge status={c.status} />
                  </TableCell>
                </TableRow>
              ))}
              {(contratos ?? []).length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="text-muted-foreground">
                    Nenhum contrato cadastrado.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </>
  );
}
