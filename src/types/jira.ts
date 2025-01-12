export interface JiraError {
  statusCode: number;
  message: string;
}

export interface JiraSprint {
  id: number;
  state: string;
  name: string;
  startDate: string;
  endDate: string;
}

export interface JiraBoard {
  id: number;
  name: string;
}

export interface JiraIssue {
  id: string;
  key: string;
  fields: {
    summary: string;
    description: string;
    issuetype: {
      name: string;
    };
    assignee: {
      displayName: string;
    };
    status: {
      name: string;
    };
  };
}

export interface SprintResponse {
  values: JiraSprint[];
}

export interface BoardResponse {
  values: JiraBoard[];
}

export interface IssueSearchResponse {
  issues: JiraIssue[];
}