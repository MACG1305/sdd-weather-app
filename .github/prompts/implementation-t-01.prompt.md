---
mode: agent
description: 'Executa a tarefa T-01 do backlog: resolve e registra os gates de produto, dados e operação do Weather App.'
---

# Prompt — Executar T-01: Resolver Gates de Produto

Você é o **Code Agent**. Execute somente a tarefa `T-01 — Resolver gates de produto, dados e operação` do backlog. Esta é uma tarefa de decisão e documentação, não de implementação de código.

## Contexto

O Weather App segue o fluxo SDD: Brief → Spec → Plan → Tasks → Code → Test → Review → Ship. A spec atual marca os valores propostos como pendentes de aprovação. Não trate propostas anteriores do agente como decisões aprovadas.

A tarefa T-01 exige registrar para cada gate: decisão (aprovar, rejeitar ou substituir), responsável e justificativa; atualizar spec e plano se valores forem substituídos; e não deixar gates pendentes para os requisitos que permanecerão no escopo v1.

Os gates são:

- **Q-01 — Escopo MVP:** confirmar ou alterar a aplicação web responsiva sem PWA/app nativo e o conjunto de campos FR-02/FR-03.
- **Q-02 — Fonte e mercado:** confirmar cobertura dos serviços Open-Meteo nos países prioritários e aprovar ou rejeitar termos, atribuição, disponibilidade e limites para o volume esperado.
- **Q-03 — Metas operacionais:** aprovar ou substituir os alvos propostos de NFR-01 a NFR-07 e NFR-09, inclusive como indisponibilidade do provedor conta na meta de disponibilidade.
- **Q-04 — Público e sucesso:** validar as personas hipotéticas, escolher a persona prioritária e definir uma métrica de produto e seu alvo para v1.
- **Q-05 — Dados e frescor:** aprovar ou substituir o limite proposto de 3 horas para rotular observações como atuais e decidir se o horário de referência do provedor será exibido.

## Fontes e arquivos

Leia antes de editar:

- `tasks/weather-app-tasks.md` — descrição e critérios de aceite de T-01.
- `specs/weather-app-spec.md` — gates, requisitos e valores propostos atuais.
- `plans/weather-app-plan.md` — decisões técnicas que dependem desses gates.
- `specs/discovery.md` — contexto das personas e hipóteses de produto.

Arquivos que podem ser atualizados:

- `specs/weather-app-spec.md` — registrar decisões, ajustar requisitos/NFRs, premissas, riscos e remover ou reformular perguntas resolvidas.
- `plans/weather-app-plan.md` — refletir decisões aprovadas e atualizar contratos/estratégia afetados.
- `tasks/weather-app-tasks.md` — editar somente se uma decisão alterar escopo, critérios ou cobertura do backlog; preservar IDs estáveis e atualizar todas as referências afetadas.

Não altere arquivos de `src/` ou `tests/` nesta tarefa.

## Procedimento obrigatório

1. Releia os três artefatos SDD e as mensagens atuais da conversa. Use apenas decisões explícitas fornecidas pelo usuário/Product Owner como aprovação.
2. Para cada Q-01–Q-05, determine se há uma resposta explícita que identifique decisão, responsável e justificativa. Evidência documental ou técnica pode informar uma recomendação, mas não substitui a aprovação do responsável.
3. Se faltar decisão, responsável, justificativa ou valor necessário, não invente nem infira a aprovação. Faça perguntas objetivas ao usuário/Product Owner com opções e impacto; não marque T-01 como concluída enquanto houver gate aplicável pendente.
4. Se todos os gates tiverem decisão explícita, registre o estado e a justificativa de cada um na spec. Atualize o plano e, quando necessário, o backlog para que não haja valores, escopo ou critérios contraditórios.
5. Preserve histórico útil: decisões rejeitadas/substituídas não devem continuar descritas como baseline aprovado. Mantenha perguntas abertas somente para pontos sem decisão.
6. Não implemente funcionalidades, não escolha fornecedor/mercado por conta própria e não converta recomendação técnica em decisão de negócio.

## Critérios de aceite

- Para cada Q-01, Q-02, Q-03, Q-04 e Q-05, os documentos registram: decisão explícita, responsável e justificativa.
- Cada valor ou escopo substituído está atualizado de forma consistente na spec e no plano; se afetar o backlog, a tarefa correspondente e suas referências também estão atualizadas.
- Nenhum gate que se aplique ao escopo v1 permanece marcado como pendente para declarar T-01 concluída.
- Nenhuma aprovação, pessoa responsável, métrica, alvo ou condição de mercado foi inventada pelo agente.
- Se não houver informação suficiente, o resultado é **bloqueado por decisão de produto**, com as perguntas pendentes listadas; documentos não são alterados para simular conclusão.

## Validação e resposta

- Para alterações documentais, execute `git diff --check` e um lint Markdown existente, se disponível. Não rode build ou testes da aplicação.
- Confira consistência entre Q-01–Q-05, requisitos/NFRs, plano e tarefas afetadas; procure perguntas duplicadas, decisões contraditórias e referências quebradas.
- Se corrigir qualquer falha, repita a checagem correspondente.
- Ao concluir, informe decisões registradas, arquivos alterados, gates ainda pendentes (se houver) e validações realmente executadas. Não declare T-01 concluída enquanto os critérios acima não forem satisfeitos.