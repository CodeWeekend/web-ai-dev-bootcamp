import ChatWithAI from "./ChatWithAI";
import "./App.css";

function App() {
  return (
    <div>
      <h1>Chat with AI</h1>
      <p>Type a question below and see how AI responds in real time!</p>

      <div>
        <ChatWithAI />
      </div>

      <footer>Powered by AI . Demo for CodeWeekend session</footer>
    </div>
  );
}

export default App;
