import { onMounted, onUnmounted } from 'vue';

export function useWebSocket(callback) {
  let socket;

  onMounted(() => {
    socket = new WebSocket('ws://localhost:8080');

    socket.onmessage = (event) => {
      callback(event.data);
    };
  });

  onUnmounted(() => {
    socket.close();
  });
}
