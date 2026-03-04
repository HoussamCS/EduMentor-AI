import React, { useState, useRef, useEffect } from "react";
import {
  Box,
  Paper,
  TextField,
  Button,
  Typography,
  Stack,
  Divider,
  Avatar,
} from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import api from "@services/api";
import Loader from "./Loader";
import { ChatMessage } from "@types/index";

const ChatTab: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!input.trim()) return;

    // Add user message to UI
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: "user",
      content: input,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const response = await api.chat(input);
      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: response,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: `Error: ${error instanceof Error ? error.message : "Failed to get response"}`,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box display="flex" flexDirection="column" height="100%">
      {/* Chat Messages */}
      <Paper
        variant="outlined"
        sx={{
          flex: 1,
          overflow: "auto",
          p: 2,
          mb: 2,
          backgroundColor: "#f5f5f5",
          minHeight: 400,
        }}
      >
        <Stack spacing={2}>
          {messages.length === 0 && (
            <Typography
              variant="body2"
              color="textSecondary"
              textAlign="center"
              py={4}
            >
              Start a conversation with EduMentor AI...
            </Typography>
          )}
          {messages.map((msg) => (
            <Box
              key={msg.id}
              display="flex"
              justifyContent={msg.role === "user" ? "flex-end" : "flex-start"}
              mb={1}
            >
              <Box
                display="flex"
                gap={1}
                alignItems="flex-start"
                maxWidth="80%"
              >
                {msg.role === "assistant" && (
                  <Avatar
                    sx={{
                      bgcolor: "#1976d2",
                      width: 32,
                      height: 32,
                      fontSize: "0.875rem",
                    }}
                  >
                    AI
                  </Avatar>
                )}
                <Paper
                  sx={{
                    p: 1.5,
                    backgroundColor:
                      msg.role === "user" ? "#1976d2" : "#fff",
                    color: msg.role === "user" ? "#fff" : "#000",
                    borderRadius: 2,
                  }}
                >
                  <Typography variant="body2">{msg.content}</Typography>
                  <Typography
                    variant="caption"
                    sx={{
                      display: "block",
                      mt: 0.5,
                      opacity: 0.7,
                    }}
                  >
                    {msg.timestamp.toLocaleTimeString()}
                  </Typography>
                </Paper>
              </Box>
            </Box>
          ))}
          {loading && <Loader message="AI is thinking..." />}
          <div ref={messagesEndRef} />
        </Stack>
      </Paper>

      <Divider />

      {/* Input Area */}
      <Box display="flex" gap={1} mt={2}>
        <TextField
          fullWidth
          placeholder="Ask me anything about the course..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleSendMessage();
            }
          }}
          multiline
          maxRows={4}
          disabled={loading}
        />
        <Button
          variant="contained"
          endIcon={<SendIcon />}
          onClick={handleSendMessage}
          disabled={loading || !input.trim()}
          sx={{ mt: "auto" }}
        >
          Send
        </Button>
      </Box>
    </Box>
  );
};

export default ChatTab;
