# Pulse Project Boilerplate

Reusable documentation and agent setup for new production-bound projects in the Pulse workspace.

Designed for:

- React, Next.js and React Native.
- TypeScript.
- Tailwind or NativeWind.
- Express or NestJS.
- PostgreSQL.
- BMAD.
- CodeGraph.
- Codex/Caveman working modes.
- Ponytail integration hook.

## How To Use

1. Copy these files into a new project root.
2. Replace product placeholders in `SPEC.template.md`.
3. Configure the canonical Ponytail installer and run the complete bootstrap:

   ```powershell
   $env:PONYTAIL_INSTALL_COMMAND = '<canonical Ponytail install command>'
   .\scripts\bootstrap-agents.ps1
   ```

4. Keep `docs/` as the source of truth and update it with every behavior,
   architecture or QA change.

Bootstrap stops if Ponytail source is missing. This prevents installing an
unrelated package named `ponytail`.
