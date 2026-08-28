import { describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({ createResponse: vi.fn() }));

vi.mock("server-only", () => ({}));
vi.mock("./openai", () => ({
  getOpenAIClient: () => ({ responses: { create: mocks.createResponse } }),
}));

import { createBusinessAudit } from "./audit";

describe("business audit output quality", () => {
  it("fails closed as AI_UNAVAILABLE for damaged structured output", async () => {
    mocks.createResponse.mockResolvedValue({
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
      .rejects.toThrow("AI_UNAVAILABLE");
  });
});
