// src/pages/Messages.js
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { ref, onValue, push } from 'firebase/database';
import { collection, query, where, getDocs, doc, getDoc } from 'firebase/firestore';
import { db, auth, realtimeDb } from '../firebase/firebase';
import { useNavigate } from 'react-router-dom';
import { Box, Typography, List, ListItem, TextField, Button, CircularProgress, Avatar } from '@mui/material';
import { motion } from 'framer-motion';

function Messages() {
  const user = auth.currentUser;
  const navigate = useNavigate();
  const [selectedChat, setSelectedChat] = useState(null);
  const [newMessage, setNewMessage] = useState('');

  // Запрос для получения списка чатов
  const { data: chats = [], isLoading, error } = useQuery({
    queryKey: ['chats', user?.uid],
    queryFn: async () => {
      if (!user) return [];
      const chatsQuery = query(collection(db, 'chats'), where('participants', 'array-contains', user.uid));
      const chatsSnapshot = await getDocs(chatsQuery);
      const chatsData = await Promise.all(
        chatsSnapshot.docs.map(async (chatDoc) => {
          const adId = chatDoc.data().adId;
          const adRef = doc(db, 'ads', adId);
          const adSnap = await getDoc(adRef);
          return {
            id: chatDoc.id,
            adTitle: adSnap.exists() ? adSnap.data().title : 'Объявление удалено',
            participants: chatDoc.data().participants,
          };
        })
      );
      return chatsData;
    },
    enabled: !!user,
  });

  // Получение сообщений для выбранного чата в реальном времени
  const [messages, setMessages] = React.useState([]);
  React.useEffect(() => {
    if (selectedChat) {
      const chatRef = ref(realtimeDb, `chats/${selectedChat.id}`);
      const unsubscribe = onValue(chatRef, (snapshot) => {
        const data = snapshot.val();
        if (data) {
          const messagesArray = Object.entries(data).map(([id, msg]) => ({
            id,
            ...msg,
          }));
          setMessages(messagesArray);
        } else {
          setMessages([]);
        }
      });
      return () => unsubscribe();
    }
  }, [selectedChat]);

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedChat) return;
    try {
      const chatRef = ref(realtimeDb, `chats/${selectedChat.id}`);
      await push(chatRef, {
        senderId: user.uid,
        message: newMessage,
        timestamp: Date.now(),
      });
      setNewMessage('');
    } catch (error) {
      console.error('Ошибка отправки сообщения:', error);
      alert('Ошибка отправки сообщения');
    }
  };

  if (!user) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="container"
      >
        <Typography variant="h6" sx={{ color: 'var(--text)', fontFamily: 'Montserrat', mb: 2 }}>
          Войдите в аккаунт, чтобы просматривать сообщения
        </Typography>
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Button
            variant="contained"
            onClick={() => navigate('/login')}
            sx={{ background: 'var(--gradient)', color: 'var(--text)' }}
          >
            Войти
          </Button>
        </motion.div>
      </motion.div>
    );
  }

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress sx={{ color: 'var(--accent)' }} />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography color="error">Ошибка загрузки чатов: {error.message}</Typography>
      </Box>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.7 }}
      className="container"
    >
      <Typography
        variant="h4"
        sx={{ color: 'var(--text)', mb: 3, fontFamily: 'Montserrat', fontWeight: 700 }}
      >
        Сообщения
      </Typography>
      <Box sx={{ display: 'flex', gap: 3 }}>
        <Box sx={{ width: '30%', minWidth: '250px' }}>
          <Typography
            variant="h6"
            sx={{ color: 'var(--text)', mb: 2, fontFamily: 'Montserrat', fontWeight: 600 }}
          >
            Чаты
          </Typography>
          <List className="chat-list">
            {chats.length > 0 ? (
              chats.map((chat) => (
                <motion.div
                  key={chat.id}
                  whileHover={{ backgroundColor: 'rgba(255, 109, 0, 0.1)' }}
                >
                  <ListItem
                    button
                    onClick={() => setSelectedChat(chat)}
                    sx={{
                      background: selectedChat?.id === chat.id ? 'rgba(255, 109, 0, 0.2)' : 'transparent',
                      borderRadius: 'var(--radius)',
                    }}
                  >
                    <Typography sx={{ color: 'var(--text)' }}>{chat.adTitle}</Typography>
                  </ListItem>
                </motion.div>
              ))
            ) : (
              <Typography sx={{ color: 'var(--muted)' }}>Нет активных чатов</Typography>
            )}
          </List>
        </Box>
        <Box sx={{ flex: 1 }}>
          {selectedChat ? (
            <>
              <Typography
                variant="h6"
                sx={{ color: 'var(--text)', mb: 2, fontFamily: 'Montserrat', fontWeight: 600 }}
              >
                Чат: {selectedChat.adTitle}
              </Typography>
              <Box
                sx={{
                  maxHeight: '400px',
                  overflowY: 'auto',
                  background: 'var(--bg-2)',
                  borderRadius: 'var(--radius)',
                  p: 2,
                  mb: 2,
                }}
              >
                {messages.map((msg) => (
                  <Box
                    key={msg.id}
                    className={`message-bubble ${msg.senderId === user.uid ? 'sent' : 'received'}`}
                  >
                    <Typography sx={{ fontSize: '0.9rem' }}>{msg.message}</Typography>
                    <Typography sx={{ fontSize: '0.7rem', color: 'var(--muted)' }}>
                      {new Date(msg.timestamp).toLocaleTimeString()}
                    </Typography>
                  </Box>
                ))}
              </Box>
              <Box component="form" onSubmit={(e) => { e.preventDefault(); handleSendMessage(); }}>
                <TextField
                  fullWidth
                  placeholder="Напишите сообщение..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  sx={{
                    mb: 2,
                    input: { color: 'var(--text)' },
                    '& .MuiOutlinedInput-root': {
                      '& fieldset': { borderColor: 'var(--muted)' },
                      '&:hover fieldset': { borderColor: 'var(--accent)' },
                    },
                  }}
                />
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button
                    type="submit"
                    variant="contained"
                    sx={{ background: 'var(--gradient)', color: 'var(--text)', fontWeight: 600 }}
                  >
                    Отправить
                  </Button>
                </motion.div>
              </Box>
            </>
          ) : (
            <Typography sx={{ color: 'var(--muted)' }}>Выберите чат для общения</Typography>
          )}
        </Box>
      </Box>
    </motion.div>
  );
}

export default Messages;