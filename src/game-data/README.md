# Game Data (Editable Story Content)

Edit story content here (JSON files). React/components should contain **only UI + logic**.

## Folder guide

- `characters/` — character profiles / dossiers
- `cases/` — case metadata
- `emails/` — mail content shown in MailApp
- `dialogues/` — dialogue sequences (calls, scenes)
- `evidence/` — evidence items
- `websites/` — website page data/content
- `notes/` — notes/objectives content

## Editing workflow

1. Duplicate an existing `.json` file in the right folder
2. Change the text/fields
3. Save — the game loads it automatically (Vite dev server HMR)

No JSX editing for content.

