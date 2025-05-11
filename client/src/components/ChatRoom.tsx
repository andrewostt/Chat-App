import { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  VStack,
  HStack,
  Input,
  Button,
  Text,
  Flex,
  useToast,
} from '@chakra-ui/react';
import { io, Socket } from 'socket.io-client';
import axios from 'axios';
import { useUser } from '../context/UserContext';

interface Message {
  id: string;
  content: string;
  createdAt: string;
  user: {
    username: string;
  };
}

const ChatRoom = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [roomName, setRoomName] = useState('');
  const { roomId } = useParams<{ roomId: string }>();
  const navigate = useNavigate();
  const toast = useToast();
  const socketRef = useRef<Socket | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { username } = useUser();

  useEffect(() => {
    if (!username) {
      toast({
        title: 'Error',
        description: 'Please set your username first',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      navigate('/');
      return;
    }

    // Connect to WebSocket
    socketRef.current = io('http://localhost:3001', {
      transports: ['websocket'],
      reconnection: true,
      reconnectionAttempts: 5,
    });

    // Log connection events
    socketRef.current.on('connect', () => {
      console.log('Connected to WebSocket server');
    });

    socketRef.current.on('connect_error', (error) => {
      console.error('WebSocket connection error:', error);
      toast({
        title: 'Connection Error',
        description: 'Failed to connect to chat server',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    });

    // Join room
    if (roomId) {
      console.log('Joining room:', roomId);
      socketRef.current.emit('join_room', roomId);
    }

    // Listen for new messages
    socketRef.current.on('receive_message', (message: Message) => {
      console.log('Received message:', message);
      setMessages((prev) => [...prev, message]);
    });

    // Fetch room data and messages
    const fetchRoomData = async () => {
      try {
        console.log('Fetching room data for:', roomId);
        const response = await axios.get(
          `http://localhost:3001/api/chat-rooms/${roomId}`
        );
        console.log('Room data received:', response.data);
        setRoomName(response.data.name);
        setMessages(response.data.messages);
      } catch (error) {
        console.error('Error fetching room data:', error);
        toast({
          title: 'Error',
          description: 'Failed to fetch chat room data',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
      }
    };

    fetchRoomData();

    return () => {
      if (socketRef.current) {
        console.log('Leaving room:', roomId);
        socketRef.current.emit('leave_room', roomId);
        socketRef.current.disconnect();
      }
    };
  }, [roomId, toast, navigate, username]);

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = () => {
    if (!newMessage.trim() || !socketRef.current) {
      console.log('Cannot send message: empty message or no socket connection');
      return;
    }

    if (!roomId) {
      console.error('No room ID available');
      return;
    }

    console.log('Sending message:', {
      roomId,
      username,
      content: newMessage,
    });

    socketRef.current.emit('send_message', {
      roomId,
      username,
      content: newMessage,
    });

    setNewMessage('');
  };

  return (
    <Container maxW="container.md" py={8}>
      <VStack spacing={4} align="stretch" h="calc(100vh - 100px)">
        <Flex justify="space-between" align="center">
          <Text fontSize="2xl" fontWeight="bold">
            {roomName}
          </Text>
          <Button onClick={() => navigate('/')}>Back to Chat List</Button>
        </Flex>

        <Box
          flex={1}
          overflowY="auto"
          p={4}
          borderWidth={1}
          borderRadius="lg"
          bg="gray.800"
        >
          {messages.map((message) => (
            <Box
              key={message.id}
              mb={4}
              p={3}
              borderRadius="lg"
              bg="gray.700"
            >
              <Text fontWeight="bold" color="purple.300">
                {message.user.username}
              </Text>
              <Text>{message.content}</Text>
              <Text fontSize="xs" color="gray.400">
                {new Date(message.createdAt).toLocaleString()}
              </Text>
            </Box>
          ))}
          <div ref={messagesEndRef} />
        </Box>

        <HStack>
          <Input
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type your message..."
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
          />
          <Button onClick={handleSendMessage}>Send</Button>
        </HStack>
      </VStack>
    </Container>
  );
};

export default ChatRoom; 