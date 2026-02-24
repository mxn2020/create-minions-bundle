---
title: Quick Start
description: "Get up and running with {{projectCapitalized}} in minutes"
---

## TypeScript

```typescript
import { createClient } from '{{sdkName}}';

const client = createClient();
console.log('Version:', client.version);
```

## Python

```python
from {{pythonModule}} import create_client

client = create_client()
print(f"Version: {client['version']}")
```

## CLI

```bash
{{cliCommand}} info
```
