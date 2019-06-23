<template>
  <div>
    <h1>{{ title }}</h1>
    <b-table :items="serverItems" :fields="['path', 'url', 'actions']" small>
      <template #url="{ item: { path } }">
        <a v-if="proxyConfig[path]" :href="proxyConfig">{{
          proxyConfig[path].target
        }}</a>
      </template>
      <template #token="{ item: { token } }">
        {{ token | mask }}
      </template>
      <template #actions="{ item: { path } }">
        <b-button variant="secondary" size="sm" @click="onEdit(path)">
          Edit
        </b-button>
        <b-button variant="danger" size="sm" @click="onDelete(path)">
          Delete
        </b-button>
      </template>
    </b-table>
    <h2>Register Redmine Servers</h2>
    <b-form @submit="onRegister">
      <b-form-group label="Proxy Path:" label-for="proxy_path">
        <b-form-select
          id="proxy_path"
          v-model="proxyPath"
          required
          :options="Object.keys(proxyConfig)"
        />
      </b-form-group>
      <b-form-group label="Redmine Token:" label-for="redmine_token">
        <b-form-input
          id="redmine_token"
          v-model="redmineToken"
          type="password"
          required
          placeholder="Secret"
        ></b-form-input>
      </b-form-group>
      <b-button type="submit" variant="primary">Register</b-button>
    </b-form>
  </div>
</template>

<script>
import { addServer, removeServer } from '@/store'
import proxyConfig from '@/proxy.config'

export default {
  data: () => ({
    proxyConfig,
    proxyPath: undefined,
    redmineToken: ''
  }),
  computed: {
    title() {
      return 'Servers'
    },
    servers() {
      return this.$store.state.servers
    },
    serverKeys() {
      return this.$store.state.serverKeys
    },
    serverItems() {
      const items = []
      for (const key of this.serverKeys) {
        items.push({ path: key, ...this.servers[key] })
      }
      return items
    }
  },
  methods: {
    onRegister(ev) {
      ev.preventDefault()
      this.$store.commit(addServer, {
        key: this.proxyPath,
        server: {
          token: this.redmineToken
        }
      })
    },
    onEdit(path) {
      this.proxyPath = path
      this.redmineToken = this.servers[path].token
    },
    onDelete(path) {
      this.$store.commit(removeServer, {
        key: path
      })
    }
  }
}
</script>
