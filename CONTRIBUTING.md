# About Contributing

Hello there! 🎉  
We’re excited that you want to contribute to **@rzl-zone/utils-js**. 🙌  
This guide will help you set things up so you can start building, improving, and sharing awesome utilities with the community.

---

## How you can contribute?

We welcome all types of contributions, including:

- Bug fixes.
- New utility features.
- Documentation improvements.
- Refactors or performance improvements.

No contribution is too small — every PR helps make the project better! 

---

## Getting started

Follow these steps to set up your local development environment:

1. **Fork the repository**  
    _Click the **Fork** button at the top-right of the [**repository page**](https://github.com/rzl-zone/utils-js)._  
    This creates your own copy of the project under your GitHub account.

2. **Clone your fork**

    ```bash title="terminal"
    # If you're contributing via a personal fork
    git clone https://github.com/[YOUR-USERNAME]/utils-js.git

    # Or, if you're part of the rzl-zone organization
    git clone https://github.com/rzl-zone/utils-js.git

    # Navigate into the project directory
    cd utils-js
    ```

3. **Install dependencies**

    ```bash title="terminal"
    npm install
    ```

4. **Create a new branch**  
    It’s best practice to work on a dedicated feature branch instead of the **`main` br**anch.
    ```bash title="terminal"
    git checkout -b feature/my-awesome-feature
    ```

5. **Make your changes, add tests script**  
    _Make your updates or add new utilities, then run the test suite and build the project:_

    ```bash title="terminal"
    npx vitest run
    npm run build
    ```

6. **Commit your changes**  
    *Use clear and descriptive commit messages that follow the conventional commit style:*

    ```bash title="terminal"
    git add .
    git commit -m "feat: add my awesome feature"
    ```

7. **Push to your fork**

    ```bash title="terminal"
    git push origin feature/my-awesome-feature
    ```

8. **Create a Pull Request (PR)**  
    Go to your fork on GitHub, click Compare & pull request, and submit your **PR**.  
    *Please ensure your branch is up-to-date with the latest **`main`** before submitting.*

---

> 🧑‍💻 **For internal contributors:**  
>    Use the `main` branch for maintenance or version bumps only, all features and fixes should go through a feature branch and PR review.

---

## Code style

- Use **TypeScript** for all new code.
- Follow the existing **folder and file structure**.
- Keep functions **small and focused**.
- Write **meaningful commit messages** (use [**Conventional Commits**](https://www.conventionalcommits.org/)).

---

## Before you submit
- Ensure the project **builds successfully**.
- Run **tests** and confirm all pass.
- Fix any **lint or TypeScript errors**.
- Rebase if your branch is behind **`main`**.

---

## Thank you

We truly appreciate your contribution!  
Whether it’s fixing a typo, improving a function, or adding a new utility — you’re awesome. ✨

**_Made with ❤️ [**@rzl-app**](https://github.com/rzl-app)_**.
