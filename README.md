# AI-Powered Application Generator

🛠️ An AI-powered coding assistant built with [LangGraph](https://github.com/langchain-ai/langgraph). It works like a multi-agent development team that can take a natural language request and transform it into a complete, working project — file by file — using real developer workflows.

---

## 🏗️ Architecture Overview

The system follows a **multi-agent workflow** inspired by human software engineering teams:

1.  **Planner Agent**: Analyzes the user's natural language prompt and generates a structured project plan.
2.  **Architect Agent**: Breaks down the plan into specific implementation tasks, defining dependencies and integration points.
3.  **Coder Agent**: Executes each task, reading and writing files directly, using tools to simulate real development.

This architecture ensures **coherent, modular, and maintainable code generation**.

---

### 🔧 System Design Diagram

```mermaid
graph TD
    A[User Input] --> B[Planner Agent]
    B --> C[Architect Agent]
    C --> D[Coder Agent]
    D --> E[Generated Project Files]

    style B fill:#a8d0f5,stroke:#333
    style C fill:#a8d0f5,stroke:#333
    style D fill:#a8d0f5,stroke:#333
    style E fill:#e6f7ff,stroke:#333
    style A fill:#f0f9ff,stroke:#333

    subgraph "Agentic Workflow"
        B
        C
        D
    end

    subgraph "Output"
        E
    end
