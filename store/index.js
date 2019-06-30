import axios from 'axios'

const initialState = {
  servers: {},
  serverKeys: [],
  issues: {},
  issueKeys: [],
  targetIssueKey: undefined,
  targetStartTimestamp: undefined,
  durations: {}
}

const uniq = xs => Array.from(new Set(xs))

export const state = () => initialState

export const addServer = 'ADD_SERVER'
export const removeServer = 'REMOVE_SERVER'
export const addIssue = 'ADD_ISSUE'
export const removeIssue = 'REMOVE_ISSUE'
export const setTargetIssueKey = 'SET_TARGET_ISSUE_KEY'
export const setTargetStartTimestamp = 'SET_TARGET_START_TIMESTAMP'
export const resolveTarget = 'RESOLVE_TARGET'
export const startTarget = 'START_TARGET'
export const stopTarget = 'STOP_TARGET'
export const addDuration = 'ADD_DURATION'
export const setDuration = 'SET_DURATION'
export const clearDurations = 'CLEAR_DURATIONS'
export const sendTimeCardToServer = 'SEND_TIME_CARD_TO_SERVER'

export const mutations = {
  [addServer]: (state, { key, server }) => {
    state.servers = { ...state.servers, [key]: server }
    state.serverKeys = uniq([...state.serverKeys, key])
  },
  [removeServer]: (state, { key }) => {
    delete state.servers[key]
    state.serverKeys = state.serverKeys.filter(x => x !== key)
  },
  [addIssue]: (state, { serverKey, issue }) => {
    const sKey = '' + serverKey + issue.id
    state.issues = { ...state.issues, [sKey]: { serverKey, issue: issue } }
    state.issueKeys = uniq([...state.issueKeys, sKey])
  },
  [removeIssue]: (state, { key }) => {
    const sKey = '' + key
    delete state.issues[sKey]
    state.issueKeys = state.issueKeys.filter(x => x !== sKey)
  },
  [setTargetIssueKey]: (state, { key }) => {
    state.targetIssueKey = key
  },
  [setTargetStartTimestamp]: (state, { timestamp }) => {
    state.targetStartTimestamp = timestamp
  },
  [startTarget]: (state, { key, timestamp }) => {
    mutations[resolveTarget](state, { timestamp })
    mutations[setTargetIssueKey](state, { key })
    mutations[setTargetStartTimestamp](state, { timestamp })
  },
  [stopTarget]: (state, { timestamp }) => {
    mutations[resolveTarget](state, { timestamp })
    mutations[setTargetIssueKey](state, { key: undefined })
    mutations[setTargetStartTimestamp](state, { timestamp: undefined })
  },
  [resolveTarget]: (state, { timestamp }) => {
    if (state.targetIssueKey == null || state.targetStartTimestamp == null) {
      return
    }
    const duration = timestamp - state.targetStartTimestamp
    mutations[addDuration](state, { key: state.targetIssueKey, duration })
  },
  [addDuration]: (state, { key, duration }) => {
    if (key in state.durations) {
      state.durations = {
        ...state.durations,
        [key]: state.durations[key] + duration
      }
    } else {
      state.durations = {
        ...state.durations,
        [key]: duration
      }
    }
  },
  [setDuration]: (state, { key, duration }) => {
    state.durations = { ...state.durations, [key]: duration }
  },
  [clearDurations]: state => {
    state.durations = {}
    state.targetIssueKey = undefined
    state.targetStartTimestamp = undefined
  }
}

export const fetchIssue = 'FETCH_ISSUE'

const toHours = (ms, x = 0.25) => {
  const hours = ms / 1000 / 60 / 60
  return (((hours + x / 2) / x) | 0) * x
}

export const actions = {
  [fetchIssue]: async ({ commit, state }, { serverKey, id }) => {
    const server = state.servers[serverKey]
    const resp = await axios.get(
      serverKey + '/issues/' + encodeURIComponent(id) + '.json',
      {
        params: {
          key: server.token
        }
      }
    )
    commit(addIssue, {
      serverKey: serverKey,
      issue: resp.data.issue
    })
  },
  [sendTimeCardToServer]: async ({ commit, state }, { serverKey, day }) => {
    if (state.issues == null || state.servers == null) {
      return
    }
    const server = state.servers[serverKey]
    for (const [key, duration] of Object.entries(state.durations)) {
      const issue = state.issues[key]
      if (issue.serverKey === serverKey) {
        if (issue.issue == null) {
          continue
        }
        const hours = toHours(duration)
        if (hours === 0) {
          continue
        }
        const bodyXml = `<?xml version="1.0" encoding="UTF-8"?>
<time_entry>
  <issue_id>${issue.issue.id}</issue_id>
  <hours>${hours}</hours>
  <spent_on>${day}</spent_on>
</time_entry>
`
        await axios.post(serverKey + '/time_entries.xml', bodyXml, {
          params: {
            key: server.token
          },
          headers: {
            'Content-Type': 'application/xml'
          }
        })
        commit(setDuration, { key, duration: undefined })
      }
    }
  }
}
