import {
  VideoOff,
  Mic,
  MicOff,
  Video,
  PhoneOff,
  Circle,
  Users,
  Plus,
  Phone,
} from 'lucide-react';
import type React from 'react';
import { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { io, type Socket } from 'socket.io-client';
import { Card, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import keycloak from '@/keycloak-config';
import { apiRequest } from '@/util/apiRequest';
import { API_PATH } from '@/consts/ApiPath';
import type { Trip, TripUsers } from '@/types/Trip';
import { appBadgeBackgroundColors } from '@/util/appColors';
import CustomSkeleton from '../ui/custom/CustomSkeleton';
import { ROUTE_PATH } from '@/consts/RoutePath';

const CHAT_APP_URL = import.meta.env.VITE_CHAT_APP_URL;

type PeerConnections = { [userId: string]: RTCPeerConnection };
type RemoteStreams = { [userId: string]: MediaStream };

const GroupCall: React.FC = () => {
  const [trip, setTrip] = useState<Trip>();
  const [socket, setSocket] = useState<Socket | null>(null);
  const [peers, setPeers] = useState<RemoteStreams>({});
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [isCallActive, setIsCallActive] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [joinedUserDetails, setJoinedUserDetails] =
    useState<Record<string, TripUsers>>();
  const localVideoRef = useRef<HTMLVideoElement | null>(null);
  const peerConnections = useRef<PeerConnections>({});
  const remoteStreams = useRef<RemoteStreams>({});
  const { tripId } = useParams<{ tripId: string }>();
  const navigate = useNavigate();

  useEffect(() => {
    const socket = io(CHAT_APP_URL);
    setSocket(socket);

    return () => {
      socket.emit('disconnectCall');
      socket.disconnect();
      stopMediaTracks();
    };
  }, []);

  const stopMediaTracks = () => {
    localStream?.getTracks().forEach((track) => {
      track.stop();
    });
    setLocalStream(null);
  };

  useEffect(() => {
    const fetchTripDetails = async (tripId: string) => {
      setIsLoading(true);
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

        setTrip(trip);
        if (trip?.tripUsers.length > 1) startCall(trip);
      } catch (error) {
        console.error('Error while fetching trip details:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (tripId) {
      fetchTripDetails(tripId);
    }
  }, [socket, tripId]);

  const startCall = async (trip: Trip) => {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true,
    });

    setLocalStream(stream);
    setIsCallActive(true);

    if (localVideoRef?.current) {
      localVideoRef.current.srcObject = stream;
    }

    socket?.emit('joinCall', { tripId, userId: keycloak.subject });

    socket?.on(
      'allUsers',
      (usersDetails: { socketId: string; userId: string }[]) => {
        setJoinedUserDetails((prev) => {
          const updated = { ...prev };

          usersDetails.forEach(({ socketId, userId }) => {
            if (!peerConnections.current[socketId]) {
              createPeer(socketId, stream, true);
            }

            const tripUser = trip?.tripUsers.find(
              (user) => user.userId === userId
            );

            if (tripUser) {
              updated[socketId] = tripUser;
            }
          });

          return updated;
        });
      }
    );

    socket?.on(
      'newJoinedUser',
      ({ socketId, userId }: { socketId: string; userId: string }) => {
        if (!peerConnections.current[socketId]) {
          createPeer(socketId, stream, false);

          setJoinedUserDetails((prev) => {
            const updated = { ...prev };

            const tripUser = trip?.tripUsers.find(
              (user) => user.userId === userId
            );

            if (tripUser) {
              updated[socketId] = tripUser;
            }

            return updated;
          });
        }
      }
    );

    socket?.on('offer', async ({ sender, offer }) => {
      const pc = createPeerConnection(sender);
      await pc.setRemoteDescription(new RTCSessionDescription(offer));
      const answer = await pc.createAnswer();
      await pc.setLocalDescription(answer);
      socket.emit('answer', { target: sender, answer });
    });

    socket?.on('answer', async ({ sender, answer }) => {
      const pc = peerConnections.current[sender];
      await pc.setRemoteDescription(new RTCSessionDescription(answer));
    });

    socket?.on('iceCandidate', async ({ sender, candidate }) => {
      const pc = peerConnections.current[sender];
      if (pc) {
        await pc.addIceCandidate(new RTCIceCandidate(candidate));
      }
    });

    socket?.on('userDisconnected', (userId: string) => {
      if (peerConnections.current[userId]) {
        peerConnections.current[userId].close();
        delete peerConnections.current[userId];
      }
      setJoinedUserDetails((prev) => {
        const updated = { ...prev };
        if (updated) delete updated[userId];
        return updated;
      });
      delete remoteStreams.current[userId];
      setPeers({ ...remoteStreams.current });
    });
  };

  const createPeerConnection = (userId: string) => {
    if (peerConnections.current[userId]) {
      return peerConnections.current[userId];
    }

    const pc = new RTCPeerConnection();
    peerConnections.current[userId] = pc;

    pc.onicecandidate = (event) => {
      if (event.candidate) {
        socket?.emit('iceCandidate', {
          target: userId,
          candidate: event.candidate,
        });
      }
    };

    pc.ontrack = (event) => {
      remoteStreams.current[userId] = event.streams[0];
      setPeers({ ...remoteStreams.current });
    };

    return pc;
  };

  const createPeer = async (
    userId: string,
    localStream: MediaStream,
    isInitiator: boolean
  ) => {
    const pc = createPeerConnection(userId);

    localStream.getTracks().forEach((track) => pc.addTrack(track, localStream));

    if (isInitiator) {
      const offer = await pc.createOffer();
      await pc.setLocalDescription(offer);
      socket?.emit('offer', { target: userId, offer });
    }
  };

  const toggleAudio = () => {
    if (localStream) {
      const audioTracks = localStream.getAudioTracks();
      audioTracks.forEach((track) => {
        track.enabled = !track.enabled;
      });
      setIsAudioEnabled(!isAudioEnabled);
    }
  };

  const toggleVideo = () => {
    if (localStream) {
      const videoTracks = localStream.getVideoTracks();
      videoTracks.forEach((track) => {
        track.enabled = !track.enabled;
      });
      setIsVideoEnabled(!isVideoEnabled);
    }
  };

  const endCall = () => {
    if (localStream) {
      localStream.getTracks().forEach((track) => track.stop());
    }

    Object.values(peerConnections.current).forEach((pc) => pc.close());
    peerConnections.current = {};
    remoteStreams.current = {};
    setPeers({});
    setIsCallActive(false);
    socket?.emit('disconnectCall');
    socket?.disconnect();
    stopMediaTracks();
  };

  const joinAgain = () => {
    const socket = io(CHAT_APP_URL);
    setSocket(socket);

    startCall(trip!);
  };

  const getUserFullName = (socketId: string) => {
    const user: TripUsers | undefined =
      joinedUserDetails && joinedUserDetails[socketId];
    if (user) {
      return `${user.firstName} ${user.lastName}`;
    } else {
      return `Anonymous User`;
    }
  };

  const getUserDetailBySocketId = (socketId: string): TripUsers | undefined => {
    return joinedUserDetails ? joinedUserDetails[socketId] : undefined;
  };

  const participantCount = Object.keys(peers).length + 1;

  if (isLoading) {
    return <CustomSkeleton />;
  }

  if (trip?.tripUsers.length === 1) {
    return (
      <div className="flex flex-col items-center justify-center h-full px-8 py-12">
        <div className="relative mb-8">
          <div className="w-24 h-24 rounded-full flex items-center justify-center">
            <Users className="w-12 h-12" />
          </div>
        </div>

        <h2 className="text-4xl font-bold text-gray-800 text-center mb-4 max-w-2xl">
          Invite other users and start your video call conversations here
        </h2>

        <p className="text-lg text-gray-500 text-center mb-8 max-w-lg">
          Connect with your team members and begin collaborating
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
    <div className="h-full shadow-sm border-1 p-12 rounded-xl">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold">Group Call</h1>
            {participantCount} participant{participantCount !== 1 ? 's' : ''}
          </div>

          {isCallActive && (
            <div className="flex items-center gap-1">
              <Circle className="h-2 w-2 fill-green-500 text-green-500" />
              <span className="text-sm text-gray-500">Live</span>
            </div>
          )}
        </div>

        {/* Video Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-4 mb-6">
          {/* Local Video */}
          <Card className="relative overflow-hidden">
            <CardContent className="p-0">
              <div className="relative aspect-video">
                <video
                  ref={localVideoRef}
                  autoPlay
                  muted
                  playsInline
                  className="w-full h-full object-cover"
                />
                <div
                  className={`absolute bottom-3 left-3 ${
                    trip?.tripUsers.find(
                      (user) => user.userId === keycloak.subject
                    )?.badgeBgColor
                  } backdrop-blur-sm rounded-full px-3 py-1`}>
                  <span className="text-white text-sm font-medium">You</span>
                </div>
                {!isVideoEnabled && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <VideoOff className="h-8 w-8 text-slate-400" />
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Remote Videos */}
          {Object.entries(peers).map(([id, stream]) => (
            <Card
              key={id}
              className="relative overflow-hidden">
              <CardContent className="p-0">
                <div className="relative aspect-video">
                  <video
                    autoPlay
                    playsInline
                    className="w-full h-full object-cover"
                    ref={(el) => {
                      if (el && el.srcObject !== stream) {
                        el.srcObject = stream;
                      }
                    }}
                  />

                  <div
                    className={`absolute bottom-3 left-3 ${
                      `${getUserDetailBySocketId(id)?.badgeBgColor}` ||
                      'bg-black'
                    } backdrop-blur-sm rounded-full px-3 py-1`}>
                    <span className="text-white text-sm font-medium">
                      {getUserFullName(id)}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Control Panel */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-center gap-4">
              <Button
                variant={isAudioEnabled ? 'default' : 'destructive'}
                size="lg"
                onClick={toggleAudio}
                className="w-14 h-14 rounded-full">
                {isAudioEnabled ? (
                  <Mic className="h-6 w-6" />
                ) : (
                  <MicOff className="h-6 w-6" />
                )}
              </Button>

              <Button
                variant={isVideoEnabled ? 'default' : 'destructive'}
                size="lg"
                onClick={toggleVideo}
                className="w-14 h-14 rounded-full">
                {isVideoEnabled ? (
                  <Video className="h-6 w-6" />
                ) : (
                  <VideoOff className="h-6 w-6" />
                )}
              </Button>

              {isCallActive ? (
                <Button
                  variant="destructive"
                  size="lg"
                  onClick={endCall}
                  className="w-14 h-14 rounded-full">
                  <PhoneOff className="h-6 w-6" />
                </Button>
              ) : (
                <Button
                  size="lg"
                  onClick={joinAgain}
                  className="w-14 h-14 rounded-full">
                  <Phone className="h-6 w-6" />
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-center mt-10 border-t">
        {trip?.tripUsers.map((user, index) => (
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

export default GroupCall;
