import { Button, Container, Menu, Message } from "semantic-ui-react";
import Editor, { DiffEditor } from "@monaco-editor/react";
import { marked } from "./lg-solution-formatter.esm";
import { useState } from "react";

function App() {
  const [switchMode, setSwitchMode] = useState(true);
  const [origin, setOrigin] = useState("");

  const handleEditorChange = (value, _) => {
    setOrigin(value);
  };

  return (
    <>
      <Menu fixed="top">
        <Menu.Item header>题解格式化工具</Menu.Item>
      </Menu>
      <div style={{ height: "80px" }} />
      <Container>
        <Message warning content="尚不支持：多级列表、表格，部分语法会强制修改；"></Message>
        {switchMode ? (
          <Editor
            height="70vh"
            defaultLanguage="markdown"
            defaultValue={origin}
            onChange={handleEditorChange}
          />
        ) : (
          <DiffEditor
            height="70vh"
            originalLanguage="markdown"
            original={origin}
            modifiedLanguage="markdown"
            modified={marked.parse(origin)}
          />
        )}
        <Button onClick={() => setSwitchMode(!switchMode)} style={{margin: "10px"}}>
          {switchMode ? "Format" : "Back"}
        </Button>
        <hr></hr>
        <a href="https://github.com/immccn123/lg-solution-formatter">开源项目 / Bug 反馈（使用 issue）</a>
      </Container>
    </>
  );
}

export default App;
