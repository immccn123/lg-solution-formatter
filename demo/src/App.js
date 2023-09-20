import { Button, Container, Menu, Message } from "semantic-ui-react";
import Editor, { DiffEditor } from "@monaco-editor/react";
import { solFormatter } from "./lg-solution-formatter.esm";
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
        <Message warning>
          <Message.Content>
            部分支持：多级列表；不支持：表格；部分语法存在强制修改的情况
            <br />
            <strong>非正式版本</strong>
          </Message.Content>
        </Message>
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
            modified={solFormatter.parse(origin)}
          />
        )}
        <Button
          onClick={() => setSwitchMode(!switchMode)}
          style={{ margin: "10px" }}
        >
          {switchMode ? "Format" : "Back"}
        </Button>
        <hr></hr>
        <a href="https://github.com/immccn123/lg-solution-formatter">
          开源项目 / Bug 反馈（使用 issue）
        </a>
        <a href="https://github.com/immccn123/lg-solution-formatter/issues/30">
          项目 Todo
        </a>
      </Container>
    </>
  );
}

export default App;
