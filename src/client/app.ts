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

const fetchUserMedia = async (): Promise<void> => {
  const stream = await navigator.mediaDevices.getUserMedia({
    video: true,
  });
  localVideo.srcObject = stream;
};

void fetchUserMedia();
