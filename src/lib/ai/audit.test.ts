import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({ createResponse: vi.fn() }));

vi.mock("server-only", () => ({}));
vi.mock("./openai", () => ({
  getOpenAIClient: () => ({ responses: { create: mocks.createResponse } }),
}));

import { createBusinessAudit } from "./audit";

const validAudit = {
  plainLanguage: {
    currentProcess: "Менеджер вручную переносит заявки в CRM.",
    whatCanBeAutomated: ["Создание карточки заявки."],
    aiRole: ["Классифицировать обращение."],
    humanRole: ["Проверять сложные случаи."],
  },
  summary: "Процесс можно частично автоматизировать.",
  automationOpportunities: [
    { title: "Регистрация", description: "Система создаёт карточку заявки." },
    { title: "Распределение", description: "Система предлагает ответственного." },
  ],
  architecture: [
    { label: "WhatsApp", type: "source" },
    { label: "Обработка", type: "process" },
    { label: "Менеджер", type: "human" },
  ],
  requirements: ["Доступ к CRM."],
  questions: ["Как назначается ответственный?"],
  risks: ["Нужна проверка исключений."],
  nextStep: "Зафиксировать правила обработки.",
};

describe("business audit output quality", () => {
  beforeEach(() => {
    mocks.createResponse.mockReset();
  });

  it("fails closed as AI_UNAVAILABLE for damaged structured output", async () => {
    mocks.createResponse.mockResolvedValue({
      status: "completed",
      incomplete_details: null,
      output_text: JSON.stringify({
        plainLanguage: {
          currentProcess: "Менеджер проверяет заявку и выбирает, каким способом менеджер уведом台",
          whatCanBeAutomated: ["Создание карточки заявки в CRM."],
          aiRole: ["AI определяет тему обращения."],
          humanRole: ["Менеджер проверяет сложные случаи."],
        },
        summary: "Процесс можно частично автоматизировать. Решения в нестандартных случаях остаются за сотрудником.",
        automationOpportunities: [
          { title: "Регистрация заявок", description: "Система создаёт карточку без ручного копирования." },
          { title: "Распределение", description: "Система предлагает ответственного по согласованным правилам." },
        ],
        architecture: [
          { label: "WhatsApp", type: "source" },
          { label: "Обработка заявки", type: "process" },
          { label: "Проверка менеджером", type: "human" },
        ],
        requirements: ["Доступ к CRM."],
        questions: ["Как сейчас назначается ответственный?"],
        risks: ["Необычные заявки требуют проверки."],
        nextStep: "Зафиксировать правила распределения заявок.",
      }),
      usage: { total_tokens: 500 },
    });

    await expect(createBusinessAudit("Менеджеры вручную обрабатывают заявки клиентов и переносят данные в CRM.", "ru", AbortSignal.timeout(1_000)))
      .rejects.toMatchObject({ message: "AI_UNAVAILABLE", reason: "invalid_schema", attempts: 2 });
  });

  it("retries an incomplete response and returns a valid second response", async () => {
    mocks.createResponse
      .mockResolvedValueOnce({ status: "incomplete", incomplete_details: { reason: "max_output_tokens" }, output_text: "" })
      .mockResolvedValueOnce({ status: "completed", incomplete_details: null, output_text: JSON.stringify(validAudit), usage: { total_tokens: 500 } });

    await expect(createBusinessAudit("Менеджеры вручную обрабатывают заявки клиентов и переносят данные в CRM.", "ru", AbortSignal.timeout(1_000)))
      .resolves.toMatchObject({ result: validAudit, tokens: 500, attempts: 2 });
    expect(mocks.createResponse).toHaveBeenCalledTimes(2);
  });

  it.each(["", "{not-json"])("repairs empty or malformed output on the second attempt: %s", async (firstOutput) => {
    mocks.createResponse
      .mockResolvedValueOnce({ status: "completed", incomplete_details: null, output_text: firstOutput })
      .mockResolvedValueOnce({ status: "completed", incomplete_details: null, output_text: JSON.stringify(validAudit) });

    await expect(createBusinessAudit("Менеджеры вручную обрабатывают заявки клиентов и переносят данные в CRM.", "ru", AbortSignal.timeout(1_000)))
      .resolves.toMatchObject({ result: validAudit, attempts: 2 });
    expect(mocks.createResponse).toHaveBeenCalledTimes(2);
  });

  it("reports a typed reason after two incomplete attempts", async () => {
    mocks.createResponse.mockResolvedValue({ status: "incomplete", incomplete_details: { reason: "max_output_tokens" }, output_text: "" });

    await expect(createBusinessAudit("Менеджеры вручную обрабатывают заявки клиентов и переносят данные в CRM.", "ru", AbortSignal.timeout(1_000)))
      .rejects.toMatchObject({ stage: "full_audit", reason: "incomplete", attempts: 2 });
    expect(mocks.createResponse).toHaveBeenCalledTimes(2);
  });

  it("does not retry after the shared signal is aborted", async () => {
    const controller = new AbortController();
    mocks.createResponse.mockImplementationOnce(async () => {
      controller.abort();
      return { status: "completed", incomplete_details: null, output_text: "" };
    });

    await expect(createBusinessAudit("Менеджеры вручную обрабатывают заявки клиентов и переносят данные в CRM.", "ru", controller.signal))
      .rejects.toMatchObject({ reason: "timeout", attempts: 1 });
    expect(mocks.createResponse).toHaveBeenCalledOnce();
  });
});
