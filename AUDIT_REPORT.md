# Auditoria — Resumo de Ações (iniciada)

Data: 2026-06-02

## Objetivo
Realizar auditoria completa e correções prioritárias no projeto, priorizando segurança e estabilidade.

## Alterações aplicadas

1. Segurança — OpenAI key
- Arquivo criado: `src/server/routes/openai.js`
- Modificado: `server.js` — registro de rota `/api/openai`
- Modificado: `src/services/aiService.js` — agora usa `/api/openai` no cliente
- Rationale: remove exposição de `VITE_OPENAI_API_KEY` no browser; proxy server-side para OpenAI.

2. Avatar 3D e animações
- Modificado: `src/components/Avatar/AvatarScene.jsx`
  - passou a usar `useGLTF` + `useAnimations` de `@react-three/drei`
  - modelo padrão ajustado para `/models/girl_mechanic.glb`
  - mapeamento flexível de nomes de clips (case-insensitive, substrings)
  - cleanup de geometries/materials e parada do mixer no unmount
- Rationale: garante que as animações do GLB sejam detectadas e executadas; reduz vazamentos.

3. Voz (SpeechRecognition)
- Modificado: `src/hooks/useVoiceRecognition.js`
  - armazenar a instância em `recognitionRef`
  - `stop()` agora interrompe a instância e limpa handlers
  - cleanup no unmount
- Rationale: evita reconhecimento ativo após `stop` e vazamento de recursos.

4. Timers e estado do assistente
- Modificado: `src/hooks/useAssistantState.js`
  - `idleTimer` refatorado para `useRef` (`idleTimerRef`) e limpeza no unmount
- Rationale: evita rerenders desnecessários e possíveis inconsistências na limpeza de timers.

5. Validações executadas
- Iniciado servidor: `node server.js` — sucesso (localhost:5000)
- Build de produção: `npm run build` — concluído sem erros; aviso de chunk grande (three.js)

## Arquivos modificados
- `src/server/routes/openai.js` (ADICIONADO)
- `server.js` (ATUALIZADO)
- `src/services/aiService.js` (ATUALIZADO)
- `src/components/Avatar/AvatarScene.jsx` (ATUALIZADO)
- `src/hooks/useVoiceRecognition.js` (ATUALIZADO)
- `src/hooks/useAssistantState.js` (ATUALIZADO)
- `src/hooks/useSpeechSynthesis.js` (ATUALIZADO)
- `src/pages/Home.jsx` (ATUALIZADO)
- `src/components/Scene/WorldScene.jsx` (ATUALIZADO)
- `vite.config.mjs` (ATUALIZADO)
- `AUDIT_REPORT.md` (ATUALIZADO)

## Arquivos removidos
- `src/components/assistant/AssistantShell.jsx` (REMOVIDO)
- `src/components/UX/AssistantControlPanel.jsx` (REMOVIDO)

## Problemas ainda em aberto / recomendações
- Mover qualquer lógica sensível para o servidor (por exemplo, chamadas a serviços externos).
- Implementar testes end-to-end para fluxo de voz/gestos/animação.
- Considerar compressão Draco para `girl_mechanic.glb` e otimização de texturas.
- Validar `useGestureDetection` em múltiplos navegadores/permissions flows.
- Adicionar seleção de voz em `useSpeechSynthesis` (opcional UX).
- Fazer code-splitting do bundle (three.js gera chunks grandes) — sugerido lazy-load do avatar e scene.

## Próximos passos que posso executar (autorização necessária)
- Executar auditoria automática de imports não usados e remover código morto.
- Otimizar e comprimir o GLB (usar gltf-pipeline + draco) e ajustar carregamento no `AvatarScene`.
- Revisar `server.js` para melhores mensagens de erro e health-check endpoint.
- Testar manualmente a navegação por voz e gestos, registrando logs.

---

Se aprovar, continuo e aplico as fases seguintes automaticamente (limpeza de código, otimização de assets, testes e geração de relatório final).