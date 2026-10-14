# Ligações de voz nativas no WAHA (fork)

Este fork adiciona **ligações de voz 1:1 de verdade** ao WAHA: fazer, receber, atender,
recusar e desligar chamadas do WhatsApp, com áudio nos dois sentidos.

A pilha de VoIP foi portada do projeto [WaCalls](https://github.com/JotaDev66/WaCalls)
(licença MIT) para dentro do engine **GOWS**. O WAHA continua fazendo o que já fazia
e ganha novos endpoints de chamada.

> Funciona **somente com o engine GOWS**. Nos engines WEBJS, NOWEB e WPP os novos
> endpoints respondem `501 Not Implemented`.

## Como funciona

```
Navegador (microfone/alto-falante)
   │  WebRTC: data channel "pcm" (PCM 16 kHz) ← áudio vai direto, não passa pelo Node
   ▼
GOWS (Go) ── CallService por sessão
   │  sinalização <call>, chave da chamada, STUN/relay, SRTP, codec MLow
   ▼
Servidores de relay do WhatsApp ◄──► celular do contato
```

O WAHA (Node) só faz o controle: repassa os comandos REST para o GOWS via gRPC e
entrega o SDP do WebRTC. O áudio trafega entre o navegador e o GOWS por UDP.

## Montando os forks

São **dois** repositórios modificados:

| Repositório | Branch | O que mudou |
|---|---|---|
| `gows-plus` (engine Go) | `feat/voip-calls` | `src/voip/` (pilha VoIP do WaCalls), `src/gows/calls.go`, RPCs novos no `proto/gows.proto` |
| `waha` | `feat/voip-calls` | endpoints REST, evento `call.state`, Dockerfile compilando o GOWS do fork, esta página |

1. No GitHub, faça fork de `devlikeapro/gows-plus` e de `devlikeapro/waha`.
2. Aplique os patches entregues (ou copie as pastas) e envie as branches `feat/voip-calls`
   para os seus forks.
3. No fork do WAHA, edite `waha.config.json`:
   ```json
   "gows": { "repo": "SEU_USUARIO/gows-plus", "ref": "feat/voip-calls", "build": "source" }
   ```
   Com `"build": "source"` o Dockerfile clona e compila o GOWS em vez de baixar o binário oficial.
4. Suba com o compose de exemplo:
   ```bash
   WAHA_PUBLIC_IP=192.168.0.10 docker compose -f docker-compose/calls/docker-compose.yaml up -d --build
   ```
   `WAHA_PUBLIC_IP` é o IP que o **navegador** alcança (IP da máquina na rede local, ou o IP
   público do servidor). As portas UDP `40000-40100` precisam estar liberadas.
5. Pareie a sessão pelo dashboard (QR code), como sempre.
6. Abra `examples/calls/index.html` no Chrome/Edge/Firefox, informe URL, API key e sessão.

## API

Todas as rotas ficam em `/api/{session}/calls` (header `X-Api-Key`).

| Método | Rota | O que faz |
|---|---|---|
| `GET` | `/calls` | Lista as chamadas ativas |
| `POST` | `/calls/start` | Liga: `{ "chatId": "5581999999999@c.us" }` → `CallInfo` |
| `POST` | `/calls/{id}/accept` | Atende uma chamada recebida |
| `POST` | `/calls/reject` | Recusa: `{ "from": "...@c.us", "id": "..." }` (já existia) |
| `POST` | `/calls/{id}/end` | Desliga |
| `POST` | `/calls/{id}/media` | Conecta o áudio do navegador: `{ "sdp": "<oferta>" }` → `{ "sdp": "<resposta>" }` |

`CallInfo`:

```json
{
  "id": "ABCDEF...",
  "peer": "5581999999999@c.us",
  "direction": "outgoing",
  "state": "active",
  "isVideo": false,
  "mediaConnected": true,
  "timestamp": 1760420000
}
```

Estados: `initiating` → `ringing` / `incoming_ringing` → `connecting` → `active` → `ended`
(com `endReason`: `user_ended`, `declined`, `timeout`, `busy`...).

Erros: `404` chamada não encontrada, `409` sessão sem login, `400` grupo,
`429` limite de chamadas simultâneas, `501` vídeo ou engine sem suporte.

### Webhook / WebSocket

Novo evento **`call.state`** com o `CallInfo` a cada mudança de estado. Os eventos
`call.received`, `call.accepted` e `call.rejected` continuam funcionando como antes.

### Áudio (WebRTC)

O navegador cria um `RTCPeerConnection` com um data channel chamado **`pcm`** e espera a
coleta de ICE terminar antes de enviar a oferta (não há trickle ICE). Em ambos os sentidos
trafega **PCM mono 16 kHz, Int16 little-endian**. A página `index.html` tem a implementação
completa (captura e reprodução via AudioWorklet), pronta para copiar.

## Variáveis de ambiente (GOWS)

| Variável | Padrão | Para quê |
|---|---|---|
| `GOWS_VOIP_ENABLED` | `true` | `false` desliga a pilha VoIP (volta ao comportamento original) |
| `GOWS_VOIP_MAX_CALLS` | `4` | Chamadas simultâneas por sessão; excedentes recebidas são recusadas. `0` = sem limite |
| `GOWS_VOIP_WEBRTC_PUBLIC_IPS` | — | IP(s) anunciados ao navegador; necessário em Docker/NAT |
| `GOWS_VOIP_WEBRTC_UDP_PORT_MIN` / `_MAX` | — | Faixa de portas UDP do WebRTC (publique no Docker) |
| `GOWS_VOIP_WEBRTC_ICE_SERVERS` | — | STUN/TURN opcionais, separados por vírgula |

## Limitações e cuidados

- **Só voz, só 1:1.** Vídeo e chamadas em grupo não estão implementados (o WaCalls também não tem).
- **Não é API oficial.** O protocolo de chamadas e o codec MLow foram obtidos por engenharia
  reversa. Uma mudança da Meta pode quebrar as ligações, e uso fora do padrão aumenta o risco
  de banimento do número. Teste com um número secundário.
- **Com a pilha ativa, toda chamada recebida é "pré-aceita"** pelo GOWS (o aparelho continua
  tocando normalmente). Se não quiser isso numa sessão, use `GOWS_VOIP_ENABLED=false`.
- O áudio usa `getUserMedia`, então a página precisa estar em `localhost`, `file://` ou HTTPS.

## Créditos

- [WaCalls](https://github.com/JotaDev66/WaCalls) (MIT): pilha VoIP em Go, ponte WebRTC e cliente de áudio.
- Codec MLow em Go puro (MIT), portado de [whatsapp-rust](https://github.com/oxidezap/whatsapp-rust).
- [WAHA](https://github.com/devlikeapro/waha) e [gows-plus](https://github.com/devlikeapro/gows-plus) da devlikeapro.
