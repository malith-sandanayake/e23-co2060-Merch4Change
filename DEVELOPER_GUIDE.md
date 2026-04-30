# Developer Guide

## Coding Standards

- Use camelCase for variables
- Use PascalCase for React components
- Keep components small and reusable

Example:
UserProfile.jsx
ProductCard.jsx

## Git Workflow

1. Create a branch
git checkout -b feature/profile-page

2. Commit changes
We follow the **Conventional Commits** specification. The format should be:
`<type>[optional scope]: <description>`

**Allowed Types:**
- `feat`: A new feature
- `fix`: A bug fix
- `docs`: Documentation only changes
- `style`: Changes that do not affect the meaning of the code (white-space, formatting, etc.)
- `refactor`: A code change that neither fixes a bug nor adds a feature
- `perf`: A code change that improves performance
- `test`: Adding missing tests or correcting existing tests
- `chore`: Changes to the build process or auxiliary tools (e.g., updating dependencies)

**Examples:**
- `feat(auth): add login form validation`
- `fix(navbar): resolve mobile menu overflow issue`
- `chore(deps): update react to v18`
- `docs(readme): add setup instructions`

git commit -m "feat(profile): add user layout"

3. Push branch
git push origin feature/profile-page

4. Create Pull Request

## File Naming Rules

Components:
PascalCase

Example:
Sidebar.jsx
UserCard.jsx

CSS Files:
Same name as component

Example:
Sidebar.css

## Environment Variables

Create a `.env` file in the root folder.

Example:

REACT_APP_API_URL=http://localhost:5000

## Adding a New Page

Steps:

1. Create file inside `/pages`
2. Create CSS file
3. Add route in `App.jsx`

Example:

pages/
   Profile.jsx
   Profile.css