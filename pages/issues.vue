<template>
  <div>
    <h1>{{ title }}</h1>
    <b-table
      :items="issueItems"
      :fields="[
        'serverKey',
        'issue.id',
        'issue.subject',
        'issue.status.name',
        'issue.start_date',
        'actions'
      ]"
      small
    >
      <template #issue.id="{ item: { serverKey, issue: { id } } }">
        <div v-if="proxyConfig[serverKey]">
          <b-link :href="proxyConfig[serverKey].target + `issues/${id}`">
            #{{ id }}
          </b-link>
        </div>
      </template>
      <template #actions="{ item: { key, serverKey, issue: { id } } }">
        <b-button
          variant="secondary"
          size="sm"
          @click="onReload(serverKey, id)"
        >
          Reload
        </b-button>
        <b-button variant="danger" size="sm" @click="onDelete(key)">
          Delete
        </b-button>
      </template>
    </b-table>
    <h2>Add Issue</h2>
    <b-form @submit="onAdd">
      <b-form-group label="Server:" label-for="redmine_key">
        <b-form-select
          id="redmine_key"
          v-model="serverKey"
          required
          :options="serverKeys"
        />
      </b-form-group>
      <b-form-group label="Issue No.:" label-for="issue_no">
        <b-form-input
          id="issue_no"
          v-model="issueNo"
          required
          placeholder="12345"
        />
      </b-form-group>
      <b-button type="submit" variant="primary">Register</b-button>
    </b-form>
  </div>
</template>

<script>
import { fetchIssue, removeIssue } from '@/store'
import proxyConfig from '@/proxy.config'

export default {
  data: () => ({
    proxyConfig,
    serverKey: undefined,
    issueNo: '',
    response: ''
  }),
  computed: {
    title() {
      return 'Issues'
    },
    servers() {
      return this.$store.state.servers
    },
    serverKeys() {
      return this.$store.state.serverKeys
    },
    issues() {
      return this.$store.state.issues
    },
    issueKeys() {
      return this.$store.state.issueKeys
    },
    issueItems() {
      const items = []
      for (const key of this.issueKeys) {
        items.push({ key, ...this.issues[key] })
      }
      return items
    }
  },
  methods: {
    async onAdd(ev) {
      ev.preventDefault()
      await this.onReload(this.serverKey, this.issueNo)
    },
    async onReload(serverKey, id) {
      await this.$store.dispatch(fetchIssue, { serverKey, id })
    },
    onDelete(key) {
      this.$store.commit(removeIssue, {
        key
      })
    }
  }
}
</script>
