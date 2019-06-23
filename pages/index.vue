<template>
  <div>
    <h1>{{ title }}</h1>
    <b-table
      :items="issueItems"
      :fields="[
        'serverKey',
        'issue.id',
        'issue.subject',
        'duration',
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
      <template #duration="{ item: { key } }">
        <template v-if="editingKey !== key">
          <div v-if="durations && durations[key]">
            {{ durations[key] | toHours }} ({{
              Math.floor(durations[key] / 1000 / 60)
            }})
          </div>
        </template>
        <b-form-input
          v-else
          v-model="editingDuration"
          size="sm"
          style="width: 5rem;"
        />
      </template>
      <template #actions="{ item: { key } }">
        <b-button
          v-if="editingKey !== key"
          variant="outline-secondary"
          size="sm"
          @click="onEdit(key)"
        >
          Edit
        </b-button>
        <template v-else>
          <b-button variant="secondary" size="sm" @click="onSave(key)">
            Save
          </b-button>
          <b-button variant="secondary" size="sm" @click="onSave(undefined)">
            Discard
          </b-button>
        </template>
        <b-button
          v-if="key !== targetIssueKey"
          variant="outline-secondary"
          size="sm"
          @click="onStart(key)"
        >
          Start
        </b-button>
        <b-button v-else variant="secondary" size="sm" @click="onStop(key)">
          Stop
        </b-button>
      </template>
    </b-table>
    <b-button variant="danger" @click="onClear">
      Clear
    </b-button>
    <h2>Send to Redmine</h2>
    <b-form @submit="onSend">
      <b-form-group label="Server:" label-for="redmine_key">
        <b-form-select
          id="redmine_key"
          v-model="serverKey"
          required
          :options="serverKeys"
        />
      </b-form-group>
      <b-form-group label="Day:" label-for="day">
        <b-form-input id="day" v-model="day" required type="date" />
      </b-form-group>
      <b-button type="submit" variant="primary">Send</b-button>
    </b-form>
  </div>
</template>

<script>
import proxyConfig from '@/proxy.config'
import {
  startTarget,
  stopTarget,
  setDuration,
  clearDurations,
  sendTimeCardToServer
} from '@/store'

const date = new Date()
const day = date.toISOString().split('T')[0]

const toHours = (ms, x = 0.25) => {
  const hours = ms / 1000 / 60 / 60
  return (((hours + x / 2) / x) | 0) * x
}

export default {
  filters: {
    toHours
  },
  data: () => ({
    proxyConfig,
    serverKey: undefined,
    issueNo: '',
    editingKey: undefined,
    editingDuration: undefined,
    startDate: undefined,
    day
  }),
  computed: {
    title() {
      return 'Time Card'
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
    },
    durations() {
      return this.$store.state.durations
    },
    targetIssueKey() {
      return this.$store.state.targetIssueKey
    }
  },
  methods: {
    onStart(key) {
      this.$store.commit(startTarget, { key, timestamp: Date.now() })
    },
    onStop(key) {
      this.$store.commit(stopTarget, { timestamp: Date.now() })
    },
    onSend(ev) {
      ev.preventDefault()
      this.$store.dispatch(sendTimeCardToServer, {
        serverKey: this.serverKey,
        day: this.day
      })
    },
    onClear(ev) {
      this.$store.commit(clearDurations)
    },
    onEdit(key) {
      this.editingKey = key
      const duration = this.durations[key]
      if (duration != null) {
        this.editingDuration = toHours(duration, 0.01)
      } else {
        this.editingDuration = 0
      }
    },
    onSave(key) {
      this.$store.commit(setDuration, {
        key,
        duration: this.editingDuration * 60 * 60 * 1000
      })
      this.editingKey = undefined
      this.editingDuration = undefined
    }
  }
}
</script>
