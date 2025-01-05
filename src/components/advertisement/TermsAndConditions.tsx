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
        <div className="prose prose-sm max-w-none">
          <h3>Termos e Serviços do Classificados</h3>
          <p className="text-sm text-muted-foreground">Última atualização: 13/03/2024</p>

          <p>
            Bem-vindo ao Classificados!
            Este documento estabelece os Termos e Serviços para o uso do Classificados, uma plataforma de classificados online. 
            Ao criar um anúncio ou utilizar nossos serviços, você concorda em cumprir integralmente estes Termos. 
            Caso não concorde, não poderá utilizar o site.
          </p>

          <h4>1. Objetivo do Serviço</h4>
          <p>
            1.1. O Classificados é uma plataforma para anúncios classificados voltados ao público adulto.<br />
            1.2. O site atua apenas como intermediário, disponibilizando um espaço virtual para que os usuários publiquem anúncios. 
            Não participamos de negociações, transações ou relações entre os usuários.
          </p>

          <h4>2. Cadastro e Aceitação dos Termos</h4>
          <p>
            2.1. Para criar anúncios, você deve ter pelo menos 18 anos de idade e fornecer informações precisas durante o cadastro.<br />
            2.2. Ao criar um anúncio, você declara que:
          </p>
          <ul>
            <li>É o responsável legal por todo o conteúdo publicado.</li>
            <li>Aceita que o site não tem responsabilidade sobre os anúncios ou interações realizadas.</li>
            <li>Não publicará conteúdo que viole a lei ou os Termos aqui descritos.</li>
          </ul>

          <h4>3. Responsabilidades do Usuário</h4>
          <p>
            3.1. Você é responsável por todo o conteúdo inserido em seu anúncio, incluindo texto, imagens e informações de contato.<br />
            3.2. É proibido:
          </p>
          <ul>
            <li>Publicar conteúdo que envolva menores de idade, violência, discriminação, exploração sexual ou qualquer atividade ilegal.</li>
            <li>Oferecer serviços ou produtos proibidos por lei.</li>
          </ul>
          <p>
            3.3. Você concorda em indenizar o Classificados por quaisquer reclamações, danos ou prejuízos causados por violações destes Termos.
          </p>

          <h4>4. Limitação de Responsabilidade</h4>
          <p>
            4.1. O Classificados não se responsabiliza por:
          </p>
          <ul>
            <li>A veracidade, qualidade ou legalidade dos anúncios publicados.</li>
            <li>Transações realizadas entre usuários, incluindo pagamentos, trocas ou quaisquer problemas decorrentes.</li>
            <li>Danos, prejuízos ou disputas causados por interações entre usuários.</li>
          </ul>
          <p>
            4.2. O site não monitora previamente o conteúdo publicado, mas se reserva o direito de remover anúncios que violem estes Termos ou as leis brasileiras.
          </p>

          <h4>5. Política de Privacidade</h4>
          <p>
            5.1. Coletamos e armazenamos informações fornecidas pelos usuários para fins de operação do site.<br />
            5.2. Não compartilhamos seus dados pessoais com terceiros sem consentimento, exceto em casos previstos por lei.
          </p>

          <h4>6. Rescisão e Exclusão de Conta</h4>
          <p>
            6.1. O Classificados pode, a qualquer momento, excluir anúncios ou suspender contas que violem estes Termos, sem necessidade de aviso prévio.
          </p>

          <h4>7. Disposições Gerais</h4>
          <p>
            7.1. Este site segue as leis brasileiras aplicáveis.<br />
            7.2. Qualquer disputa será resolvida no foro da comarca de São Paulo, com exclusão de qualquer outro, por mais privilegiado que seja.
          </p>
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