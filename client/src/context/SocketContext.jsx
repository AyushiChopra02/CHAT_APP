import { useAppStore } from "@/store";
import { HOST } from "@/utils/constants";
import { createContext, useContext, useEffect, useRef } from "react";
import { io } from "socket.io-client";
// Create the socket context
const SocketContext = createContext(null);

// Custom hook to use socket context
export const useSocket = () => {
  return useContext(SocketContext);
};

// SocketProvider component to wrap the application with socket connection
export const SocketProvider = ({ children }) => {
  const socket = useRef(null);
  const { userInfo } = useAppStore(); // Access user info from the app store

  useEffect(() => {
    if (userInfo && userInfo.id) {
      console.log("Connecting to socket for user:", userInfo.id);

      // Initialize socket connection
      socket.current = io(HOST, {
        withCredentials: true,
        query: { userId: userInfo.id },
      });

      socket.current.on("connect", () => {
        console.log("Connected to socket server with ID:", socket.current.id);
      });

      // Handle incoming messages
      const handleReceiveMessage = (message) => {
        const { selectedChatData, selectedChatType, addMessage } = useAppStore.getState();

        // If the message is from the current chat, update the store
        if (
          selectedChatType !== undefined &&
          (selectedChatData._id === message.sender._id || selectedChatData._id === message.recipient._id)
        ) {
          console.log("Message received:", message);
          addMessage(message); // Update the app state with the received message
        }
      };
 const  handleReceiveChannelMessage = (message) => {
  const { selectedChatData, selectedChatType, addMessage} =
  useAppStore.getState();
  if(selectedChatType !==undefined && selectedChatData._id===message.channelId){
    addMessage(message);
  }
 };
      socket.current.on("recieveMessage", handleReceiveMessage); // Listen for messages
socket.current.on("recieve-channel-message", handleReceiveChannelMessage);
      // Cleanup on unmount
      return () => {
        if (socket.current) {
          console.log("Disconnecting socket...");
          socket.current.disconnect();
        }
      };
    }
  }, [userInfo]); // Only re-run the effect if userInfo changes

  return (
    <SocketContext.Provider value={socket.current}>
      {children}
    </SocketContext.Provider>
  );
};
