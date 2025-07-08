const currentLocation = (globalThis as unknown as Window).location;
const protocol = currentLocation.protocol === 'https:' ? 'wss:' : 'ws:';
const host = currentLocation.hostname || 'localhost';
const port = currentLocation.port || '3000';
const wsUrl = `${protocol}//${host}:${port}/ws`;

console.log('Connecting to WebSocket at:', wsUrl);

const ws = new WebSocket(wsUrl);

ws.onopen = () => {
  console.log('WebSocket connection established');
  ws.send('Hello from client!');
};

ws.onmessage = (event: MessageEvent) => {
  console.log('Received message:', event.data);
};

ws.onerror = (error: Event) => {
  console.error('WebSocket error:', error);
};

const localVideo = document.getElementById('local-video') as HTMLVideoElement;
let peerConnection: RTCPeerConnection;

const PEER_CONFIGURATION = {
  iceServers: [
    {
      urls: [
        'stun:stun.l.google.com:19302',
        'stun:stun1.l.google.com:19302',
        'stun:stun2.l.google.com:19302',
        'stun:stun3.l.google.com:19302',
        'stun:stun4.l.google.com:19302',
      ],
    },
  ],
};

const fetchUserMedia = async (): Promise<void> => {
  const stream = await navigator.mediaDevices.getUserMedia({
    video: true,
  });
  localVideo.srcObject = stream;
};

const createPeerConnection = async (): Promise<void> => {
  peerConnection = new RTCPeerConnection(PEER_CONFIGURATION);

  const localStream = localVideo.srcObject as MediaStream;
  localStream.getTracks().forEach((track) => {
    peerConnection.addTrack(track, localStream);
  });

  peerConnection.addEventListener('icecandidate', (e) => {
    if (e.candidate) {
      ws.send(
        JSON.stringify({
          type: 'ICE_CANDIDATE',
          candidate: e.candidate,
        })
      );
    }
  });

  const offer = await peerConnection.createOffer();
  await peerConnection.setLocalDescription(offer);
  ws.send(JSON.stringify({ type: 'OFFER', offer }));
};

const setup = async (): Promise<void> => {
  try {
    await fetchUserMedia();
    await createPeerConnection();
  } catch (error) {
    alert('Failed to start camera - did you allow access?');
  }
};

void setup();
