import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { UserProvider } from './context/UserContext';
import ChatList from './components/ChatList';
import ChatRoom from './components/ChatRoom';

function App() {
  return (
    <UserProvider>
      <Router>
        <Routes>
          <Route path="/" element={<ChatList />} />
          <Route path="/chat/:roomId" element={<ChatRoom />} />
        </Routes>
      </Router>
    </UserProvider>
  );
}

export default App;
