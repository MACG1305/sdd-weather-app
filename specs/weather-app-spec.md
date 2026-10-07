# Especificação de Produto — Weather App

**Status:** proposta de baseline de produção, pendente de aprovação dos gates em Open Questions. Critérios são verificáveis após aprovação dos valores propostos.

## Overview

O Weather App permite que uma pessoa pesquise uma cidade, consulte suas condições meteorológicas atuais e veja uma previsão diária de cinco dias. A pessoa pode alternar a unidade de temperatura entre Celsius e Fahrenheit. A primeira versão usa Open-Meteo sem chave de API, apresenta a interface em pt-BR, usa Celsius por padrão e não exige autenticação nem persiste dados no servidor.

O produto atende a três necessidades hipotéticas: decisão rápida do dia a dia, planejamento dos próximos dias e consulta de uma localidade durante deslocamentos. Essas personas ainda precisam ser validadas. O objetivo de produto é ajudar a pessoa a encontrar e interpretar a previsão da cidade correta; métricas de adoção e metas quantitativas ainda não foram acordadas.

## Functional Requirements

- **FR-01 — Buscar e selecionar cidade:** permitir busca por nome de cidade e seleção explícita de uma localidade identificada por cidade, região administrativa quando disponível e país.
- **FR-02 — Consultar condições atuais:** após selecionar uma localidade, exibir temperatura, condição meteorológica e horário de referência como campos obrigatórios; sensação térmica, umidade relativa, velocidade do vento, precipitação acumulada no intervalo reportado pelo provedor e pressão atmosférica local são campos opcionais.
- **FR-03 — Consultar previsão diária:** exibir cinco dias locais consecutivos, de hoje até hoje + 4, com data, condição e temperaturas mínima/máxima como campos obrigatórios; probabilidade de precipitação é exibida quando fornecida.
- **FR-04 — Alternar unidade de temperatura:** iniciar em Celsius e permitir alternar para Fahrenheit; aplicar a unidade escolhida a todas as temperaturas atuais e previstas, sem alterar outros valores.

## User Stories

- **US-01 (FR-01 — Buscar e selecionar cidade):** Como **Decisor do dia a dia**, quero buscar uma cidade e selecioná-la para consultar o tempo da localidade onde estou.
- **US-02 (FR-01 — Buscar e selecionar cidade):** Como **Pessoa em deslocamento**, quero distinguir e selecionar a cidade correta entre resultados semelhantes para não consultar a previsão de outro lugar.
- **US-03 (FR-02 — Consultar condições atuais):** Como **Decisor do dia a dia**, quero ver as condições meteorológicas atuais da cidade selecionada para decidir como me preparar para o clima.
- **US-04 (FR-03 — Consultar previsão de cinco dias):** Como **Planejadora da semana**, quero consultar a previsão de hoje e dos quatro dias seguintes para escolher quando realizar atividades ou organizar compromissos.
- **US-05 (FR-04 — Alternar unidade de temperatura):** Como **Pessoa em deslocamento**, quero alternar entre Celsius e Fahrenheit para interpretar as temperaturas na unidade que prefiro.

## Matriz de Rastreabilidade

Cada linha liga uma história aos critérios de aceite que a verificam e aos NFRs relevantes para implementação e teste. Os NFRs listados são referências, não repetição dos critérios funcionais.

| User Story | Requisito funcional | Acceptance Criteria | NFRs relevantes |
| --- | --- | --- | --- |
| **US-01 — Buscar cidade (Decisor do dia a dia)** | FR-01 | AC-01.1, AC-01.3, AC-01.4, AC-01.5, AC-01.6 | NFR-01 Responsividade; NFR-02 Idioma/unidades; NFR-03 Acessibilidade; NFR-04 Desempenho; NFR-05 Resiliência; NFR-06 Disponibilidade; NFR-07 Compatibilidade; NFR-08 Privacidade; NFR-09 Integridade dos dados |
| **US-02 — Desambiguar cidade (Pessoa em deslocamento)** | FR-01 | AC-01.1, AC-01.2, AC-01.3, AC-01.4, AC-01.6 | NFR-01 Responsividade; NFR-02 Idioma/unidades; NFR-03 Acessibilidade; NFR-04 Desempenho; NFR-05 Resiliência; NFR-06 Disponibilidade; NFR-07 Compatibilidade; NFR-08 Privacidade; NFR-09 Integridade dos dados |
| **US-03 — Consultar condições atuais (Decisor do dia a dia)** | FR-02 | AC-02.1 a AC-02.6 | NFR-01 Responsividade; NFR-02 Idioma/unidades; NFR-03 Acessibilidade; NFR-04 Desempenho; NFR-05 Resiliência; NFR-06 Disponibilidade; NFR-07 Compatibilidade; NFR-08 Privacidade; NFR-09 Frescor/integridade |
| **US-04 — Consultar previsão (Planejadora da semana)** | FR-03 | AC-03.1 a AC-03.5 | NFR-01 Responsividade; NFR-02 Idioma/unidades; NFR-03 Acessibilidade; NFR-04 Desempenho; NFR-05 Resiliência; NFR-06 Disponibilidade; NFR-07 Compatibilidade; NFR-08 Privacidade; NFR-09 Frescor/integridade |
| **US-05 — Alternar unidade (Pessoa em deslocamento)** | FR-04 | AC-04.1 a AC-04.5 | NFR-01 Responsividade; NFR-02 Idioma/unidades; NFR-03 Acessibilidade; NFR-07 Compatibilidade; NFR-08 Privacidade |

## Acceptance Criteria

Os critérios usam os campos e formatos propostos nos requisitos funcionais. Aprovar ou alterar esse contrato é o gate Q-01.

### FR-01 — Buscar e selecionar cidade

- **AC-01.1:** Ao enviar uma consulta não vazia, o sistema remove espaços apenas das extremidades e pesquisa o texto sem perder acentos, apóstrofos ou hífens.
- **AC-01.2:** Cada resultado identifica cidade e país e inclui região administrativa quando fornecida pelo geocodificador. Se não houver região e nomes iguais permanecerem ambíguos, mostrar coordenadas quando disponíveis e exigir seleção explícita; nunca selecionar automaticamente.
- **AC-01.3:** Selecionar um resultado define sua identidade geográfica como localidade ativa e inicia consultas meteorológicas para essa mesma localidade.
- **AC-01.4:** Uma resposta bem-sucedida sem correspondências apresenta estado “Nenhuma cidade encontrada”, mantém a consulta e não reutiliza dados de busca anterior.
- **AC-01.5:** Campo vazio ou composto somente por espaços não envia requisição e apresenta validação junto ao campo.
- **AC-01.6:** Falha/timeout do geocodificador apresenta estado de erro distinto de “Nenhuma cidade encontrada” e permite repetição manual.

### FR-02 — Consultar condições atuais

- **AC-02.1:** O painel identifica cidade, região e país e apresenta temperatura (°C/°F), condição meteorológica e horário de referência. Sensação térmica (°C/°F), umidade relativa (%), velocidade do vento (km/h), precipitação acumulada (mm) e pressão atmosférica local (hPa) são apresentados quando retornados.
- **AC-02.2:** Códigos meteorológicos conhecidos são apresentados com o rótulo pt-BR correspondente; código desconhecido é apresentado como “Condição indisponível”.
- **AC-02.3:** Campo opcional ausente é marcado como indisponível; se faltar temperatura, condição ou horário de referência, o painel apresenta estado “Dados atuais incompletos” e não afirma que as condições estão atuais. Nenhum campo é substituído por zero, valor de outra cidade ou dado inferido.
- **AC-02.4:** Durante a requisição é mostrado carregamento; em falha ou timeout, esse estado termina, uma mensagem explica que os dados atuais não foram carregados e há ação para tentar novamente.
- **AC-02.5:** Quando novos dados chegam, o painel corresponde à cidade atualmente selecionada; uma resposta atrasada de uma seleção anterior não pode sobrescrevê-lo.
- **AC-02.6:** Todos os valores de temperatura seguem a unidade ativa; o horário de referência é apresentado no fuso local da cidade.

### FR-03 — Consultar previsão de cinco dias

- **AC-03.1:** A previsão contém cinco posições consecutivas, da data atual até a data local atual + 4, calculadas no fuso da cidade selecionada.
- **AC-03.2:** Cada posição identifica a data e apresenta condição, mínima e máxima. Probabilidade de precipitação (%) é apresentada quando fornecida; qualquer campo opcional ausente é rotulado “Indisponível”.
- **AC-03.3:** As cinco posições estão em ordem cronológica e pertencem à localidade ativa; lacunas de dados não reduzem nem deslocam as datas apresentadas. Se faltar condição, mínima ou máxima, a posição permanece e indica “Previsão indisponível”.
- **AC-03.4:** Em falha, timeout ou limite de requisições do provedor, a interface informa indisponibilidade temporária, não apresenta previsão anterior como atual e oferece ação para tentar novamente.
- **AC-03.5:** Temperaturas mínimas e máximas usam a unidade ativa; outras medidas permanecem em suas unidades definidas em NFR-02.

### FR-04 — Alternar unidade de temperatura

- **AC-04.1:** Em uma nova sessão, a unidade inicial é Celsius.
- **AC-04.2:** Selecionar Fahrenheit atualiza todas as temperaturas atuais e previstas sem nova consulta meteorológica; selecionar Celsius restaura os valores em Celsius.
- **AC-04.3:** A conversão usa $F = C \times 9/5 + 32$ e $C = (F - 32) \times 5/9$, arredondando para o inteiro mais próximo apenas na apresentação.
- **AC-04.4:** Alternar unidade não altera cidade, datas, condição ou valores de umidade, vento e precipitação.
- **AC-04.5:** A preferência vale até o fim da sessão; ao iniciar nova sessão, volta a Celsius. Preferência local persistente não faz parte da v1.

## Non-Functional Requirements

Metas marcadas **(proposta)** formam o baseline recomendado e exigem aceite do responsável de produto antes da implementação.

- **NFR-01 — Responsividade (proposta):** os fluxos principais devem funcionar em larguras de 320 px a 1920 px, sem rolagem horizontal da página nem controles inacessíveis. Validar ao menos em 320, 375, 768, 1024 e 1440 px, em orientação retrato e paisagem.
- **NFR-02 — Idioma e unidades (proposta):** textos e mensagens da interface em pt-BR; datas e horários em pt-BR e no fuso da cidade consultada; umidade e probabilidade de precipitação em %, vento em km/h, precipitação acumulada em mm e pressão atmosférica local em hPa. Temperaturas seguem FR-04.
- **NFR-03 — Acessibilidade (proposta):** conformidade WCAG 2.2 nível AA nos fluxos de busca, seleção, consulta e troca de unidade. Toda ação deve ser operável por teclado, ter foco visível, nome acessível e estado anunciado por tecnologia assistiva; não depender exclusivamente de cor.
- **NFR-04 — Desempenho (proposta):** em perfil de rede móvel de referência de 10 Mbps e RTT de 100 ms, p95 de resposta da busca <= 3 s e p95 de renderização do clima após seleção <= 5 s. Medir do envio/seleção à apresentação do resultado, em janela de 30 dias e com pelo menos 100 amostras por fluxo.
- **NFR-05 — Timeout e resiliência (proposta):** cada requisição externa termina em sucesso ou erro em até 10 s. Timeout, erro de rede, limite do provedor e resposta inválida têm estados distintos de “nenhum resultado”; a tentativa seguinte é iniciada somente por ação explícita da pessoa. A v1 não oferece modo offline nem apresenta cache como dado atual.
- **NFR-06 — Disponibilidade (proposta):** disponibilidade mensal de 99,5% para os fluxos de consulta, medida por verificações sintéticas externas a cada minuto; indisponibilidade do provedor conta como falha do fluxo. Excluir apenas falha comprovada da própria rede do monitor de teste e manutenção anunciada.
- **NFR-07 — Compatibilidade (proposta):** suportar as versões estáveis atual e anterior de Chrome, Edge, Firefox e Safari em desktop, além de Safari atual no iOS e Chrome atual no Android. Validar os fluxos de ponta a ponta em cada família suportada.
- **NFR-08 — Privacidade e segurança:** sem autenticação, geolocalização automática ou persistência de dados no servidor. A unidade vive apenas na sessão e reinicia em Celsius; a cidade não é retida ao iniciar nova sessão. Todo tráfego usa HTTPS. Informar que o nome da cidade consultada é enviado ao Open-Meteo; não enviar outros dados pessoais.
- **NFR-09 — Frescor e integridade dos dados (proposta):** apresentar horário de referência fornecido pelo provedor. Dados com mais de 3 h, ou sem horário de referência, não devem ser rotulados como atuais; exibir aviso de desatualização ou indisponibilidade. Campos ausentes seguem FR-02/FR-03 e nunca são substituídos por valores inferidos.

## Edge Cases

- **Cidade inexistente:** quando uma busca válida não corresponder a uma localidade, informar que a cidade não foi encontrada, manter a consulta disponível para correção e não carregar nem exibir clima de outra cidade.
- **Input vazio:** se o campo estiver vazio ou contiver apenas espaços, não iniciar a busca; informar que é necessário digitar uma cidade e manter o fluxo utilizável.
- **Caracteres especiais:** preservar nomes com acentos, espaços, apóstrofos e hífens (por exemplo, “São Paulo” e “St. John's”) durante a busca. Caracteres não reconhecidos não devem travar a aplicação nem ser interpretados como comandos; se não houver correspondência, apresentar o estado de nenhum resultado.
- **Falha de API:** se o serviço de geocodificação ou meteorologia retornar erro ou estiver indisponível, informar que não foi possível concluir a operação, preservar a cidade/consulta atual e oferecer uma tentativa manual de repetição. Não apresentar a falha como “cidade não encontrada” nem substituir dados atuais por valores inventados.
- **Timeout:** se a resposta exceder 10 s, encerrar o estado de carregamento, informar que a consulta demorou demais e permitir nova tentativa.
- **Geocoding sem resultados:** quando o serviço de localização responder com sucesso, mas sem correspondências, informar que nenhum resultado foi encontrado e sugerir conferir a grafia ou adicionar região/país. Manter o texto digitado e não consultar ou exibir a previsão de uma busca anterior.
- **Resposta parcial:** exibir somente os campos válidos recebidos e identificar os campos ausentes como indisponíveis; nunca substituí-los por zero ou por valores inferidos. Se algum campo obrigatório de FR-02 ou FR-03 estiver ausente, informar que os dados estão incompletos.
- **Cidades homônimas sem região:** não selecionar resultado automaticamente; mostrar país e coordenadas se disponíveis e solicitar seleção explícita. Se os resultados não puderem ser distinguidos, pedir uma consulta mais específica.
- **Limite de requisições ou resposta inválida:** mostrar indisponibilidade temporária com ação para repetir; não tratar limite/erro como busca sem resultados.
- **Sem observação atual:** mostrar “Dados atuais indisponíveis” e nunca rotular a última observação como atual se exceder NFR-09.
- **Previsão incompleta:** manter as cinco datas; para qualquer dia sem condição ou mínima/máxima, indicar “Previsão indisponível” sem deslocar dados para outro dia.
- Os dados recebidos têm mais de 3 h, não incluem fuso ou atravessam a mudança de dia na localidade consultada; aplicar NFR-02 e NFR-09 e nunca rotular dado antigo como atual.
- A pessoa troca de cidade enquanto uma consulta anterior ainda está carregando; a resposta antiga não deve ser atribuída à cidade nova.
- A pessoa alterna unidade durante carregamento ou diante de valores ausentes; nenhum valor ausente deve ser convertido ou mostrado como zero.
- A pessoa fica sem conexão durante a busca ou consulta: mostrar erro de conexão e ação para tentar novamente; a v1 não exibe dados em cache/offline.
- O nome, a condição meteorológica ou outra informação fornecida pela fonte não pode ser apresentado em pt-BR; mostrar o rótulo traduzido aprovado para o código meteorológico ou, se não houver mapeamento, “Condição indisponível”.
- A cidade consultada fica em outro país ou fuso horário, e datas, horários e unidades regionais podem não corresponder às preferências da pessoa.

## Assumptions

- As decisões confirmadas pelo negócio são: Open-Meteo sem chave de API; previsão de hoje mais quatro dias; Celsius como padrão; sem autenticação; sem persistência de dados no servidor; interface em pt-BR.
- A proposta de escopo é uma aplicação web responsiva acessível por navegador, sem instalação PWA nem app nativo; exige aprovação no gate Q-01.
- A busca manual é o fluxo-base; geolocalização automática não foi solicitada e não é presumida nesta especificação.
- As personas descritas no discovery são hipóteses, não resultados de pesquisa com usuários.
- Os campos meteorológicos, unidades não térmicas, comportamento sem rede e metas operacionais descritos nesta especificação são propostas de baseline, sujeitas aos gates listados em Open Questions.

## Risks

As probabilidades são estimativas iniciais do discovery e devem ser reavaliadas após validar público, cobertura e termos do provedor.

| Risco | Probabilidade | Impacto | Mitigação |
| --- | --- | --- | --- |
| Resultados de busca ambíguos levam a consultar a cidade errada | Alta | Alto: informação meteorológica incorreta para a localidade pretendida | Exibir contexto geográfico nos resultados e validar cobertura de geocodificação para as regiões prioritárias |
| A cobertura, os termos ou os limites do Open-Meteo não atendem ao produto | Média | Alto: restrições legais, indisponibilidade ou necessidade de rever fornecedor e escopo | Validar termos, atribuição, disponibilidade, cobertura e limites antes do baseline |
| Dados atrasados, ausentes ou imprecisos não atendem à expectativa | Média | Alto: decisões tomadas com informação incompleta ou desatualizada | Aplicar o limite de frescor de 3 h proposto; marcar campos ausentes e mostrar o horário de referência |
| Conversão ou arredondamento de unidades está incorreto | Baixa | Alto: leitura equivocada das temperaturas | Testar as fórmulas de conversão, arredondamento ao inteiro mais próximo e valores próximos a limites de unidade |
| Fusos e limites de dia alteram a janela de cinco dias | Média | Médio: datas inconsistentes entre cidade e dispositivo | Usar o fuso da cidade e testar mudanças de data, UTC e transições de horário de verão |
| Metas propostas de desempenho, disponibilidade ou acessibilidade não são aprovadas ou não são atingidas | Média | Alto: aceite subjetivo, retrabalho ou experiência abaixo do esperado | Obter aprovação explícita dos alvos NFR antes do baseline e medir cada alvo no ambiente definido |
| Personas não validadas resultam em conteúdo ou prioridades inadequadas | Média | Alto: baixa utilidade e adoção | Validar cenários e prioridades com usuários representativos antes de fechar os requisitos de conteúdo |
| Indisponibilidade ou lentidão de rede/provedor interrompe os fluxos | Média | Alto: busca ou consulta fica inutilizável | Aplicar timeout de 10 s, mensagem de falha distinta de ausência de resultados, repetição manual e monitoramento sintético NFR-06; não exibir cache offline na v1 |

## Out of Scope

- Autenticação, contas e persistência de dados no servidor.
- Alertas de tempo severo, notificações e monitoramento proativo de condições.
- Histórico de consultas, favoritos, preferências persistentes no dispositivo e sincronização entre dispositivos.
- Geolocalização automática; o fluxo-base é busca manual até decisão em contrário.
- Operação offline ou apresentação de dados meteorológicos em cache sem conexão.
- Mapas, radar, qualidade do ar, analytics de terceiros e personalização da previsão por hora.

## Open Questions

Os itens abaixo são gates de aprovação. Os valores propostos permitem teste e planejamento, mas não devem ser tratados como compromisso de negócio antes do aceite do Product Owner.

- **Q-01 — Escopo MVP:** aprovar aplicação web responsiva, sem PWA/app nativo, e o conjunto de campos FR-02/FR-03. Se houver alteração, atualizar requisitos, conteúdo e matriz de compatibilidade.
- **Q-02 — Fonte e mercado:** confirmar que os serviços Open-Meteo para geocodificação e meteorologia cobrem os países prioritários e aprovar seus termos, atribuição, disponibilidade e limites para o volume esperado.
- **Q-03 — Metas operacionais:** aprovar ou substituir os alvos propostos em NFR-01 a NFR-07 e NFR-09, incluindo se a meta de disponibilidade ponta a ponta contabiliza indisponibilidade do provedor.
- **Q-04 — Público e sucesso:** validar as personas hipotéticas e escolher a persona prioritária; definir uma métrica de produto e seu alvo para a primeira versão.
- **Q-05 — Dados e frescor:** validar se o limite de 3 h é aceitável para rotular dados como atuais e se deve ser exibido o horário de referência do provedor.