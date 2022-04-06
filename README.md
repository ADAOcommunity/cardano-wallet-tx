# cardano-wallet-tx package

Allows creating transactions based on configuration, including minting and plutus scripts


It uses npm, TypeScript compiler, Jest, webpack, ESLint, Prettier, husky, pinst, commitlint. The production files include CommonJS, ES Modules, UMD version and TypeScript declaration files. 

For Cardano related operations it uses custom version of cardano serialization library from <a href="https://github.com/Berry-Pool/spacebudz" title="SpaceBudz">SpaceBudz repo</a> and CardanoKoios or Graphql instance to for chain data.

<p align="center">
<a href="https://github.com/" title="Github"><img src="https://github.com/get-icon/geticon/raw/master/icons/github-icon.svg" alt="Github" width="21px" height="21px"></a> <a href="https://code.visualstudio.com/" title="Visual Studio Code"><img src="https://github.com/get-icon/geticon/raw/master/icons/visual-studio-code.svg" alt="Visual Studio Code" width="21px" height="21px"></a> <a href="https://www.microsoft.com/windows" title="Windows"><img src="https://github.com/get-icon/geticon/raw/master/icons/microsoft-windows.svg" alt="Windows" width="21px" height="21px"></a> <a href="https://www.apple.com/macos/" title="Mac OS"><img src="https://github.com/get-icon/geticon/raw/master/icons/macOS.svg" alt="Mac OS" width="21px" height="21px"></a> <a href="https://www.linuxfoundation.org/" title="Linux"><img src="https://github.com/get-icon/geticon/raw/master/icons/linux-tux.svg" alt="Linux" width="21px" height="21px"></a> <a href="https://www.npmjs.com/" title="npm"><img src="https://github.com/get-icon/geticon/raw/master/icons/npm.svg" alt="npm" width="21px" height="21px"></a> <a href="https://www.typescriptlang.org/" title="Typescript"><img src="https://github.com/get-icon/geticon/raw/master/icons/typescript-icon.svg" alt="Typescript" width="21px" height="21px"></a> <a href="https://jestjs.io/" title="Jest"><img src="https://github.com/get-icon/geticon/raw/master/icons/jest.svg" alt="Jest" width="21px" height="21px"></a> <a href="https://webpack.js.org/" title="webpack"><img src="https://github.com/get-icon/geticon/raw/master/icons/webpack.svg" alt="webpack" width="21px" height="21px"></a> <a href="https://eslint.org/" title="ESLint"><img src="https://github.com/get-icon/geticon/raw/master/icons/eslint.svg" alt="ESLint" width="21px" height="21px"></a> <a href="https://prettier.io/" title="Prettier"><img src="https://github.com/get-icon/geticon/raw/master/icons/prettier.svg" alt="Prettier" width="21px" height="21px"></a> <a href="https://yarnpkg.com/" title="yarn"><img src="https://github.com/get-icon/geticon/raw/master/icons/yarn.svg" alt="yarn" width="21px" height="21px"></a>
</p>

## Development

### Set up tools and environment

You need to have [Node.js](https://nodejs.org/en/download/) installed. Node includes npm as its default package manager.

Open the whole package folder with a good code editor, preferably [Visual Studio Code](https://code.visualstudio.com/download). Consider installing VS Code extensions [ES Lint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint) and [Prettier](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode).

In the VS Code top menu: **Terminal** -> **New Terminal**

### Install dependencies

Install dependencies with npm:

```bash
npm i
```


### Build

Build production (distribution) files in your **dist** folder:

```bash
npm run build
```

It generates CommonJS (in **dist/cjs** folder), ES Modules (in **dist/esm** folder), bundled and minified UMD (in **dist/umd** folder), as well as TypeScript declaration files (in **dist/types** folder).

### Try it before publishing

Run:

```bash
npm link
```

[npm link](https://docs.npmjs.com/cli/v6/commands/npm-link) will create a symlink in the global folder, which may be **{prefix}/lib/node_modules/example-typescript-package** or **C:\Users\<username>\AppData\Roaming\npm\node_modules\example-typescript-package**.

Create an empty folder elsewhere, you don't even need to `npm init` (to generate **package.json**). Open the folder with VS Code, open a terminal and just run:

```bash
npm link example-typescript-package
```

This will create a symbolic link from globally-installed example-typescript-package to **node_modules/** of the current folder.

You can then create a, for example, **testnum.ts** file with the content:

```ts
import { Num } from 'example-typescript-package'
console.log(new Num(5).add(new Num(6)).val() === 11)
```

If you don't see any linting errors in VS Code, if you put your mouse cursor over `Num` and see its type, then it's all good.

Whenever you want to uninstall the globally-installed example-typescript-package and remove the symlink in the global folder, run:

```bash
npm uninstall example-typescript-package -g
```

### Prepare to publish

Create an [npm](https://www.npmjs.com/) account.

<details><summary><strong>Click to read this section if you do manual publishing</strong></summary>

#### Manual publishing to npm

Log in:

```bash
npm adduser
```

And publish:

```bash
npm publish
```

</details>

This package is configured to use GitHub Actions CI/CD to automate both the **npm** and **GitHub Packages** publishing process. The following are what you have to do.

#### CI publishing to npm

Follow [npm's official instruction](https://docs.npmjs.com/creating-and-viewing-access-tokens) to create an npm token. Choose "Publish" from the website, or use `npm token create` without argument with the CLI.

If you use 2FA, then make sure it's enabled for **authorization** only instead of **authorization and publishing** (**Edit Profile** -> **Modify 2FA**).

On the page of your newly created or existing GitHub repo, click **Settings** -> **Secrets** -> **New repository secret**, the **Name** should be `NPM_TOKEN` and the **Value** should be your npm token.

#### CI publishing to GitHub Packages

The default configuration of this example package **assumes you publish package with an unscoped name to npm**. GitHub Packages must be named with a scope name such as "@ADAOCommunity/example-typescript-package".

Change `scope: '@ADAOCommunity'` to your own scope in **.github/workflows/publish.yml**, also change `addscope` in **package.json**.

If you publish package with a scoped name to npm, change the name to something like "@ADAOCommunity/example-typescript-package" in **package.json**, and remove the `- run: npm run addscope` line in **.github/workflows/publish.yml**

If you publish your package to npm only, and don't want to publish to GitHub Packages, then delete the lines from `- name: Setup .npmrc file to publish to GitHub Packages` to the end of the file in **.github/workflows/publish.yml**.

(You might have noticed `secret.GITHUB_TOKEN` in **.github/workflows/publish.yml**. You don't need to set up a secret named `GITHUB_TOKEN` actually, it is [automatically created](https://docs.github.com/en/free-pro-team@latest/actions/reference/authentication-in-a-workflow#about-the-github_token-secret))

### Publish

Now everything is set. The example package has automated tests and upload (publishing) already set up with GitHub Actions:

- Every time you `git push` or a pull request is submitted on your `master` or `main` branch, the package is automatically tested against the desired OS and Node.js versions with GitHub Actions.
- Every time an [**annotated**](https://git-scm.com/book/en/v2/Git-Basics-Tagging#_annotated_tags) (not [lightweight](https://git-scm.com/book/en/v2/Git-Basics-Tagging#_lightweight_tags)) "v*" tag is pushed onto GitHub, a GitHub release is automatically generated from this version, it also automatically publishes to the npm registry and/or GitHub Packages registry to update the package there.
  - [`npm version`](https://docs.npmjs.com/cli/version/) / [`yarn version`](https://yarnpkg.com/cli/version) is useful to create tags.
  - (npm or yarn v1, not yarn v2) You could also add `"postversion": "git push --follow-tags"` to **package.json** file to push it automatically after `npm` or `yarn` `version`.
  - (yarn v1, not v2) because `yarn version` doesn't check whether there are uncommitted changes, you can add `"preversion": "git diff-index --quiet HEAD --"` to **package.json**
    - Note: `preversion`, `postversion` doesn't work in yarn v2

For npm registry: you can unpublish a version or the whole package but can never re-publish the same version under the same name.

If you want to modify the description / README on the npm package page, you have to publish a new version. You can modify the description on GitHub Packages without publishing.

## Notes

- It uses npm but you can easily switch to yarn, of course (remember to change all "npm" in `scripts` in the file **package.json**)
  - Whether you use npm as your package manager ≠ Whether you can publish to the npm registry
- Works fine in VS Code. In my configuration **.eslintrc** and **.prettierrc** cooperate perfectly
- See `scripts` in **package.json** for other predefined script commands
- [pinst](https://github.com/typicode/pinst) is used to solve [a problem of husky](https://typicode.github.io/husky/#/?id=yarn-2)
- The installation of the package with npm, yarn v1 and yarn v2+ is ensured in [this test](https://github.com/tomchen/example-typescript-package-test)

## References

- [Creating and publishing unscoped public packages - npm docs](https://docs.npmjs.com/creating-and-publishing-unscoped-public-packages)
- [npm-publish - npm docs](https://docs.npmjs.com/cli/v6/commands/npm-publish)
- [Publishing - TypeScript docs](https://www.typescriptlang.org/docs/handbook/declaration-files/publishing.html)
- [Publishing Node.js packages - GitHub Docs](https://docs.github.com/en/free-pro-team@latest/actions/guides/publishing-nodejs-packages)
