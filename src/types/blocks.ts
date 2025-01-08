export type BlockReasonType = 
  | "inappropriate_content"
  | "spam"
  | "fake_account"
  | "violation"
  | "other";

export const getBlockReasonLabel = (reason: BlockReasonType): string => {
  switch (reason) {
    case "inappropriate_content":
      return "Conteúdo Inapropriado";
    case "spam":
      return "Spam";
    case "fake_account":
      return "Conta Falsa";
    case "violation":
      return "Violação de Termos";
    case "other":
      return "Outro";
  }
};