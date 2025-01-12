import request from 'supertest';
import { app } from '../src/server';

describe('Jira MCP Server Tests', () => {
  // MCP Standard Endpoint Tests
  describe('Standard MCP Endpoints', () => {
    test('GET /health returns correct response', async () => {
      const response = await request(app).get('/health');
      expect(response.status).toBe(200);
      expect(response.body).toEqual({ status: 'healthy' });
    });

    test('GET /version returns semantic version', async () => {
      const response = await request(app).get('/version');
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('version');
      expect(response.body.version).toMatch(/^\d+\.\d+\.\d+$/);
    });
  });

  // Jira-Specific Endpoint Tests
  describe('Jira API Endpoints', () => {
    test('GET /api/v1/issues/:issueKey returns issue data', async () => {
      const response = await request(app).get('/api/v1/issues/TEST-1');
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('key');
      expect(response.body).toHaveProperty('fields');
    });

    test('GET /api/v1/sprint/current returns active sprint', async () => {
      const response = await request(app).get('/api/v1/sprint/current');
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('id');
      expect(response.body).toHaveProperty('issues');
    });

    test('GET /api/v1/analytics/workload returns workload data', async () => {
      const response = await request(app).get('/api/v1/analytics/workload');
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('assignees');
      expect(Array.isArray(response.body.assignees)).toBe(true);
    });
  });

  // Error Handling Tests
  describe('Error Handling', () => {
    test('Returns 404 for non-existent issue', async () => {
      const response = await request(app).get('/api/v1/issues/NONEXISTENT-1');
      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('error');
    });

    test('Returns 500 for invalid Jira credentials', async () => {
      // Temporarily invalidate credentials
      process.env.JIRA_API_TOKEN = 'invalid-token';
      
      const response = await request(app).get('/api/v1/sprint/current');
      expect(response.status).toBe(500);
      expect(response.body).toHaveProperty('error');
    });
  });
});