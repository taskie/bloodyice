<template>
  <h1>
    Home
  </h1>
  <div>
    <table class="table table-bordered table-sm">
      <tr>
        <th>id</th>
        <th>subject</th>
        <th>duration</th>
        <th>actions</th>
      </tr>
      <tr v-for="item in items" :key="item.id">
        <td>{{ item.id }}</td>
        <td>{{ item.subject }}</td>
        <td>{{ item.duration }}</td>
        <td>{{ item.actions }}</td>
      </tr>
    </table>
  </div>
</template>

<script setup>
const items = useState("items", () => [
  {
    id: 1,
    subject: "Subject 1",
    duration: 0,
  },
  {
    id: 2,
    subject: "Subject 2",
    duration: 0,
  },
  {
    id: 3,
    subject: "Subject 3",
    duration: 0,
  },
])
</script>