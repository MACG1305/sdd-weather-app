# Análise de Discovery — Aplicação de Previsão do Tempo

## Contexto

A empresa solicitou uma aplicação de previsão do tempo para que usuários consultem informações meteorológicas de cidades. O briefing estabelece cinco capacidades centrais: buscar cidades, consultar o clima atual, ver uma previsão de cinco dias, alternar entre Celsius e Fahrenheit e utilizar a aplicação em dispositivos móveis. Ainda não define público-alvo, plataforma técnica, fonte dos dados ou nível de detalhe meteorológico.

## Personas

As personas abaixo são hipóteses iniciais derivadas do briefing, não perfis validados por pesquisa. Os objetivos e métricas devem ser confirmados com usuários representativos.

| Persona | Objetivo principal | Contexto de uso | Métrica de sucesso pela perspectiva da pessoa |
| --- | --- | --- | --- |
| **Decisor do dia a dia** | Verificar rapidamente as condições atuais para decidir como se vestir ou se precisa levar proteção contra chuva | Principalmente mobile, pouco antes de sair ou durante a rotina | Encontra a previsão da cidade desejada e toma uma decisão em até 30 segundos, sem confundir condição ou unidade |
| **Planejadora da semana** | Comparar a previsão dos próximos cinco dias para escolher quando realizar atividades ou organizar compromissos | Principalmente desktop, em sessões de planejamento; pode consultar no mobile | Consegue identificar em uma única consulta quais dias atendem às suas necessidades, sem precisar buscar cada dia separadamente |
| **Pessoa em deslocamento** | Consultar o clima de uma cidade que não é a sua localidade habitual e compreender a temperatura na unidade que prefere | Mobile, em trânsito ou ao preparar uma viagem; pode ter conexão instável | Localiza a cidade correta e interpreta a temperatura sem ambiguidade de localidade ou unidade |

## Requisitos Funcionais

- **RF1 — Busca de cidades:** permitir que o usuário pesquise uma cidade e selecione a localidade desejada.
- **RF2 — Clima atual:** exibir as condições meteorológicas atuais da cidade selecionada. As métricas e o nível de detalhe precisam ser definidos.
- **RF3 — Previsão de cinco dias:** exibir a previsão para cinco dias associada à cidade selecionada. É necessário definir se o período inclui o dia atual e quais informações serão apresentadas por dia.
- **RF4 — Alternância de unidade:** permitir alternar entre Celsius e Fahrenheit e atualizar os valores de temperatura exibidos.

## Requisitos Não-Funcionais

- **RNF1 — Responsividade:** interface e controles devem se adaptar a telas móveis; dimensões mínimas e dispositivos/navegadores suportados precisam ser acordados. Os fluxos de busca e consulta devem permanecer disponíveis sem perda das capacidades centrais.
- **RNF2 — Usabilidade:** busca, seleção da cidade e consulta do clima devem ser compreensíveis e utilizáveis em telas pequenas e grandes.
- **RNF3 — Desempenho:** busca e carregamento das condições meteorológicas devem ocorrer em tempo adequado para o usuário. Metas mensuráveis de tempo ainda precisam ser definidas.
- **RNF4 — Acessibilidade:** a interface deve permitir navegação por teclado, apresentar controles com nomes acessíveis e manter contraste legível.
- **RNF5 — Resiliência:** a aplicação deve comunicar falhas ou indisponibilidade de dados de forma compreensível. O comportamento esperado sem conexão ainda precisa ser definido.
- **RNF6 — Compatibilidade:** navegadores e versões suportados precisam ser acordados antes da implementação.

## Riscos

As probabilidades abaixo são estimativas iniciais, a validar após confirmar cobertura, condições do provedor, público e escopo. Impacto considera a consequência para usuários e operação.

| Categoria | Risco | Probabilidade | Impacto | Estratégia de mitigação |
| --- | --- | --- | --- | --- |
| Produto | O conteúdo exibido não corresponde às decisões que o público precisa tomar | Média | Alto: o app pode funcionar corretamente, mas não entregar valor e ter baixa adoção | Validar personas e cenários de uso; priorizar com usuários quais métricas devem aparecer no clima atual e na previsão |
| Produto | “Previsão de 5 dias” é interpretada de forma diferente por negócio e usuários | Média | Médio: datas e quantidade de dias podem parecer incorretas | Definir se inclui hoje, o fuso horário de referência e exemplos de datas esperadas nos critérios de aceite |
| Produto | Cidades homônimas ou resultados de busca imprecisos levam à seleção do local errado | Alta | Alto: informações meteorológicas incorretas para a localidade pretendida | Exibir região/estado e país nos resultados; validar cobertura e qualidade da geocodificação nas regiões prioritárias |
| Produto | Experiência móvel não funciona bem em telas pequenas ou conexões lentas | Média | Alto: usuários não conseguem completar busca e consulta ou abandonam o app | Definir dispositivos, larguras e metas de desempenho; testar fluxos em aparelhos e condições de rede representativos |
| Produto | Escopo permanece indefinido e cresce com pedidos de favoritos, alertas, histórico ou geolocalização | Alta | Médio: atrasos, aumento de custo e divergência sobre o que será entregue | Acordar objetivo e escopo da primeira versão; registrar explicitamente inclusões, exclusões e decisões pendentes |
| Técnico | Provedor de clima/geocodificação fica indisponível, lento, limita requisições ou altera seus termos | Média | Alto: busca ou previsão ficam parcial ou totalmente indisponíveis, ou geram custo inesperado | Avaliar SLA, limites, cobertura, termos e custos antes da escolha; implementar timeouts, tratamento de erros, cache compatível com a licença e plano de contingência |
| Técnico | Dados retornados têm atraso, baixa cobertura ou diferença relevante em relação às expectativas do usuário | Média | Alto: decisões podem ser tomadas com informação desatualizada ou inadequada | Definir critérios de frescor e cobertura; exibir horário/origem dos dados quando pertinente; monitorar qualidade e comunicar limitações |
| Técnico | Conversão, arredondamento ou formatação de unidades apresenta valores incorretos | Baixa | Alto: usuário pode interpretar incorretamente a temperatura ou outras medidas | Definir unidades e regras de arredondamento; usar conversões consistentes e testar limites e valores representativos |
| Técnico | Requisições lentas ou volume de uso excedem metas ou limites do provedor | Média | Alto: carregamento lento, erros ou indisponibilidade sob carga | Definir metas de latência e volume; medir desempenho, limitar chamadas redundantes e planejar cache e monitoramento respeitando os termos do provedor |
| Técnico | Geolocalização ou preferências coletadas são armazenadas ou expostas sem controles adequados | Baixa | Alto: perda de confiança, exposição de dados pessoais e possíveis consequências legais | Minimizar coleta e retenção; pedir permissão quando necessário; documentar finalidade e aplicar controles de acesso e proteção compatíveis com os dados tratados |

## Perguntas em Aberto

1. **Público e objetivo:** Quem usará o produto, em quais situações e qual decisão deve conseguir tomar com a informação? Como o sucesso será medido? **Impacto:** sem público e resultado esperado, não é possível priorizar dados, fluxos, métricas de produto nem validar se a solução atende ao negócio.
2. **Plataforma:** “usar em dispositivos móveis” significa um site responsivo, uma aplicação web instalável ou aplicativos nativos? **Impacto:** a resposta altera escopo, experiência, distribuição, custo e requisitos de suporte; presumir uma plataforma pode deixar usuários sem suporte.
3. **Cobertura geográfica:** quais países, regiões e localidades devem ser cobertos? A busca aceita nomes em idiomas diferentes, coordenadas ou apenas nomes de cidades? **Impacto:** limita a escolha do provedor e do serviço de geocodificação, e pode fazer a busca falhar para parte do público.
4. **Comportamento da busca:** a busca é acionada por envio ou sugere resultados enquanto se digita? Deve tolerar erros de digitação, acentos e nomes alternativos? **Impacto:** sem essa definição, esforço, latência percebida e critérios para busca útil ficam indefinidos.
5. **Cidades homônimas:** quais informações devem distinguir resultados (estado, região, país ou coordenadas) e qual deve ser selecionado quando houver múltiplas correspondências? **Impacto:** o usuário pode consultar o clima de uma cidade diferente da desejada.
6. **Localização do usuário:** a aplicação deve solicitar geolocalização ou iniciar sempre com busca manual? Se houver geolocalização, quando pedir permissão e qual alternativa oferecer se for negada? **Impacto:** afeta o primeiro uso, permissões, privacidade e comportamento em dispositivos sem localização disponível.
7. **Condições atuais:** quais métricas e descrições devem ser exibidas (por exemplo, temperatura, sensação térmica, condição, umidade, vento ou precipitação)? Deve haver horário da observação? **Impacto:** sem conteúdo mínimo, produto, design e testes podem entregar uma consulta que não responde à necessidade do usuário.
8. **Período da previsão:** a decisão de produto é hoje + quatro dias seguintes. Como o dia e o horário serão determinados em relação ao fuso da cidade? **Impacto:** sem regra de fuso, limites do dia e datas podem divergir para cidades em regiões diferentes.
9. **Detalhe da previsão:** cada dia deve exibir resumo diário, mínimas/máximas, probabilidade de chuva ou previsão por hora? Qual nível de detalhe é prioritário? **Impacto:** altera a estrutura da interface, volume de dados e expectativa do usuário.
10. **Formato de datas e horários:** como datas, horas e números devem ser formatados na interface pt-BR, inclusive para cidades em outros países? **Impacto:** formatos pouco familiares ou ambíguos podem levar à interpretação errada de datas, horários e valores.
11. **Fonte meteorológica:** Open-Meteo foi escolhido sem chave de API. A cobertura, os termos de uso, a atribuição exigida, os limites, a disponibilidade e a precisão atendem ao produto? **Impacto:** a escolha resolve qual provedor usar, mas condições incompatíveis podem causar restrições legais ou técnicas, cobertura insuficiente e indisponibilidade.
12. **Atualização e frescor dos dados:** com que frequência as condições atuais e a previsão devem ser atualizadas? Por quanto tempo dados em cache podem ser apresentados e como sinalizar dados antigos? **Impacto:** o usuário pode tomar decisões com dados desatualizados; atualizar em excesso pode esgotar limites ou elevar custos.
13. **Unidades:** Celsius é a unidade padrão. Celsius/Fahrenheit se aplica apenas à temperatura? Quais unidades usar para vento, precipitação e distância, e qual regra de arredondamento adotar? **Impacto:** o padrão inicial está definido, mas unidades misturadas ou conversões inconsistentes ainda podem reduzir a compreensão e induzir decisões erradas.
14. **Persistência de preferências:** a unidade escolhida e a última cidade devem ser lembradas localmente neste dispositivo? **Impacto:** não haverá persistência de servidor; sem essa decisão, a experiência entre sessões neste mesmo dispositivo permanece indefinida. Sincronização entre dispositivos não está coberta pelas decisões atuais.
15. **Idioma e formatação regional:** a interface será em pt-BR. Quais formatos de data, hora e números devem ser usados, especialmente para cidades em outros países? **Impacto:** o idioma da interface está definido, mas formatação inadequada pode tornar datas, horários ou valores ambíguos.
16. **Estados e falhas:** como tratar busca sem resultados, carregamento lento, erro do provedor, limite de requisições e ausência de conexão? Deve haver ação para tentar novamente? **Impacto:** sem fluxos definidos, falhas externas podem parecer travamentos ou deixar o usuário sem orientação.
17. **Uso offline e cache:** o produto deve mostrar dados previamente carregados sem conexão? Que dados podem ser armazenados e por quanto tempo? **Impacto:** define esforço de armazenamento e sincronização e o risco de apresentar informação antiga como atual.
18. **Disponibilidade:** qual meta de disponibilidade é necessária e como indisponibilidades do provedor externo entram nessa meta? Há períodos de manutenção aceitáveis? **Impacto:** sem um objetivo e limites de responsabilidade, não é possível dimensionar resiliência, acordos com fornecedores ou monitoramento.
19. **Desempenho e escala:** quais limites de tempo são aceitáveis para busca e carregamento? Quantos usuários simultâneos e requisições são esperados? Em quais condições de rede medir? **Impacto:** não há critério verificável de desempenho nem base para dimensionar cache, infraestrutura e limites do provedor.
20. **Acessibilidade:** qual padrão e nível de conformidade devem ser atendidos? Quais tecnologias assistivas, navegação por teclado e requisitos de contraste precisam ser validados? **Impacto:** grupos de usuários podem ser impedidos de utilizar funções centrais, além de haver retrabalho e risco de não conformidade.
21. **Responsividade e dispositivos suportados:** quais larguras de tela, orientações, sistemas operacionais, tipos de entrada e navegadores devem ser suportados? **Impacto:** “mobile” permanece subjetivo e os testes podem não cobrir dispositivos importantes para o público.
22. **Personalização local:** sem autenticação nem persistência de servidor, devem existir favoritos, histórico ou outras preferências armazenados somente no dispositivo? **Impacto:** essas capacidades não estão incluídas nas decisões atuais; adicioná-las depois exige definir armazenamento local, retenção e comportamento ao limpar dados do navegador.
23. **Privacidade e segurança:** quais dados pessoais serão coletados (por exemplo, localização), para que serão usados, por quanto tempo e com que consentimento? Há requisitos de proteção e conformidade? **Impacto:** pode haver coleta excessiva, exposição de dados e riscos legais ou reputacionais.
24. **Alertas e eventos severos:** o produto deve apenas informar condições ou também alertar sobre chuva intensa, calor ou outros eventos? **Impacto:** usuários podem presumir que serão avisados sobre riscos quando o produto não oferece alertas; alertas também mudam escopo e responsabilidades.
25. **Operação e suporte:** quem acompanha erros e indisponibilidade, como incidentes serão comunicados e quais indicadores precisam ser registrados? **Impacto:** problemas de dados ou serviço podem persistir sem detecção, responsável ou resposta definida.
26. **Atribuição e apresentação da fonte:** o provedor exige crédito, avisos legais ou apresentação da origem e do horário dos dados? **Impacto:** omitir atribuições obrigatórias pode violar os termos de uso; omitir a origem pode reduzir a confiança do usuário.

## Decisões

1. **Fonte de dados: Open-Meteo, sem chave de API.** **Justificativa:** atende à decisão de usar uma fonte pública sem exigir credenciais de API. **Resolve:** a escolha do provedor e a necessidade de chave levantadas na pergunta 11. **Ainda em aberto:** cobertura necessária, termos de uso, atribuição, limites, disponibilidade, precisão e adequação do serviço de geocodificação.
2. **Período da previsão: hoje + os quatro dias seguintes.** **Justificativa:** fixa uma janela concreta para a previsão solicitada de cinco dias. **Resolve:** se o período inclui hoje, na pergunta 8. **Ainda em aberto:** regra de fuso horário e limites do dia usados para calcular as datas.
3. **Unidade padrão: Celsius.** **Justificativa:** estabelece uma unidade inicial consistente para a primeira consulta. **Resolve:** a unidade exibida inicialmente, na pergunta 13. **Ainda em aberto:** conversão, arredondamento, unidades para outras medidas e eventual persistência da preferência.
4. **Sem autenticação e sem persistência de servidor.** **Justificativa:** mantém o escopo inicial de consulta sem contas nem dados sincronizados no servidor. **Resolve:** a necessidade de login e armazenamento associado a contas, na pergunta 22. **Ainda em aberto:** eventual armazenamento local de preferências, favoritos ou histórico, além do tratamento de dados transitórios necessários à consulta.
5. **Idioma da interface: pt-BR.** **Justificativa:** define o idioma da experiência inicial. **Resolve:** o idioma da interface, na pergunta 15. **Ainda em aberto:** formatos de datas, horas e números, especialmente ao consultar cidades de outros países.

## Suposições

- A experiência será uma aplicação acessível por navegador; o briefing não especifica aplicativo nativo.
- A consulta usará Open-Meteo como fonte de dados, sem chave de API; a adequação da cobertura e das condições de uso ainda precisa ser validada.
- O usuário escolhe manualmente uma cidade; geolocalização automática não foi solicitada.
- O objetivo inicial é consultar clima atual e previsão, sem funcionalidades adicionais como alertas, histórico ou favoritos.
- As suposições acima são provisórias e devem ser confirmadas antes de serem tratadas como requisitos.
