import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type KeyboardEvent,
} from "react";
import { Bot, Loader2, SquarePen, Send, Sparkles, X } from "lucide-react";
import { Button } from "../ui/button";
import { cn } from "../../lib/cn";
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
import "./styles.css";

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
  const isEmpty = messages.length === 0;
  const bubbleClassName = (role: string) =>
    role === "user" ? classNames?.userBubble : classNames?.assistantBubble;

  return (
    <>
      {open ? (
        <div className="gdy-scope gdy-ai-overlay" onClick={onClose} />
      ) : null}

      <aside
        className={cn("gdy-scope gdy-ai-sidebar", className, classNames?.root)}
        data-state={open ? "open" : "closed"}
        style={{ width }}
      >
        <header className={cn("gdy-ai-header", classNames?.header)}>
          <div className="gdy-ai-header-badge">
            <Sparkles className="gdy-ai-header-icon" />
          </div>
          <div className="gdy-ai-heading">
            <h2 className="gdy-ai-title">{title}</h2>
            <p className="gdy-ai-subtitle">{resolvedSubtitle}</p>
          </div>
          {showResetButton ? (
            <Button
              variant="ghost"
              size="icon-sm"
              className="gdy-ai-reset"
              onClick={handleReset}
              disabled={!canReset || isLoading}
              title={resolvedTexts.resetTooltip}
              aria-label={resolvedTexts.resetTooltip}
            >
              <SquarePen className="gdy-ai-reset-icon" />
            </Button>
          ) : null}
          <Button
            variant="ghost"
            size="icon-sm"
            className="gdy-ai-close"
            onClick={onClose}
            aria-label="Cerrar"
          >
            <X className="gdy-ai-close-icon" />
          </Button>
        </header>

        <div
          className={cn("gdy-ai-body", classNames?.body)}
          data-empty={isEmpty || undefined}
        >
          {isEmpty ? (
            <div className="gdy-ai-empty">
              <div className="gdy-ai-empty-badge">
                {empty.icon ?? <Bot className="gdy-ai-empty-icon" />}
              </div>
              <div className="gdy-ai-empty-text">
                <p className="gdy-ai-empty-title">{empty.title}</p>
                <p className="gdy-ai-empty-description">{empty.description}</p>
              </div>
              {chips.length > 0 ? (
                <div className="gdy-ai-chips">
                  {chips.map((chip) => (
                    <button
                      key={chip.label}
                      type="button"
                      onClick={() => void handleSend(chip.prompt)}
                      className={cn("gdy-ai-chip", classNames?.chip)}
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
              className="gdy-ai-message"
              data-role={message.role}
            >
              {message.role === "assistant" ? (
                <div className="gdy-ai-avatar">
                  <Sparkles className="gdy-ai-avatar-icon" />
                </div>
              ) : null}

              <div
                className={cn("gdy-ai-bubble", bubbleClassName(message.role))}
                data-role={message.role}
              >
                {message.role === "assistant" ? (
                  <MarkdownRenderer text={message.content} />
                ) : (
                  <p className="gdy-ai-text">{message.content}</p>
                )}
              </div>
            </div>
          ))}

          {streamingContent ? (
            <div className="gdy-ai-message" data-role="assistant" data-streaming="">
              <div className="gdy-ai-avatar">
                <Sparkles className="gdy-ai-avatar-icon" />
              </div>
              <div
                className={cn("gdy-ai-bubble", classNames?.assistantBubble)}
                data-role="assistant"
              >
                <MarkdownRenderer text={`${streamingContent}▌`} />
              </div>
            </div>
          ) : null}

          {isLoading && !streamingContent ? (
            <div className="gdy-ai-message" data-role="assistant" data-thinking="">
              <div className="gdy-ai-avatar">
                <Sparkles className="gdy-ai-avatar-icon" />
              </div>
              <div className="gdy-ai-thinking">
                <div className="gdy-ai-thinking-content">
                  <Loader2 className="gdy-ai-thinking-icon" />
                  <span className="gdy-ai-thinking-label">
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

          <div ref={messagesEndRef} className="gdy-ai-end" />
        </div>

        <footer className={cn("gdy-ai-footer", classNames?.footer)}>
          <div
            className={cn("gdy-ai-input-wrapper", classNames?.inputWrapper)}
          >
            <textarea
              ref={inputRef}
              rows={3}
              value={input}
              onChange={(event) => setInput(event.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={resolvedTexts.placeholder}
              className={cn("gdy-ai-textarea", classNames?.textarea)}
              disabled={isLoading}
            />
            <Button
              size="icon"
              className="gdy-ai-send"
              onClick={() => void handleSend()}
              disabled={!input.trim() || isLoading}
              aria-label="Enviar"
            >
              <Send className="gdy-ai-send-icon" />
            </Button>
          </div>
        </footer>
      </aside>
    </>
  );
}
