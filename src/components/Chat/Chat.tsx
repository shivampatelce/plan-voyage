import keycloak from '@/keycloak-config';
import type React from 'react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { io, Socket } from 'socket.io-client';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Users, Circle, Send, Plus } from 'lucide-react';
import type { Trip, TripUsers } from '@/types/Trip';
import { apiRequest } from '@/util/apiRequest';
import { API_PATH } from '@/consts/ApiPath';
import { appBadgeBackgroundColors } from '@/util/appColors';
import CustomSkeleton from '../ui/custom/CustomSkeleton';
import { ROUTE_PATH } from '@/consts/RoutePath';

interface OnlineUser {
  userId: string;
  tripId: string;
}

interface ChatMessage {
  userId: string;
  message: string;
  timestamp: Date;
  userDetails?: {
    firstName?: string;
    lastName?: string;
    backgroundColor?: string;
  };
}

const CHAT_APP_URL = import.meta.env.VITE_CHAT_APP_URL;
const PAGE_LIMIT = 20;

const Chat: React.FC = () => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [tripUsers, setTripUsers] = useState<TripUsers[] | []>([]);
  const [isTripUsersLoading, setIsTripUsersLoading] = useState(true);
  const [onlineUsers, setOnlineUsers] = useState<TripUsers[]>([]);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [hasMoreMessages, setHasMoreMessages] = useState(false);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const { tripId } = useParams<{ tripId: string }>();
  const navigate = useNavigate();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const isInitialLoad = useRef<boolean>(true);

  const currentUserId = keycloak.subject;

  // Auto scroll to bottom for new messages or initial load
  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => {
    const fetchTripDetails = async (tripId: string) => {
      setIsTripUsersLoading(true);
      try {
        const { data } = (await apiRequest<{ userId: string }, { data: Trip }>(
          API_PATH.TRIP_OVERVIEW + `/${tripId}`,
          {
            method: 'GET',
          }
        )) as { data: Trip };

        const trip: Trip = {
          ...data,
          tripUsers: data.tripUsers.map((user, index) => {
            const color =
              appBadgeBackgroundColors[index % appBadgeBackgroundColors.length];
            return {
              ...user,
              color: color,
              badgeBgColor: `bg-${color}-500`,
            };
          }),
        };

        setTripUsers(trip.tripUsers);
        fetchMessages(trip.tripUsers);

        //   Set user status online
        const userId = keycloak.subject;
        if (userId && tripId)
          socket?.emit('online', { userId: keycloak.subject, tripId });
      } catch (error) {
        console.error('Error while fetching trip details:', error);
      }
    };

    if (tripId) {
      fetchTripDetails(tripId);
    }
  }, [socket, tripId]);

  useEffect(() => {
    const socket = io(CHAT_APP_URL);
    setSocket(socket);

    return () => {
      socket.disconnect();
    };
  }, []);

  const fetchMessages = async (tripUsers: TripUsers[], page = 1) => {
    try {
      const { data } = (await apiRequest<unknown, unknown>(
        API_PATH.GET_MESSAGES + `/${tripId}?page=${page}&limit=${PAGE_LIMIT}`,
        {
          method: 'GET',
        },
        CHAT_APP_URL
      )) as { data: { messages: ChatMessage[]; hasMore: boolean } };

      let chatMessages: ChatMessage[] = data.messages
        .map((message) => {
          const user = tripUsers.find((user) => user.userId === message.userId);
          return {
            ...message,
            userDetails: {
              firstName: user?.firstName,
              lastName: user?.lastName,
              backgroundColor: user?.badgeBgColor,
            },
          };
        })
        .reverse();

      // For loading more messages
      if (page !== 1 && messages.length) {
        chatMessages = [...chatMessages, ...messages];
      }

      setHasMoreMessages(data.hasMore);
      setMessages(chatMessages);

      // Scroll only for initial loading
      if (page === 1) {
        setTimeout(scrollToBottom, 100);
      }

      setPage(page);
    } catch (error) {
      console.error('Error while fetching messages: ', error);
    }
  };

  useEffect(() => {
    socket?.on('onlineUsers', (onlineUsers: OnlineUser[]) => {
      if (tripUsers.length) {
        const onlineUsersId = onlineUsers
          .filter((userDetail) => userDetail.tripId === tripId)
          .map((user) => user.userId);
        const users = tripUsers.filter((user) => {
          return onlineUsersId.includes(user.userId);
        });
        setOnlineUsers(users);
      }
      setIsTripUsersLoading(false);
    });

    // Listen for incoming messages
    socket?.on('newMessage', (message: ChatMessage) => {
      const user = tripUsers.find((user) => user.userId === message.userId);
      message.userDetails = {
        firstName: user?.firstName,
        lastName: user?.lastName,
        backgroundColor: user?.badgeBgColor,
      };
      setMessages((prev) => [...prev, message]);
      setTimeout(scrollToBottom, 100);
    });

    return () => {
      socket?.off('onlineUsers');
      socket?.off('newMessage');
    };
  }, [scrollToBottom, socket, tripUsers]);

  useEffect(() => {
    if (isInitialLoad.current && messages.length > 0) {
      setTimeout(scrollToBottom, 100); // Small delay to ensure DOM is updated
      isInitialLoad.current = false;
    }
  }, [messages, scrollToBottom]);

  const getDisplayName = (user: TripUsers) => {
    return `${user.firstName} ${user.lastName}`.toLocaleUpperCase();
  };

  const getUserInfo = (userId: string) => {
    return tripUsers.find((user) => user.userId === userId);
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || !socket || !currentUserId || !tripId) return;

    setIsLoading(true);

    const userInfo = getUserInfo(currentUserId);
    if (!userInfo) return;

    const messageData: ChatMessage = {
      userId: currentUserId,
      message: newMessage.trim(),
      timestamp: new Date(),
    };

    // Emit message to socket
    socket.emit('sendMessage', { ...messageData, tripId });

    const user = tripUsers.find((user) => user.userId === keycloak.subject);
    messageData.userDetails = {
      firstName: user?.firstName,
      lastName: user?.lastName,
      backgroundColor: user?.badgeBgColor,
    };
    setMessages((prev) => [...prev, messageData]);
    setTimeout(scrollToBottom, 100);

    setNewMessage('');
    setIsLoading(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const formatTime = (date: Date) => {
    return new Date(date).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (!isLoading && !isTripUsersLoading && tripUsers.length === 1) {
    return (
      <div className="flex flex-col items-center justify-center h-full px-8 py-12">
        <div className="relative mb-8">
          <div className="w-24 h-24 rounded-full flex items-center justify-center">
            <Users className="w-12 h-12" />
          </div>
        </div>

        <h2 className="text-4xl font-bold text-gray-800 text-center mb-4 max-w-2xl">
          Invite other users and start your conversations here
        </h2>

        <p className="text-lg text-gray-500 text-center mb-8 max-w-lg">
          Connect with your team members and begin collaborating in real-time
        </p>

        <Button
          className="px-6 py-2"
          onClick={() => navigate(`/${ROUTE_PATH.INVITE}/${tripId}`)}>
          <Plus className="w-4 h-4 mr-2" />
          Invite Your First Member
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">Trip Chat</h1>
      </div>
      <div className="flex-1 mx-4 mb-2">
        <Card className="h-full shadow-sm border-0">
          <CardContent className="p-0 h-full flex flex-col">
            <div className="p-4 border-b">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-gray-600" />
                  <h3 className="font-semibold text-gray-900">Online Now</h3>
                  <Badge
                    variant="secondary"
                    className="ml-2">
                    {onlineUsers.length}
                  </Badge>
                </div>
                <div className="flex items-center gap-1">
                  <Circle className="h-2 w-2 fill-green-500 text-green-500" />
                  <span className="text-sm text-gray-500">Live</span>
                </div>
              </div>

              {isTripUsersLoading ? (
                <CustomSkeleton />
              ) : onlineUsers.length > 0 ? (
                <ScrollArea className="w-full">
                  <div className="flex gap-3 p-2">
                    {onlineUsers.map((user) => (
                      <div
                        key={user.userId}
                        className="flex flex-col items-center gap-2 min-w-0">
                        <div className="relative">
                          <div
                            className={`w-10 h-10 ${user.badgeBgColor} rounded-full flex items-center justify-center text-white font-semibold text-sm`}>
                            {user.firstName[0]}
                            {user.lastName[0]}
                          </div>
                          {/* Online indicator */}
                          <div className="absolute -bottom-1 -right-1 h-4 w-4 bg-green-500 border-2 border-white rounded-full"></div>
                        </div>
                        <div className="text-center min-w-0">
                          <p className="text-xs font-medium text-gray-900 truncate max-w-[80px]">
                            {getDisplayName(user)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              ) : (
                <div className="text-center py-4">
                  <Users className="h-8 w-8 text-gray-300 mx-auto mb-2" />
                  <p className="text-sm text-gray-500">No users online</p>
                </div>
              )}
            </div>

            <div className="flex-1 max-h-96 overflow-y-scroll">
              <ScrollArea className="flex-1 p-4">
                {isTripUsersLoading ? (
                  <CustomSkeleton />
                ) : (
                  <div className="space-y-4">
                    {messages.length === 0 ? (
                      <div className="flex items-center justify-center h-full">
                        <div className="text-center">
                          <h3 className="text-lg font-semibold text-gray-600 mb-2">
                            Start the conversation
                          </h3>
                          <p className="text-sm text-gray-400">
                            Send a message to get the chat going!
                          </p>
                        </div>
                      </div>
                    ) : (
                      <>
                        {hasMoreMessages && (
                          <div className="flex justify-center">
                            <Button
                              onClick={() =>
                                fetchMessages(tripUsers, page + 1)
                              }>
                              Load More
                            </Button>
                          </div>
                        )}
                        {messages.map((message, index) => (
                          <div
                            key={index}
                            className={`flex ${
                              message.userId === currentUserId
                                ? 'justify-end'
                                : 'justify-start'
                            }`}>
                            <div
                              className={`flex items-start gap-3 max-w-[70%] ${
                                message.userId === currentUserId
                                  ? 'flex-row-reverse'
                                  : 'flex-row'
                              }`}>
                              {/* Avatar */}
                              <div className="flex-shrink-0">
                                <div
                                  className={`w-8 h-8 ${message.userDetails?.backgroundColor} rounded-full flex items-center justify-center text-white font-semibold text-xs`}>
                                  {message.userDetails &&
                                    message.userDetails.firstName &&
                                    message.userDetails.firstName[0]}
                                  {message.userDetails &&
                                    message.userDetails.lastName &&
                                    message.userDetails.lastName[0]}
                                </div>
                              </div>

                              {/* Message Content */}
                              <div
                                className={`flex flex-col ${
                                  message.userId === currentUserId
                                    ? 'items-end'
                                    : 'items-start'
                                }`}>
                                <div
                                  className={`px-4 py-2 rounded-lg bg-gray-100 text-gray-900`}>
                                  <p className="text-sm break-words">
                                    {message.message}
                                  </p>
                                </div>
                                <div className="flex items-center gap-2 mt-1">
                                  <span className="text-xs text-gray-500">
                                    {message.userDetails?.firstName}{' '}
                                    {message.userDetails?.lastName}
                                  </span>
                                  <span className="text-xs text-gray-400">
                                    {formatTime(message.timestamp)}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </>
                    )}
                    <div ref={messagesEndRef} />
                  </div>
                )}
              </ScrollArea>
            </div>

            <div className="pt-4 px-4 border-t">
              <div className="flex gap-2">
                <Input
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Type your message..."
                  className="flex-1"
                  disabled={isLoading}
                />
                <Button
                  onClick={sendMessage}
                  disabled={!newMessage.trim() || isLoading}
                  size="icon">
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-center mt-10 border-t">
        {tripUsers.map((user, index) => (
          <div
            key={index}
            className="my-8 mx-2 group relative bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg p-4 border border-gray-200 hover:shadow-md hover:border-black-300 transition-all duration-200 hover:-translate-y-1">
            <div className="flex items-center space-x-1">
              <div
                className={`w-10 h-10 ${user.badgeBgColor} rounded-full flex items-center justify-center text-white font-semibold text-sm`}>
                {user.firstName[0]}
                {user.lastName[0]}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-900 truncate">
                  {user.firstName} {user.lastName}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Chat;
