import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";
import { UseFormReturn } from "react-hook-form";
import { z } from "zod";
import { formSchema } from "./advertisementSchema";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

type TermsAndConditionsProps = {
  form: UseFormReturn<z.infer<typeof formSchema>>;
};

export const TermsAndConditions = ({ form }: TermsAndConditionsProps) => {
  return (
    <div className="glass-card p-6 space-y-6">
      <h2 className="text-xl font-semibold">Termos e Condições</h2>

      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          Para publicar seu anúncio, você precisa aceitar os termos e condições do site.
        </AlertDescription>
      </Alert>

      <ScrollArea className="h-[400px] rounded-md border p-4">
        <div className="prose prose-sm max-w-none space-y-6">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Termos e Serviços do Classificados</h3>
            <p className="text-sm text-muted-foreground">Última atualização: 13/03/2024</p>

            <p className="text-sm leading-relaxed">
              Bem-vindo ao Classificados!<br />
              Este documento estabelece os Termos e Serviços para o uso do Classificados, uma plataforma de classificados online. 
              Ao criar um anúncio ou utilizar nossos serviços, você concorda em cumprir integralmente estes Termos. 
              Caso não concorde, não poderá utilizar o site.
            </p>

            <div className="space-y-2">
              <h4 className="font-medium">1. Objetivo do Serviço</h4>
              <ul className="list-disc pl-6 space-y-1 text-sm">
                <li>O Classificados é uma plataforma para anúncios classificados voltados ao público adulto.</li>
                <li>O site atua apenas como intermediário, disponibilizando um espaço virtual para que os usuários publiquem anúncios. 
                    Não participamos de negociações, transações ou relações entre os usuários.</li>
              </ul>
            </div>

            <div className="space-y-2">
              <h4 className="font-medium">2. Cadastro e Aceitação dos Termos</h4>
              <ul className="list-disc pl-6 space-y-1 text-sm">
                <li>Para criar anúncios, você deve ter pelo menos 18 anos de idade e fornecer informações precisas durante o cadastro.</li>
                <li>Ao criar um anúncio, você declara que:</li>
                <ul className="list-circle pl-6 space-y-1">
                  <li>É o responsável legal por todo o conteúdo publicado.</li>
                  <li>Aceita que o site não tem responsabilidade sobre os anúncios ou interações realizadas.</li>
                  <li>Não publicará conteúdo que viole a lei ou os Termos aqui descritos.</li>
                </ul>
              </ul>
            </div>

            <div className="space-y-2">
              <h4 className="font-medium">3. Responsabilidades do Usuário</h4>
              <ul className="list-disc pl-6 space-y-1 text-sm">
                <li>Você é responsável por todo o conteúdo inserido em seu anúncio, incluindo texto, imagens e informações de contato.</li>
                <li>É proibido:</li>
                <ul className="list-circle pl-6 space-y-1">
                  <li>Publicar conteúdo que envolva menores de idade, violência, discriminação, exploração sexual ou qualquer atividade ilegal.</li>
                  <li>Oferecer serviços ou produtos proibidos por lei.</li>
                </ul>
                <li>Você concorda em indenizar o Classificados por quaisquer reclamações, danos ou prejuízos causados por violações destes Termos.</li>
              </ul>
            </div>

            <div className="space-y-2">
              <h4 className="font-medium">4. Limitação de Responsabilidade</h4>
              <ul className="list-disc pl-6 space-y-1 text-sm">
                <li>O Classificados não se responsabiliza por:</li>
                <ul className="list-circle pl-6 space-y-1">
                  <li>A veracidade, qualidade ou legalidade dos anúncios publicados.</li>
                  <li>Transações realizadas entre usuários, incluindo pagamentos, trocas ou quaisquer problemas decorrentes.</li>
                  <li>Danos, prejuízos ou disputas causados por interações entre usuários.</li>
                </ul>
                <li>O site não monitora previamente o conteúdo publicado, mas se reserva o direito de remover anúncios que violem estes Termos ou as leis brasileiras.</li>
              </ul>
            </div>

            <div className="space-y-2">
              <h4 className="font-medium">5. Política de Privacidade</h4>
              <ul className="list-disc pl-6 space-y-1 text-sm">
                <li>Coletamos e armazenamos informações fornecidas pelos usuários para fins de operação do site.</li>
                <li>Não compartilhamos seus dados pessoais com terceiros sem consentimento, exceto em casos previstos por lei.</li>
              </ul>
            </div>

            <div className="space-y-2">
              <h4 className="font-medium">6. Rescisão e Exclusão de Conta</h4>
              <p className="text-sm pl-6">
                O Classificados pode, a qualquer momento, excluir anúncios ou suspender contas que violem estes Termos, 
                sem necessidade de aviso prévio.
              </p>
            </div>

            <div className="space-y-2">
              <h4 className="font-medium">7. Disposições Gerais</h4>
              <ul className="list-disc pl-6 space-y-1 text-sm">
                <li>Este site segue as leis brasileiras aplicáveis.</li>
                <li>Qualquer disputa será resolvida no foro da comarca de São Paulo, com exclusão de qualquer outro, 
                    por mais privilegiado que seja.</li>
              </ul>
            </div>
          </div>
        </div>
      </ScrollArea>

      <FormField
        control={form.control}
        name="acceptTerms"
        render={({ field }) => (
          <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
            <FormControl>
              <Checkbox
                checked={field.value}
                onCheckedChange={field.onChange}
              />
            </FormControl>
            <div className="space-y-1 leading-none">
              <FormLabel>
                Eu li e aceito os termos e condições do site
              </FormLabel>
              <FormMessage />
            </div>
          </FormItem>
        )}
      />
    </div>
  );
};