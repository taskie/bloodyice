import { defineStore } from 'pinia';
import Ajv from 'ajv';

const ajv = new Ajv();

type Server = {
  name: string,
  url: string,
  issues: Issue[],
}

type TimeEntry = {
  issueId: number,
  hours: number,
  spentOn: string,
};

type Issue = {
  id: number,
  timeEntries: TimeEntry[],
  startedAt: Date,
  rawIssue: any,
}

const issueJsonSchema = {
  type: "object",
  properties: {
    id: { type: "int32" },
    subject: { type: "string" },
  },
  additionalProperties: true,
} as const;

const validateIssueJson = ajv.compile(issueJsonSchema);

type State = {
  servers: Server[],
}

export const useRedmineStore = defineStore('redmine', {
  state: () => ({
    servers: [],
  }) as State,
  actions: {
    addServer(server: Server) {
      this.servers.push(server)
    },
    async fetchIssue(serverName: string, issueId: number) {
      const server = this.servers.filter(server => server.name === serverName)[0];
      if (server == null) {
        return;
      }
      const { data } = await useFetch(`/api/servers/${serverName}/issues/${issueId}.json`, {
        headers: {
          "X-Redmine-API-Key": "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
        },
      });
      const issue = data.value;
      if (!validateIssueJson(issue)) {
        throw new Error(`invalid issue: ${issue}`);
      }
    }
  },
});