import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type KeyboardEvent,
} from "react";
import { Bot, Loader2, SquarePen, Send, Sparkles, X } from "lucide-react";
import { Button } from "../ui/button";
import { cn } from "../../lib/utils";
import {
  DEFAULT_EMPTY_STATE_CHATBOT,
  DEFAULT_EMPTY_STATE_DATA,
  DEFAULT_SUGGESTED_MESSAGES_CHATBOT,
  DEFAULT_SUGGESTED_MESSAGES_DATA,
  DEFAULT_TEXTS,
} from "./constants";
import { ActionConfirmCard } from "./ActionConfirmCard";
import { MarkdownRenderer } from "./MarkdownRenderer";
import { resolveSystemPrompt } from "./prompt-builders";
import { useAIChat } from "./useAIChat";
import type { AIChatMode, AIChatSidebarProps, AIEmptyState } from "./types";

function resolveMode(props: AIChatSidebarProps): AIChatMode {
  if (props.mode) return props.mode;
  return props.dataSchema ? "table" : "chatbot";
}

function resolveEmptyState(
  mode: AIChatMode,
  explicit: AIEmptyState | undefined,
  textOverrides: AIChatSidebarProps["texts"],
): {
  title: string;
  description: string;
  icon?: AIEmptyState["icon"];
} {
  const fallback =
    mode === "chatbot" ? DEFAULT_EMPTY_STATE_CHATBOT : DEFAULT_EMPTY_STATE_DATA;
  const textBase =
    mode === "chatbot" ? textOverrides?.emptyChatbot : textOverrides?.emptyData;
  return {
    title: explicit?.title ?? textBase?.title ?? fallback.title,
    description:
      explicit?.description ?? textBase?.description ?? fallback.description,
    icon: explicit?.icon ?? textBase?.icon,
  };
}

export function AIChatSidebar(props: AIChatSidebarProps) {
  const {
    open,
    onClose,
    providerConfig,
    systemPrompt,
    chatbotPrompt,
    suggestedMessages,
    title = "Asistente AI",
    subtitle,
    emptyState,
    texts,
    dataSchema,
    enableActions,
    onAction,
    onError,
    onResetConversation,
    memory,
    showResetButton = true,
    className,
    classNames,
    width = 380,
  } = props;

  const mode = resolveMode(props);
  const [input, setInput] = useState("");
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const resolvedTexts = useMemo(
    () => ({ ...DEFAULT_TEXTS, ...texts }),
    [texts],
  );

  const resolvedSystemPrompt = useMemo(
    () =>
      resolveSystemPrompt({ mode, dataSchema, systemPrompt, chatbotPrompt }),
    [mode, dataSchema, systemPrompt, chatbotPrompt],
  );

  const resolvedEnableActions =
    enableActions ?? (mode !== "chatbot" && Boolean(dataSchema));

  const {
    messages,
    pendingActions,
    isLoading,
    streamingContent,
    sendMessage,
    confirmAction,
    rejectAction,
    resetConversation,
  } = useAIChat({
    providerConfig,
    systemPrompt: resolvedSystemPrompt,
    mode,
    dataSchema,
    enableActions: resolvedEnableActions,
    memory,
    texts,
    onAction,
    onError,
  });

  const chips =
    suggestedMessages ??
    (mode === "chatbot"
      ? DEFAULT_SUGGESTED_MESSAGES_CHATBOT
      : DEFAULT_SUGGESTED_MESSAGES_DATA);

  const resolvedSubtitle =
    subtitle ??
    (dataSchema
      ? `${dataSchema.rows?.length ?? 0} registros · ${dataSchema.entityName}`
      : mode === "chatbot"
        ? "Chat asistido"
        : "Asistente contextual");

  const empty = resolveEmptyState(mode, emptyState, texts);

  useEffect(() => {
    if (!open) return;
    const timer = window.setTimeout(() => inputRef.current?.focus(), 250);
    return () => window.clearTimeout(timer);
  }, [open]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, streamingContent, pendingActions]);

  const handleSend = async (text?: string) => {
    const value = (text ?? input).trim();
    if (!value || isLoading) return;
    setInput("");
    await sendMessage(value);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      void handleSend();
    }
  };

  const handleReset = () => {
    resetConversation();
    onResetConversation?.();
    inputRef.current?.focus();
  };

  const canReset = messages.length > 0 || pendingActions.length > 0;

  return (
    <>
      {open ? (
        <div
          className="fixed inset-0 z-40 bg-black/30 backdrop-blur-[2px] md:hidden"
          onClick={onClose}
        />
      ) : null}

      <aside
        className={cn(
          "fixed inset-y-0 right-0 z-50 flex max-w-[90vw] flex-col border-l bg-background shadow-2xl transition-transform duration-300 ease-out",
          open ? "translate-x-0" : "translate-x-full",
          className,
          classNames?.root,
        )}
        style={{ width }}
      >
        <header
          className={cn(
            "flex h-14 shrink-0 items-center gap-3 border-b bg-gradient-to-r from-primary/5 to-transparent px-4",
            classNames?.header,
          )}
        >
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
            <Sparkles className="h-4 w-4 text-primary" />
          </div>
          <div className="min-w-0 flex-1">
            <h2 className="truncate text-sm font-semibold">{title}</h2>
            <p className="truncate text-[11px] text-muted-foreground">
              {resolvedSubtitle}
            </p>
          </div>
          {showResetButton ? (
            <Button
              variant="ghost"
              size="sm"
              className="h-7 w-7 shrink-0 p-0"
              onClick={handleReset}
              disabled={!canReset || isLoading}
              title={resolvedTexts.resetTooltip}
              aria-label={resolvedTexts.resetTooltip}
            >
              <SquarePen className="h-4 w-4" />
            </Button>
          ) : null}
          <Button
            variant="ghost"
            size="sm"
            className="h-7 w-7 shrink-0 p-0"
            onClick={onClose}
            aria-label="Cerrar"
          >
            <X className="h-4 w-4" />
          </Button>
        </header>

        <div
          className={cn(
            "flex-1 overflow-y-auto px-4 py-4 [scrollbar-width:thin]",
            messages.length !== 0 && "space-y-2",
            classNames?.body,
          )}
        >
          {messages.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center gap-4 px-4 text-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10">
                {empty.icon ?? <Bot className="h-7 w-7 text-primary" />}
              </div>
              <div>
                <p className="text-sm font-semibold text-foreground">
                  {empty.title}
                </p>
                <p className="mt-1 max-w-[240px] text-xs text-muted-foreground">
                  {empty.description}
                </p>
              </div>
              {chips.length > 0 ? (
                <div className="mt-2 flex flex-wrap justify-center gap-2">
                  {chips.map((chip) => (
                    <button
                      key={chip.label}
                      type="button"
                      onClick={() => void handleSend(chip.prompt)}
                      className={cn(
                        "rounded-full border border-primary/20 bg-primary/5 px-3 py-1.5 text-xs font-medium text-primary transition-colors hover:bg-primary/10",
                        classNames?.chip,
                      )}
                    >
                      {chip.label}
                    </button>
                  ))}
                </div>
              ) : null}
            </div>
          ) : null}

          {messages.map((message) => (
            <div
              key={message.id}
              className={cn(
                "flex gap-2.5",
                message.role === "user" ? "justify-end" : "justify-start",
              )}
            >
              {message.role === "assistant" ? (
                <div className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-primary/10">
                  <Sparkles className="h-3 w-3 text-primary" />
                </div>
              ) : null}

              <div
                className={cn(
                  "min-w-0 max-w-[85%] break-words rounded-xl px-3.5 py-2.5",
                  message.role === "user"
                    ? cn(
                        "rounded-br-sm bg-primary text-primary-foreground",
                        classNames?.userBubble,
                      )
                    : cn(
                        "rounded-bl-sm border border-border/50 bg-muted/60 text-foreground",
                        classNames?.assistantBubble,
                      ),
                )}
              >
                {message.role === "assistant" ? (
                  <MarkdownRenderer text={message.content} />
                ) : (
                  <p className="whitespace-pre-wrap break-words text-sm">
                    {message.content}
                  </p>
                )}
              </div>
            </div>
          ))}

          {streamingContent ? (
            <div className="flex gap-2.5">
              <div className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-primary/10">
                <Sparkles className="h-3 w-3 text-primary" />
              </div>
              <div
                className={cn(
                  "min-w-0 max-w-[85%] break-words rounded-xl rounded-bl-sm border border-border/50 bg-muted/60 px-3.5 py-2.5 text-foreground",
                  classNames?.assistantBubble,
                )}
              >
                <MarkdownRenderer text={`${streamingContent}▌`} />
              </div>
            </div>
          ) : null}

          {isLoading && !streamingContent ? (
            <div className="flex gap-2.5">
              <div className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-primary/10">
                <Sparkles className="h-3 w-3 text-primary" />
              </div>
              <div className="rounded-xl rounded-bl-sm border border-border/50 bg-muted/60 px-4 py-3">
                <div className="flex items-center gap-2">
                  <Loader2 className="h-3.5 w-3.5 animate-spin text-primary" />
                  <span className="text-xs text-muted-foreground">
                    {resolvedTexts.thinking}
                  </span>
                </div>
              </div>
            </div>
          ) : null}

          {mode !== "chatbot"
            ? pendingActions.map((action) => (
                <ActionConfirmCard
                  key={action.id}
                  action={action}
                  schema={dataSchema}
                  texts={resolvedTexts}
                  onConfirm={confirmAction}
                  onCancel={rejectAction}
                />
              ))
            : null}

          <div ref={messagesEndRef} />
        </div>

        <footer
          className={cn(
            "shrink-0 border-t bg-background p-2",
            classNames?.footer,
          )}
        >
          <div
            className={cn(
              "flex items-center gap-2 bg-muted/30 transition-all",
              classNames?.inputWrapper,
            )}
          >
            <textarea
              ref={inputRef}
              rows={3}
              value={input}
              onChange={(event) => setInput(event.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={resolvedTexts.placeholder}
              className={cn(
                "flex-1 resize-none overflow-y-auto bg-transparent p-1 text-sm leading-snug outline-none placeholder:text-muted-foreground/60 border focus-within:border-primary/40 focus-within:ring-2 focus-within:ring-primary/30 rounded-xl [scrollbar-width:thin]",
                classNames?.textarea,
              )}
              disabled={isLoading}
            />
            <Button
              size="sm"
              className="h-8 w-8 shrink-0 rounded-lg p-0 hover:scale-105 transition-transform"
              onClick={() => void handleSend()}
              disabled={!input.trim() || isLoading}
              aria-label="Enviar"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </footer>
      </aside>
    </>
  );
}
