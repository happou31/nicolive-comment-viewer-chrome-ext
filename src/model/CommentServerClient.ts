import { ChatData } from "./Chat";

export default class CommentServerClient implements CommentServerClient {
  private retryCount = 0;
  constructor(
    public addr: string,
    public port: number,
    public threadId: number
  ) {}

  public connect = (callback: (data: ChatData) => void) => {
    const conn = new WebSocket(`ws://${this.addr}:${this.port}/websocket`);
    conn.onopen = _ => {
      this.retryCount = 0;
      console.log(`コメントサーバーに接続しました。`);
    };
    conn.onmessage = e => {
      console.log(e.data);
      if (e.data.chat) {
        callback(e.data.chat);
      }
    };

    conn.onclose = _ => {
      this.retryCount++;
      if (this.retryCount <= 3) {
        console.log(
          `[${this.threadId}] コメントサーバーから切断されました。${3 *
            this.retryCount}秒後に再接続します...`
        );
        setTimeout(this.connect, 3000 * this.retryCount, callback);
      } else {
        console.error("コメントサーバーへの接続に失敗しました…。");
      }
    };
  };
}
