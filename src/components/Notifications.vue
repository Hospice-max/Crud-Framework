<template>
  <div class="notification-container">
    <div v-for="(notification, index) in notifications" :key="index" class="notification" :class="notification.type">
      {{ notification.message }}
      <button @click="removeNotification(index)">×</button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const notifications = ref([]);

const addNotification = (message, type = 'info') => {
  notifications.value.push({ message, type });
  setTimeout(() => removeNotification(notifications.value.length - 1), 3000); // Auto-remove after 3 seconds
};

const removeNotification = (index) => {
  notifications.value.splice(index, 1);
};

defineExpose({ addNotification });
</script>

<style scoped>
.notification-container {
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 1000;
}

.notification {
  padding: 10px 20px;
  margin-bottom: 10px;
  border-radius: 5px;
  color: white;
  display: flex;
  justify-content: space-between;
  align-items: center;
  animation: slideIn 0.5s ease-out;
}

.notification.info {
  background-color: #007bff;
}

.notification.success {
  background-color: #28a745;
}

.notification.warning {
  background-color: #dcd135;
}

button {
  background: none;
  border: none;
  color: white;
  cursor: pointer;
  font-size: 16px;
}

@keyframes slideIn {
  from {
    transform: translateX(100%);
  }
  to {
    transform: translateX(0);
  }
}
</style>