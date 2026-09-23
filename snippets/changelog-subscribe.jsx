// Salvar em /snippets/changelog-subscribe.jsx no repositório da doc
// Hooks (useState etc.) já vêm injetados pelo Mintlify: não importar React.
// Barra FIXA no rodapé: fica visível em qualquer posição de scroll / deep-link.
// Cores do container/campo via classes Tailwind (variante dark:) pra acompanhar o toggle de tema.

export const ChangelogSubscribe = ({ webhookUrl, accentColor = "#2563EB" }) => {
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState(""); // honeypot: humano não vê, bot preenche
  const [status, setStatus] = useState("idle"); // idle | loading | success | invalid | error
  const [closed, setClosed] = useState(false); // ✕: some pela sessão, volta ao recarregar

  if (closed) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (company) return setStatus("success"); // bot: finge sucesso e ignora

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return setStatus("invalid");

    setStatus("loading");
    try {
      const res = await fetch(webhookUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim().toLowerCase(), source: "changelog-docs" }),
      });
      if (!res.ok) throw new Error();
      setStatus("success");
      setEmail("");
    } catch {
      setStatus("error");
    }
  };

  const messages = {
    success: "Inscrição feita. Você vai receber as próximas novidades por email.",
    invalid: "Esse email não parece válido. Confere e tenta de novo.",
    error: "Não deu pra concluir a inscrição agora. Tenta de novo em alguns minutos.",
  };

  return (
    <>
      {/* reserva espaço no fim do conteúdo pra barra fixa não cobrir a última novidade */}
      <div aria-hidden="true" style={{ height: 76 }} />
      <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-gray-200 bg-white dark:border-zinc-800 dark:bg-zinc-950">
      <div className="mx-auto flex max-w-5xl flex-wrap items-center gap-x-4 gap-y-2 px-4 py-3">
        {status === "success" ? (
          <p role="status" className="m-0 flex-1 text-sm text-gray-700 dark:text-zinc-200">
            {messages.success}
          </p>
        ) : (
          <>
            <div className="flex-1" style={{ minWidth: 180 }}>
              <p className="m-0 text-sm font-semibold text-gray-900 dark:text-zinc-50">
                Receba as novidades por email
              </p>
              {status === "invalid" || status === "error" ? (
                <p role="status" className="m-0 text-xs text-gray-500 dark:text-zinc-400">
                  {messages[status]}
                </p>
              ) : (
                <p className="m-0 hidden text-xs text-gray-500 dark:text-zinc-400 sm:block">
                  Um resumo das features novas da Solomon. Dá pra cancelar quando quiser.
                </p>
              )}
            </div>

            <form
              onSubmit={handleSubmit}
              className="flex flex-1 flex-wrap items-center justify-end gap-2"
              style={{ minWidth: 240 }}
            >
              <input
                type="text"
                name="company"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                tabIndex={-1}
                autoComplete="off"
                aria-hidden="true"
                style={{ position: "absolute", left: "-9999px" }}
              />
              <input
                type="email"
                placeholder="seu@email.com"
                aria-label="Seu email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (status !== "loading") setStatus("idle");
                }}
                className="flex-1 rounded-lg border border-gray-300 bg-transparent px-3 py-2 text-sm text-gray-900 dark:border-zinc-700 dark:text-zinc-50"
                style={{ minWidth: 160 }}
              />
              <button
                type="submit"
                disabled={status === "loading"}
                className="rounded-lg px-4 py-2 text-sm font-semibold text-white disabled:opacity-60"
                style={{ background: accentColor, cursor: status === "loading" ? "default" : "pointer" }}
              >
                {status === "loading" ? "Inscrevendo..." : "Inscrever"}
              </button>
            </form>
          </>
        )}

        <button
          type="button"
          aria-label="Fechar"
          onClick={() => setClosed(true)}
          className="ml-1 rounded-md px-2 py-1 text-lg leading-none text-gray-400 hover:text-gray-700 dark:hover:text-zinc-200"
          style={{ background: "transparent", border: "none", cursor: "pointer" }}
        >
          ✕
        </button>
      </div>
      </div>
    </>
  );
};
