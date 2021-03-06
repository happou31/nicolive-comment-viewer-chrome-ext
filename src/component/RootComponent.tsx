import React from "react";
import CommentViewerStore from "../store/CommentViewerStore";
import { Provider } from "mobx-react";
import CommentViewer from "./CommentViewer/CommentViewerComponent";

const store = new CommentViewerStore();
store.connectMessageServer();

export default class RootComponent extends React.Component {
  render() {
    return (
      <div className="nicolive-comment-viewer">
        <Provider commentViewer={store}>
          <CommentViewer />
        </Provider>
      </div>
    );
  }
}
