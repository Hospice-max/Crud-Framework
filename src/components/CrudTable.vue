<template>
  <div class="table-container">
    <table>
      <thead>
        <tr>
          <th v-for="(column, index) in columns" :key="index">
            {{ column.label }}
          </th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(item, index) in items" :key="index">
          <td v-for="(column, colIndex) in columns" :key="colIndex">
            <slot :name="column.model" :item="item">{{ item[column.model] }}</slot>
          </td>
          <td>
            <button class="action-btn edit" @click="editItem(item)">Editer</button>
            <button class="action-btn delete" @click="deleteItem(index)">Effacer</button>
          </td>
        </tr>
      </tbody>
    </table>    
  </div>
</template>

<script setup>
import { defineProps, defineEmits, inject } from 'vue';

const props = defineProps({
  columns: Array,
  items: Array,
});

const emit = defineEmits(['edit', 'delete', 'add']);
const addNotification = inject("addNotification");

const editItem = (item) => {
  emit('edit', item);
};

const deleteItem = (index) => {
  emit('delete', index);
  addNotification("Utilisateur supprimé avec succès", "warning");
};

</script>

<style scoped>
.table-container {
  width: 100%;
  background: #fff;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.05);
}

table {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 20px;
}

th, td {
  padding: 15px;
  border: 1px solid #e0e0e0;
  color: #333;
  text-align: left;
}

th {
  background: #f8f8f8;
  font-weight: bold;
  text-transform: uppercase;
  letter-spacing: 1px;
}

tr {
  background: #fff;
  transition: background 0.3s ease;
}

tr:hover {
  background: #f8f8f8;
}

button {
  margin: 5px;
  cursor: pointer;
  border: none;
  border-radius: 5px;
  padding: 10px 15px;
  font-size: 14px;
  font-weight: bold;
  transition: all 0.3s ease;
}

.action-btn {
  background: #007bff;
  color: white;
}

.action-btn.edit {
  background: #28a745;
}

.action-btn.delete {
  background: #dc3545;
}

.add-btn {
  background: #017483be;
  color: white;
  padding: 10px 20px;
  font-size: 16px;
}

.add-btn:hover {
  background: #017483be;
  transform: translateY(-2px);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
}
</style>
