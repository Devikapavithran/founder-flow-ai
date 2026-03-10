import { AgentConfig } from './types';
import { z } from 'zod';

export const AGENT_CONFIGS: AgentConfig[] = [
  {
    "id": "435bcf6d-4c20-443b-8dfe-76e20136bb68",
    "name": "FounderFlow AI Growth Assistant",
    "description": "A specialized sales strategist for startup founders that acts as an autonomous research and outreach arm.",
    "triggerEvents": [
      {
        "name": "lead_discovery_submitted",
        "description": "When a user submits industry and target criteria, the agent searches for companies, enriches their profiles, and applies initial lead scoring.",
        "type": "sync",
        "outputSchema": z.any()
      },
      {
        "name": "outreach_draft_requested",
        "description": "When a user selects a lead for contact, the agent analyzes the lead's specific pain points and company summary to generate a personalized message.",
        "type": "sync",
        "outputSchema": z.any()
      },
      {
        "name": "lead_status_change",
        "description": "When a lead is moved to a new stage or their profile is updated, the agent recalculates the lead score and generates a new 'Next Action' suggestion.",
        "type": "sync",
        "outputSchema": z.any()
      }
    ],
    "config": {
      "appId": "e8f62dbc-344b-44a1-92e3-28354a16aa46",
      "accountId": "434f05ef-e671-4547-be7c-12aa44c0c7cf",
      "widgetKey": "rQ2o4mPgFw98dedbUqjyXXz88r9PuUNVR9pWravK"
    }
  }
];
