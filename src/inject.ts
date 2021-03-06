import webSocketEvent from "./model/WebSocketEvent";
import websocketRepository from "./infra/WebSocketRepository";

// 一旦pc-watchスクリプトをページから除去する
const pcWatchScript = document.querySelector("select[src*=pc-watch]");
let pcWatchScriptUrl = "";
if (pcWatchScript) {
  pcWatchScriptUrl = pcWatchScript.getAttribute("src") || "";
  document.removeChild(pcWatchScript);
}
// アプリケーションのWebSocketをフックし、生成した全てのWebSocketをRepositoryに保存する
(window as any).WebSocket = new Proxy(WebSocket, {
  construct(target: any, args: any[]) {
    const ws = new target(...args);
    websocketRepository.addWebSocket(ws);
    return ws;
  }
});

// ページのwindowオブジェクトを取得するため、拡張機能のスクリプトを読み込むscriptタグをページに埋め込む
if (chrome) {
  const inject = document.getElementById("nicolive-commentviewer-extenstion");
  if (inject) {
    const scriptName = "script.js";
    const scriptElem = document.createElement("script");
    const url = inject.getAttribute("data-script-url");
    scriptElem.setAttribute("src", url!);
    document.head.appendChild(scriptElem);
    // pc-watchスクリプトを戻す
    if (pcWatchScript) {
      document.body.appendChild(pcWatchScript);
    }
  }
}
