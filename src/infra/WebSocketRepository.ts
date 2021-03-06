import WindowInjection from "./WindowInjection";

type OnPushWebSocketHandler = ((ws: WebSocket) => void);
type OnChangeWebSocketHandler = ((ws: WebSocket) => void);

class WebSocketRepository {
  private websockets: WebSocket[] = [];

  private onPushWebSocketHandlers: OnPushWebSocketHandler[] = [];

  private onChangeWebsocketHandlers: OnChangeWebSocketHandler[] = [];

  public addWebSocket(websocket: WebSocket) {
    const sameUrlSocketIndex = this.websockets.findIndex(
      ws => ws.url === websocket.url
    );
    // 同じURLのWebSocketがあったら更新する
    if (sameUrlSocketIndex >= 0) {
      this.onChangeWebsocketHandlers.forEach(handler => handler(websocket));
      this.websockets[sameUrlSocketIndex] = websocket;
    } else {
      this.websockets.push(websocket);
      this.onPushWebSocketHandlers.forEach(handler => handler(websocket));
    }
  }

  public addOnPushWebSocketEventHandler(handler: OnPushWebSocketHandler) {
    this.onPushWebSocketHandlers.push(handler);
  }

  public addOnChangeWebSocketEventHandler(handler: OnChangeWebSocketHandler) {
    this.onChangeWebsocketHandlers.push(handler);
  }

  public get sockets() {
    return this.websockets;
  }
}

const key = "WebSocketRepository";

// 違うスクリプト間で同じオブジェクトを参照するため、windowにオブジェクトを差し込む
if (!WindowInjection.contains(key)) {
  WindowInjection.setObject(key, new WebSocketRepository());
}

const websocketRepository = WindowInjection.getObject<WebSocketRepository>(
  key
)!;

export default websocketRepository;
