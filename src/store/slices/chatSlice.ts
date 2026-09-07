import { createAsyncThunk, createSlice, type PayloadAction } from "@reduxjs/toolkit";

import type { Locale } from "@/i18n/config";
import { apiPost } from "@/lib/api";
import type { ChatReply } from "@/lib/types";

export interface ChatMessage {
  id: string;
  role: "user" | "bot";
  text: string;
}

interface ChatState {
  messages: ChatMessage[];
  quickReplies: string[];
  sessionId: string | null;
  status: "idle" | "sending" | "failed";
}

const initialState: ChatState = {
  messages: [],
  quickReplies: [],
  sessionId: null,
  status: "idle",
};

const newId = () =>
  typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random().toString(16).slice(2)}`;

export const sendChatMessage = createAsyncThunk<
  { reply: ChatReply; text: string },
  { text: string; locale: Locale },
  { state: { chat: ChatState }; rejectValue: string }
>("chat/send", async ({ text, locale }, { getState, rejectWithValue }) => {
  const { sessionId } = getState().chat;
  const { ok, data } = await apiPost<ChatReply>(
    "/chatbot/message/",
    { message: text, session_id: sessionId ?? "" },
    locale,
  );
  if (!ok || !data) return rejectWithValue("failed");
  return { reply: data, text };
});

const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    greet(state, action: PayloadAction<{ text: string; suggestions: string[] }>) {
      if (state.messages.length > 0) return;
      state.messages = [
        { id: newId(), role: "bot", text: action.payload.text },
      ];
      state.quickReplies = action.payload.suggestions;
    },
    resetChat(state) {
      state.messages = [];
      state.quickReplies = [];
      state.sessionId = null;
      state.status = "idle";
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(sendChatMessage.pending, (state, action) => {
        state.status = "sending";
        state.quickReplies = [];
        state.messages.push({
          id: newId(),
          role: "user",
          text: action.meta.arg.text,
        });
      })
      .addCase(sendChatMessage.fulfilled, (state, action) => {
        state.status = "idle";
        state.sessionId = action.payload.reply.session_id;
        state.quickReplies = action.payload.reply.quick_replies;
        state.messages.push({
          id: newId(),
          role: "bot",
          text: action.payload.reply.answer,
        });
      })
      .addCase(sendChatMessage.rejected, (state) => {
        state.status = "failed";
      });
  },
});

export const { greet, resetChat } = chatSlice.actions;

export default chatSlice.reducer;
