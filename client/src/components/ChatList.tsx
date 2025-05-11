import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Heading,
  VStack,
  Button,
  Text,
  useToast,
  Spinner,
  Center,
  Input,
  FormControl,
  FormLabel,
  FormHelperText,
} from '@chakra-ui/react';
import axios from 'axios';
import { useUser } from '../context/UserContext';

interface ChatRoom {
  id: string;
  name: string;
  messages: Array<{
    content: string;
    createdAt: string;
    user: {
      username: string;
    };
  }>;
}

const ChatList = () => {
  const [chatRooms, setChatRooms] = useState<ChatRoom[]>([]);
  const [loading, setLoading] = useState(true);
  const [tempUsername, setTempUsername] = useState('');
  const navigate = useNavigate();
  const toast = useToast();
  const { username, setUsername } = useUser();

  useEffect(() => {
    const fetchChatRooms = async () => {
      try {
        console.log('Fetching chat rooms...');
        const response = await axios.get('http://localhost:3001/api/chat-rooms');
        console.log('Chat rooms received:', response.data);
        setChatRooms(response.data);
      } catch (error) {
        console.error('Error fetching chat rooms:', error);
        toast({
          title: 'Error',
          description: 'Failed to fetch chat rooms',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchChatRooms();
  }, [toast]);

  const handleSetUsername = () => {
    if (tempUsername.trim()) {
      setUsername(tempUsername.trim());
      toast({
        title: 'Success',
        description: 'Username set successfully',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } else {
      toast({
        title: 'Error',
        description: 'Username cannot be empty',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  if (loading) {
    return (
      <Center h="100vh">
        <Spinner size="xl" color="purple.500" />
      </Center>
    );
  }

  return (
    <Container maxW="container.md" py={8}>
      <VStack spacing={6} align="stretch">
        <Heading as="h1" size="xl" textAlign="center">
          Chat Rooms
        </Heading>

        {!username ? (
          <Box p={4} borderWidth={1} borderRadius="lg" bg="gray.800">
            <FormControl>
              <FormLabel>Enter your username</FormLabel>
              <Input
                value={tempUsername}
                onChange={(e) => setTempUsername(e.target.value)}
                placeholder="Username"
                mb={2}
              />
              <FormHelperText>This name will be displayed in chat messages</FormHelperText>
              <Button colorScheme="purple" onClick={handleSetUsername} mt={2}>
                Set Username
              </Button>
            </FormControl>
          </Box>
        ) : (
          <>
            <Text textAlign="center" color="purple.300">
              Welcome, {username}!
            </Text>
            {chatRooms.length === 0 ? (
              <Text textAlign="center" color="gray.500">
                No chat rooms available
              </Text>
            ) : (
              chatRooms.map((room) => (
                <Box
                  key={room.id}
                  p={4}
                  borderWidth={1}
                  borderRadius="lg"
                  bg="gray.800"
                  _hover={{ bg: 'gray.700' }}
                  cursor="pointer"
                  onClick={() => navigate(`/chat/${room.id}`)}
                >
                  <Heading as="h2" size="md" mb={2}>
                    {room.name}
                  </Heading>
                  {room.messages[0] && (
                    <Text color="gray.400" fontSize="sm">
                      Last message: {room.messages[0].content}
                    </Text>
                  )}
                </Box>
              ))
            )}
            <Button
              colorScheme="purple"
              onClick={() => {
                toast({
                  title: 'Coming soon',
                  description: 'Create chat room feature will be available soon',
                  status: 'info',
                  duration: 3000,
                  isClosable: true,
                });
              }}
            >
              Create New Chat Room
            </Button>
          </>
        )}
      </VStack>
    </Container>
  );
};

export default ChatList; 