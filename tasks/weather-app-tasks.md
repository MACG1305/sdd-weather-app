# Backlog de Tarefas — Weather App

Tarefas derivadas de [plans/weather-app-plan.md](../plans/weather-app-plan.md) e rastreadas à [spec](../specs/weather-app-spec.md). A sequência abaixo separa implementação, integração, testes e hardening. Cada tarefa tem um foco principal e no máximo dois arquivos prováveis.

## Prioridade e tamanho

P0 indica tarefa necessária para completar ou validar o fluxo funcional da v1; P1 indica validação complementar relevante; P2 indica hardening após o fluxo principal e pode tornar-se gate de release se Q-03 aprovar o NFR correspondente. Tamanho é estimativa relativa: P pequeno, M médio, G grande.

| Tarefa | Prioridade | Tamanho |
| --- | --- | --- |
| T-01 | P0 | G |
| T-02 | P0 | M |
| T-03 | P0 | M |
| T-04 | P0 | M |
| T-05 | P0 | M |
| T-06 | P0 | M |
| T-07 | P0 | G |
| T-08 | P0 | G |
| T-09 | P0 | G |
| T-10 | P0 | M |
| T-11 | P0 | M |
| T-12 | P0 | M |
| T-13 | P0 | P |
| T-14 | P0 | M |
| T-15 | P0 | P |
| T-16 | P0 | M |
| T-17 | P0 | M |
| T-18 | P0 | M |
| T-19 | P0 | P |
| T-20 | P1 | P |
| T-21 | P1 | P |
| T-22 | P0 | M |
| T-23 | P0 | G |
| T-24 | P0 | M |
| T-25 | P0 | G |
| T-26 | P0 | M |
| T-27 | P0 | M |
| T-28 | P0 | M |
| T-29 | P0 | P |
| T-30 | P0 | M |
| T-31 | P0 | M |
| T-32 | P0 | G |
| T-33 | P2 | G |
| T-34 | P0 | M |

## Fatias verticais sugeridas

| Ordem | Tarefas de implementação | Verificação | Resultado visível |
| --- | --- | --- | --- |
| 1. Busca e seleção | T-01, T-02, T-06–T-08, T-10, T-14–T-16 | T-22, T-23, T-26, T-30 | Buscar cidade, escolher resultado explicitamente, ver loading/erro e aviso de privacidade. |
| 2. Clima atual e unidade | T-03–T-05, T-09, T-11, T-13, T-17 | T-19–T-21, T-25, T-27, T-29 | Após selecionar a cidade, ver condições atuais e alternar °C/°F. |
| 3. Previsão | T-12, T-18 | T-24, T-28 | Ver cinco dias locais, preservando dias com dados incompletos. |
| 4. Fluxo completo e hardening | — (implementação concluída nas fatias anteriores) | T-31–T-34 | Validar E2E desktop/mobile, compatibilidade, acessibilidade e gates de qualidade. |

As fatias são uma ordem recomendada: demonstre cada resultado visível antes de avançar e execute os testes correspondentes assim que as dependências da fatia estiverem prontas.

## Matriz de Requisitos Funcionais

| Requisito da spec | Tarefas de implementação | Tarefas de validação | Lacuna |
| --- | --- | --- | --- |
| **FR-01 — Buscar e selecionar cidade** | T-06–T-08, T-10, T-14–T-16 | T-22, T-23, T-26, T-30–T-32 | Nenhuma identificada. |
| **FR-02 — Consultar condições atuais** | T-03–T-05, T-07, T-09, T-11, T-13–T-14, T-17–T-18 | T-19–T-21, T-24–T-25, T-27–T-28, T-30–T-32 | Nenhuma identificada. |
| **FR-03 — Consultar previsão diária** | T-03–T-05, T-07, T-09, T-12, T-14, T-18 | T-19–T-21, T-24–T-25, T-28, T-30, T-32 | Nenhuma identificada. |
| **FR-04 — Alternar unidade de temperatura** | T-03, T-09, T-13, T-17–T-18 | T-19, T-25, T-29, T-32 | Nenhuma identificada. |

Não há requisito funcional sem tarefa correspondente identificada na spec atual.

## Pré-requisito — Gates de produto

### T-01 — Resolver gates de produto, dados e operação
- **Tipo:** Infra
- **Descrição:** Registrar decisões Q-01 a Q-05 antes de tratar propostas como compromissos de implementação.
- **Critérios de aceite:** Para cada Q-01 a Q-05, os documentos registram decisão (aprovar, rejeitar ou substituir), responsável e justificativa; valores substituídos estão atualizados na spec/plano; nenhum item permanece marcado como pendente para os requisitos incluídos na v1.
- **Dependências:** Nenhuma.
- **Arquivos prováveis:** `specs/weather-app-spec.md`, `plans/weather-app-plan.md`.
- **Rastreabilidade:** Q-01 a Q-05.

## Entrega 1 — Tipos e contratos

### T-02 — Definir contratos compartilhados do domínio
- **Tipo:** Data
- **Descrição:** Modelar cidade, clima atual, previsão diária, unidade, erros e estados dos fluxos.
- **Critérios de aceite:** `City` contém `id`, `name`, `country`, `latitude` e `longitude`, com `admin1` opcional; `WeatherData` exige `city`, `timezone`, `current` e `forecast`; valores meteorológicos de `CurrentWeather`/`ForecastDay` são opcionais; `Unit` é `'celsius' | 'fahrenheit'`; estados discriminados incluem idle/loading/success/error e empty para busca; sucesso meteorológico distingue complete/partial; nenhum campo ausente recebe zero.
- **Dependências:** T-01.
- **Arquivos prováveis:** `src/types/weather.ts`.
- **Rastreabilidade:** FR-01 a FR-04; AC-02.3; AC-03.2–AC-03.3.

## Entrega 2 — Funções puras

### T-03 — Implementar conversão de temperatura
- **Tipo:** Data
- **Descrição:** Implementar conversão Celsius/Fahrenheit e arredondamento apenas na apresentação.
- **Critérios de aceite:** Para Celsius, Fahrenheit é calculado como `C * 9 / 5 + 32`; para Fahrenheit, Celsius como `(F - 32) * 5 / 9`; a função não arredonda o valor numérico convertido; `0 °C` resulta em `32 °F`, `-40 °C` resulta em `-40 °F` e entrada ausente continua ausente.
- **Dependências:** T-02.
- **Arquivos prováveis:** `src/lib/temperature.ts`.
- **Rastreabilidade:** FR-04; AC-04.2–AC-04.4.

### T-04 — Mapear códigos meteorológicos para pt-BR
- **Tipo:** Data
- **Descrição:** Mapear códigos conhecidos para rótulos aprovados em português.
- **Critérios de aceite:** Código inteiro `2` retorna “Parcialmente nublado”; cada código inteiro incluído no mapa explícito retorna seu rótulo pt-BR; código não mapeado ou ausente retorna exatamente “Condição indisponível”; rótulos vêm do mapa local, não de texto livre da resposta do provedor.
- **Dependências:** T-02.
- **Arquivos prováveis:** `src/lib/weatherCodes.ts`.
- **Rastreabilidade:** AC-02.2; AC-03.2–AC-03.3.

### T-05 — Implementar formatação de datas e horários locais
- **Tipo:** Data
- **Descrição:** Formatar datas e horários em pt-BR usando explicitamente o fuso da cidade.
- **Critérios de aceite:** Funções recebem o fuso como argumento; horário válido é formatado em pt-BR nesse fuso e data `YYYY-MM-DD` conserva o mesmo dia; valor/data/fuso inválido ou ausente retorna `undefined`, sem usar o fuso do dispositivo como fallback.
- **Dependências:** T-02.
- **Arquivos prováveis:** `src/lib/dateTime.ts`.
- **Rastreabilidade:** AC-02.6; AC-03.1; NFR-02.

## Entrega 3 — Services

### T-06 — Implementar serviço de geocodificação
- **Tipo:** Data
- **Descrição:** Consultar geocoding com `fetch`, validar resposta e mapear localidades para `City`.
- **Critérios de aceite:** URL usa HTTPS com `count=10`, `language=pt` e `format=json`; parâmetro `name` contém a consulta aparada somente nas extremidades e codificada sem perda de acentos/apóstrofos/hífens, sem enviar outros dados pessoais; resposta válida vazia retorna lista vazia; HTTP não-2xx, rede, timeout de até 10 s e JSON/formato inválido produzem erros distinguíveis.
- **Dependências:** T-01, T-02.
- **Arquivos prováveis:** `src/services/weatherService.ts`.
- **Rastreabilidade:** AC-01.1; AC-01.4; AC-01.6; NFR-05; NFR-08.

### T-07 — Implementar serviço de previsão Open-Meteo
- **Tipo:** Data
- **Descrição:** Consultar previsão por coordenadas e mapear resposta para o modelo interno, preservando lacunas.
- **Critérios de aceite:** URL usa HTTPS e envia latitude/longitude selecionadas, `current=temperature_2m,apparent_temperature,relative_humidity_2m,wind_speed_10m,precipitation,surface_pressure,weather_code`, `daily=weather_code,temperature_2m_min,temperature_2m_max,precipitation_probability_max`, `temperature_unit=celsius`, `wind_speed_unit=kmh`, `precipitation_unit=mm`, `forecast_days=5` e `timezone=auto`; pressão local é mapeada para `pressureHpa` em hPa quando fornecida; retorno contém cinco datas sem deslocar arrays incompletos e mantém a `City` selecionada; HTTP/API, rede, timeout e resposta inválida são erros distinguíveis.
- **Dependências:** T-01, T-02, T-06.
- **Arquivos prováveis:** `src/services/weatherService.ts`.
- **Rastreabilidade:** AC-01.3; AC-02.1–AC-02.6; AC-03.1–AC-03.5; NFR-05; NFR-09.

## Entrega 4 — Hook e orquestração

### T-08 — Orquestrar busca e seleção de cidade
- **Tipo:** Data
- **Descrição:** Gerenciar consulta, resultados, seleção explícita, repetição e respostas concorrentes no hook.
- **Critérios de aceite:** Consulta vazia/só com espaços faz zero chamadas de busca e define estado de validação; resultado vazio remove resultados anteriores e preserva cidade ativa; selecionar resultado chama consulta meteorológica uma vez com suas latitude/longitude; repetir busca só ocorre após ação explícita; resposta da busca anterior não altera o estado da consulta mais recente.
- **Dependências:** T-02, T-06, T-07.
- **Arquivos prováveis:** `src/hooks/useWeather.ts`.
- **Rastreabilidade:** AC-01.1–AC-01.6.

### T-09 — Orquestrar estados meteorológicos
- **Tipo:** Data
- **Descrição:** Gerenciar loading, dados completos/parciais, erro, repetição e concorrência da consulta no hook.
- **Critérios de aceite:** Nova instância do hook inicia em Celsius sem ler/gravar preferência em `localStorage` ou `sessionStorage`; seleção produz loading seguido de success complete/partial ou error; retry meteorológico só chama serviço após ação explícita e usa a cidade ativa; resolução fora de ordem não substitui dados da seleção mais recente; campos ausentes permanecem ausentes; dado sem referência/fuso ou acima do limite aprovado não recebe rótulo “atual”; mudança de unidade faz zero chamadas ao serviço meteorológico.
- **Dependências:** T-03, T-04, T-05, T-07, T-08.
- **Arquivos prováveis:** `src/hooks/useWeather.ts`.
- **Rastreabilidade:** AC-02.3–AC-02.6; AC-03.3–AC-03.4; AC-04.1–AC-04.5; NFR-05; NFR-08; NFR-09.

## Entrega 5 — Componentes

### T-10 — Criar interface de busca e resultados
- **Tipo:** UI
- **Descrição:** Criar campo de busca e lista de localidades com contexto geográfico para desambiguação.
- **Critérios de aceite:** Campo possui nome acessível associado e ação executável por teclado; envio vazio exibe validação junto ao campo; cada resultado renderiza cidade e país e renderiza região quando fornecida; resultado sem região em lista homônima mostra coordenadas quando disponíveis; renderizar resultados não dispara seleção.
- **Dependências:** T-02, T-08.
- **Arquivos prováveis:** `src/components/SearchBar.tsx`, `src/components/CityResults.tsx`.
- **Rastreabilidade:** AC-01.2; AC-01.5; NFR-03.

### T-11 — Apresentar condições atuais
- **Tipo:** UI
- **Descrição:** Criar painel de condições atuais com campos obrigatórios, opcionais e incompletos.
- **Critérios de aceite:** Com fixture completa, painel exibe cidade, país, região disponível, temperatura com unidade, condição e horário; exibe ícone derivado do código meteorológico, sensação térmica, umidade, vento, precipitação e pressão atmosférica local em hPa quando presentes; cada opcional ausente aparece como “Indisponível”; ausência de temperatura/condição/horário exibe “Dados atuais incompletos” e não o rótulo de condições atuais completas.
- **Dependências:** T-03, T-04, T-05, T-09.
- **Arquivos prováveis:** `src/components/CurrentWeather.tsx`.
- **Rastreabilidade:** AC-02.1–AC-02.3; AC-02.6.

### T-12 — Apresentar previsão diária
- **Tipo:** UI
- **Descrição:** Criar lista e item de previsão para cinco dias locais, preservando posições incompletas.
- **Critérios de aceite:** Para fixture válida, renderiza exatamente cinco posições do dia local atual até hoje + 4, em ordem; cada posição mostra data, condição e mínima/máxima quando disponíveis; probabilidade ausente aparece como “Indisponível”; ausência de condição ou mínima/máxima mostra “Previsão indisponível” sem remover ou deslocar a posição.
- **Dependências:** T-03, T-04, T-05, T-09.
- **Arquivos prováveis:** `src/components/ForecastList.tsx`, `src/components/ForecastDay.tsx`.
- **Rastreabilidade:** AC-03.1–AC-03.3; AC-03.5.

### T-13 — Criar seletor de unidade
- **Tipo:** UI
- **Descrição:** Implementar seletor acessível Celsius/Fahrenheit ligado à unidade da sessão.
- **Critérios de aceite:** Seletor mostra a unidade recebida por prop; selecionar Fahrenheit/Celsius emite exatamente o valor selecionado e atualiza temperaturas atuais e previstas; teste com `20 °C` mostra `68 °F`; cidade, datas, condição, umidade, vento e precipitação permanecem iguais; controle pode ser operado por teclado e seu estado selecionado tem nome/estado acessível.
- **Dependências:** T-03, T-09.
- **Arquivos prováveis:** `src/components/UnitToggle.tsx`.
- **Rastreabilidade:** AC-04.2–AC-04.4; NFR-03.

### T-14 — Apresentar estados e ações de recuperação
- **Tipo:** UI
- **Descrição:** Mostrar estados de busca/clima, mensagens de erro e ações correspondentes de repetição.
- **Critérios de aceite:** Estados exibem textos distintos para carregamento, “Nenhuma cidade encontrada”, falha de busca, falha meteorológica e dados incompletos; falha meteorológica não renderiza previsão anterior como atual; cada ação de retry chama somente a operação correspondente; status/mensagens usam semântica anunciável e ações têm nome acessível e suporte a teclado.
- **Dependências:** T-08, T-09.
- **Arquivos prováveis:** `src/components/WeatherStatus.tsx`.
- **Rastreabilidade:** AC-01.4–AC-01.6; AC-02.3–AC-02.5; AC-03.3–AC-03.4; NFR-03.

### T-15 — Criar aviso de privacidade da busca
- **Tipo:** UI
- **Descrição:** Informar que o nome da cidade consultada é enviado ao Open-Meteo.
- **Critérios de aceite:** Texto visível em pt-BR informa explicitamente que o nome da cidade digitada é enviado ao Open-Meteo; não afirma que outros dados pessoais são enviados nem que a cidade é persistida.
- **Dependências:** T-01.
- **Arquivos prováveis:** `src/components/PrivacyNotice.tsx`.
- **Rastreabilidade:** NFR-08.

## Entrega 6 — Integração

### T-16 — Integrar fluxo no App
- **Tipo:** UI
- **Descrição:** Integrar busca, seleção, status e aviso de privacidade em uma primeira tela executável.
- **Critérios de aceite:** `App` instancia `useWeather` uma vez; buscar permite ver e selecionar resultado; seleção inicia consulta meteorológica; loading e erros de busca têm apresentação visível; aviso de privacidade aparece junto à busca; conteúdo está em pt-BR.
- **Dependências:** T-08, T-10, T-14, T-15.
- **Arquivos prováveis:** `src/App.tsx`.
- **Rastreabilidade:** FR-01; AC-01.1–AC-01.6; NFR-02; NFR-08.

### T-17 — Integrar condições atuais e unidade
- **Tipo:** UI
- **Descrição:** Ampliar a tela integrada para apresentar condições atuais e alternar unidade.
- **Critérios de aceite:** Após seleção, `App` apresenta o painel atual; alternar Celsius/Fahrenheit atualiza todas as temperaturas exibidas sem nova consulta; cidade e outras medidas permanecem inalteradas.
- **Dependências:** T-09, T-11, T-13, T-16.
- **Arquivos prováveis:** `src/App.tsx`.
- **Rastreabilidade:** FR-02; FR-04; AC-02.1–AC-02.6; AC-04.1–AC-04.5.

### T-18 — Integrar previsão diária
- **Tipo:** UI
- **Descrição:** Completar a tela integrada com a previsão de cinco dias.
- **Critérios de aceite:** Após seleção, a tela mostra condições atuais e cinco dias locais; os dias preservam ordem/lacunas e usam a unidade ativa; estado de erro não apresenta previsão anterior como atual.
- **Dependências:** T-12, T-17.
- **Arquivos prováveis:** `src/App.tsx`.
- **Rastreabilidade:** FR-03; AC-03.1–AC-03.5.

## Entrega 7 — Testes

### T-19 — Testar conversão de unidade Celsius/Fahrenheit
- **Tipo:** Test
- **Descrição:** Testar a conversão de unidade Celsius/Fahrenheit, o arredondamento de apresentação e valores ausentes/negativos.
- **Critérios de aceite:** Testes afirmam `0 °C = 32 °F`, `-40 °C = -40 °F` e `68 °F = 20 °C`; verificam que a conversão mantém precisão e que o formatador arredonda `25,4 °C` para `25` e `77,72 °F` para `78`; valor ausente não produz número.
- **Dependências:** T-03, T-17.
- **Arquivos prováveis:** `tests/unit/temperature.test.ts`.
- **Rastreabilidade:** AC-04.2–AC-04.4.

### T-20 — Testar mapeamento de códigos meteorológicos
- **Tipo:** Test
- **Descrição:** Verificar rótulos pt-BR e fallback para códigos não mapeados.
- **Critérios de aceite:** Testes afirmam que código `2` retorna exatamente “Parcialmente nublado”; código não cadastrado e código ausente retornam exatamente “Condição indisponível”; chamadas repetidas com o mesmo código retornam o mesmo rótulo.
- **Dependências:** T-04, T-17.
- **Arquivos prováveis:** `tests/unit/weatherCodes.test.ts`.
- **Rastreabilidade:** AC-02.2; AC-03.2–AC-03.3.

### T-21 — Testar formatação de datas e horários
- **Tipo:** Test
- **Descrição:** Verificar fuso local da cidade e preservação das datas diárias.
- **Critérios de aceite:** Com fuso de teste fixo, `2026-01-01T01:00:00Z` em `America/Los_Angeles` representa 31/12/2025 às 17:00 local; data diária `2026-01-01` permanece nesse dia; data/fuso ausente ou inválido retorna `undefined`; resultados não variam conforme o fuso local do runner.
- **Dependências:** T-05, T-17.
- **Arquivos prováveis:** `tests/unit/dateTime.test.ts`.
- **Rastreabilidade:** AC-02.6; AC-03.1; NFR-02.

### T-22 — Testar serviço de geocodificação
- **Tipo:** Test
- **Descrição:** Testar parâmetros, mapeamento e classificação de resultados/erros com `fetch` mockado.
- **Critérios de aceite:** Com `fetch` mockado, testes verificam que a query contém somente `name`, `count`, `language` e `format`, além do mapeamento de todos os campos `City`; resposta sem `results` e `results: []` dão lista vazia; HTTP não-2xx, rejeição de rede, timeout e JSON inválido são quatro cenários de erro; nenhum cenário de erro retorna lista vazia.
- **Dependências:** T-06, T-16.
- **Arquivos prováveis:** `tests/unit/weatherService.test.ts`.
- **Rastreabilidade:** AC-01.1–AC-01.6; NFR-05.

### T-23 — Testar estados e concorrência da busca
- **Tipo:** Test
- **Descrição:** Verificar busca vazia, estados, seleção, repetição e respostas atrasadas.
- **Critérios de aceite:** Testes verificam zero chamadas para consulta vazia, estados loading/success/empty/error, limpeza de resultados antigos ao receber vazio, seleção usando as coordenadas do resultado, repetição somente após ação e duas buscas resolvidas fora de ordem sem sobrescrita da busca mais recente.
- **Dependências:** T-08, T-16.
- **Arquivos prováveis:** `tests/unit/useWeather.test.ts`.
- **Rastreabilidade:** AC-01.1–AC-01.6.

### T-24 — Testar mapeamento e falhas da previsão
- **Tipo:** Test
- **Descrição:** Cobrir parâmetros e mapeamento do serviço meteorológico com `fetch` mockado.
- **Critérios de aceite:** Com `fetch` mockado, testes verificam todos os parâmetros da URL e o mapeamento de cada campo atual/diário; fixture com cinco datas e lacunas mantém as mesmas datas/índices e campos ausentes como `undefined`; testes separados verificam HTTP/API, rede, timeout e JSON/formato inválido; resposta parcial continua sendo sucesso.
- **Dependências:** T-07, T-18.
- **Arquivos prováveis:** `tests/unit/weatherService.test.ts`.
- **Rastreabilidade:** AC-02.3–AC-02.5; AC-03.1–AC-03.4.

### T-25 — Testar estados meteorológicos do hook
- **Tipo:** Test
- **Descrição:** Verificar sucesso completo/parcial, falhas, repetição e proteção contra respostas obsoletas.
- **Critérios de aceite:** Testes afirmam que hook novo inicia em Celsius e não lê/grava `localStorage`/`sessionStorage`; verificam transições loading→complete, loading→partial e loading→error; retry após ação chama serviço uma vez com cidade ativa; promises resolvidas fora de ordem preservam a seleção mais recente; mudança de unidade não aumenta contagem de chamadas; fixtures ausentes/antigas não recebem estado de atualidade.
- **Dependências:** T-09, T-18.
- **Arquivos prováveis:** `tests/unit/useWeather.test.ts`.
- **Rastreabilidade:** AC-02.3–AC-02.5; AC-03.3–AC-03.4; AC-04.1–AC-04.5; NFR-08; NFR-09.

### T-26 — Testar componentes de busca e resultados
- **Tipo:** Test
- **Descrição:** Verificar validação, acessibilidade e desambiguação dos controles de busca.
- **Critérios de aceite:** Testing Library localiza o campo pelo nome acessível; envio vazio mostra validação e não chama busca; teclado permite enviar e percorrer resultados; fixture com localidades distintas verifica cidade/país/região e coordenadas no caso aplicável; clique/teclado no resultado seleciona somente a opção ativada.
- **Dependências:** T-10, T-16.
- **Arquivos prováveis:** `tests/unit/searchComponents.test.tsx`.
- **Rastreabilidade:** AC-01.2; AC-01.5; NFR-03.

### T-27 — Testar painel de condições atuais
- **Tipo:** Test
- **Descrição:** Verificar campos atuais completos, opcionais e indisponíveis.
- **Critérios de aceite:** Assertions verificam cidade/país, condição, horário e temperatura da fixture completa; cada opcional ausente tem marcador “Indisponível”; ausência de cada campo obrigatório gera “Dados atuais incompletos”; fixture fora do frescor aprovado não é apresentada como atual.
- **Dependências:** T-11, T-17.
- **Arquivos prováveis:** `tests/unit/CurrentWeather.test.tsx`.
- **Rastreabilidade:** AC-02.1–AC-02.3; AC-02.6.

### T-28 — Testar componentes de previsão diária
- **Tipo:** Test
- **Descrição:** Verificar ordem, quantidade e apresentação de dias incompletos.
- **Critérios de aceite:** Com fixture de cinco datas, teste afirma exatamente cinco itens na mesma ordem; fixture com lacuna mantém a data/posição correspondente; dia sem condição ou mínima/máxima mostra “Previsão indisponível”; probabilidade ausente mostra “Indisponível”.
- **Dependências:** T-12, T-18.
- **Arquivos prováveis:** `tests/unit/ForecastList.test.tsx`.
- **Rastreabilidade:** AC-03.1–AC-03.3; AC-03.5.

### T-29 — Testar seletor de unidade
- **Tipo:** Test
- **Descrição:** Verificar interação por teclado e callback do seletor Celsius/Fahrenheit.
- **Critérios de aceite:** Testes verificam a unidade recebida pelo seletor, navegação/seleção por teclado e callback com Fahrenheit/Celsius; ao alternar, callback de busca/clima não é chamado.
- **Dependências:** T-13, T-17.
- **Arquivos prováveis:** `tests/unit/UnitToggle.test.tsx`.
- **Rastreabilidade:** AC-04.2–AC-04.4; NFR-03.

### T-30 — Testar componentes nos estados loading, erro e vazio
- **Tipo:** Test
- **Descrição:** Verificar a apresentação dos estados de busca e clima e as ações de recuperação dos componentes.
- **Critérios de aceite:** Testing Library confirma estado de carregamento de busca/clima, texto “Nenhuma cidade encontrada”, erro de busca distinto do vazio, erro meteorológico distinto do erro de busca e dados incompletos; cada estado expõe role apropriado (`status` ou `alert`); cada botão de retry chama exatamente o callback de sua operação uma vez.
- **Dependências:** T-10, T-14, T-16.
- **Arquivos prováveis:** `tests/unit/WeatherStatus.test.tsx`.
- **Rastreabilidade:** AC-01.4–AC-01.6; AC-02.3–AC-02.4; AC-03.4; NFR-03.

### T-31 — Testar composição do App
- **Tipo:** Test
- **Descrição:** Verificar a conexão entre busca, seleção e apresentação no fluxo integrado.
- **Critérios de aceite:** Com APIs mockadas, teste de integração digita uma cidade, seleciona um resultado, aguarda temperatura e cinco dias e verifica o aviso junto à busca; asserts confirmam que o clima solicitado usa as coordenadas da opção selecionada.
- **Dependências:** T-18.
- **Arquivos prováveis:** `tests/unit/App.test.tsx`.
- **Rastreabilidade:** FR-01–FR-04; NFR-08.

### T-32 — Cobrir fluxo e falhas com Playwright
- **Tipo:** Test
- **Descrição:** Validar os fluxos ponta a ponta com respostas determinísticas interceptadas.
- **Critérios de aceite:** Com rotas Open-Meteo interceptadas, fluxo principal busca→seleção→clima atual→cinco dias→alternância de unidade passa em `1440x900` e `375x812`; alternar unidade não aumenta a contagem de requests de forecast; cenários independentes verificam zero resultados, falha/timeout com retry manual e troca de cidade durante carregamento sem renderizar a resposta obsoleta.
- **Dependências:** T-18, T-31.
- **Arquivos prováveis:** `tests/e2e/weather-app.spec.ts`.
- **Rastreabilidade:** AC-01.2–AC-01.6; AC-02.5; AC-03.1–AC-03.4; AC-04.2.

## Entrega 8 — Hardening

### T-33 — Validar responsividade, acessibilidade e navegadores
- **Tipo:** Test
- **Descrição:** Validar requisitos não funcionais aprovados nos viewports e navegadores definidos.
- **Critérios de aceite:** Busca e consulta são verificadas em larguras 320, 375, 768, 1024, 1440 e 1920 px, com 320/375 em retrato e paisagem; `scrollWidth` não excede `clientWidth` e os controles do fluxo são operáveis por teclado; matriz registra resultado por família aprovada: Chrome/Edge/Firefox/Safari estáveis atual e anterior em desktop, Safari atual no iOS e Chrome atual no Android; violações WCAG 2.2 AA encontradas são registradas como falha, não omitidas.
- **Dependências:** T-01, T-32.
- **Arquivos prováveis:** `tests/e2e/weather-app.spec.ts`, `playwright.config.ts`.
- **Rastreabilidade:** NFR-01; NFR-03; NFR-07.

### T-34 — Executar gates de qualidade
- **Tipo:** Infra
- **Descrição:** Rodar lint, build e testes após a implementação e registrar falhas relevantes.
- **Critérios de aceite:** `pnpm lint`, `pnpm build` e `pnpm test` são executados e cada comando tem código de saída 0; qualquer comando com saída diferente de 0 é registrado como gate não aprovado, com saída/causa, sem ser marcado como concluído.
- **Dependências:** T-19–T-33.
- **Arquivos prováveis:** `package.json`.
- **Rastreabilidade:** Qualidade de entrega; FR-01–FR-04.