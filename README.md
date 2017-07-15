# migration-tools [![Build Status](https://travis-ci.org/almin/migration-tools.svg?branch=master)](https://travis-ci.org/almin/migration-tools)

Migration scripts for [Almin](https://github.com/almin/almin "Almin").

## Install

Install with [npm](https://www.npmjs.com/):

    npm install -g @almin/migration-tools

## Usage

Simply run `almin-migration-tools` in your terminal and answer a few questions.
You can pass a filename directly to the CLI. If you do not, you will be prompted for one.

Ensure you have a backup of your source code or commit the latest changes before running this.

	Usage
	  $ almin-migration-tools [<file|glob> ...]

	Options
	  --help         Show help.
	  --force, -f    Bypass safety checks and forcibly run codemods

	Available upgrades
	  - 0.12.x → 0.13.x

### Migrate 0.12 to 0.13

Run `almin-migration-tools`  

- Renaming: `context.on*` to `context.events.on*` without `context.onChange`
     - `Context.onChange` is still on `Context` prototype.
     - Because, it is not life-cycle events and it is optimized for updating UI.

```js
context.onWillExecuteEachUseCase((payload, meta) => {});
context.onDispatch((payload, meta) => {});
context.onDidExecuteEachUseCase((payload, meta) => {});
context.onCompleteEachUseCase((payload, meta) => {});
context.onErrorDispatch((payload, meta) => {});
```

to

```js
context.events.onWillExecuteEachUseCase((payload, meta) => {});
context.events.onDispatch((payload, meta) => {});
context.events.onDidExecuteEachUseCase((payload, meta) => {});
context.events.onCompleteEachUseCase((payload, meta) => {});
context.events.onErrorDispatch((payload, meta) => {});
```

### Migrate 0.11 to 0.12

**Notes**: Sadly, this old migration script is not automated...

Please do following steps. 

### Convert Store#getState scripts

**Target**: Store files

```bash
# Install to global
npm install -g jscodeshift @almin/migration-tools 
# Run migration scripts
## Target: your almin store files
### Notice: Use this script with `--run-in-band` arguments(serial running)
jscodeshift --run-in-band -t `npm root -g`/@almin/migration-tools/scripts/store-get-state-return-object-to-flat.js <path>
```

Store#getState return value migration.
This script migrate following adn write stats to `almin-store-state-mapping.json`.
Found Following pattern and replace

```js
class MyStore extends Store {
    getState() {
       return {
           stateName: state
       }
    }
}
```

with

```js
class MyStore extends Store {
    getState() {
       return state;
    }
}
```

This script output stats as `almin-store-state-mapping.json`.
The `almin-store-state-mapping.json` is used with next script(Convert StoreGroup constructor).

### Convert StoreGroup constructor

**Target**: StoreGroup file

```bash
# Install to global
npm install -g jscodeshift @almin/migration-tools 
# Run migration scripts
## Target: your almin StoreGroup file
jscodeshift -t `npm root -g`/@almin/migration-tools/scripts/store-group-arguments.js <path>
```

Migrate StoreGroup constructor arguments.
This script migrate following using `store-state-mapping.json`.


```js
new StoreGroup([
  new CartStore(cartRepository),
  new CustomerStore(customerRepository),
  new ProductStore(productRepository)
])
```
with

```js
new StoreGroup({
  "cart": new CartStore(cartRepository),
  "customer": new CustomerStore(customerRepository),
  "product": new ProductStore(productRepository)
});
```

### Options

- `mapping`: path to `almin-store-state-mapping.json`.
    - Default: using `almin-store-state-mapping.json` in current directory.

## Changelog

See [Releases page](https://github.com/almin/migration-tools/releases).

## Running tests

Install devDependencies and Run `npm test`:

    npm i -d && npm test

## Contributing

Pull requests and stars are always welcome.

For bugs and feature requests, [please create an issue](https://github.com/almin/migration-tools/issues).

1. Fork it!
2. Create your feature branch: `git checkout -b my-new-feature`
3. Commit your changes: `git commit -am 'Add some feature'`
4. Push to the branch: `git push origin my-new-feature`
5. Submit a pull request :D

## Author

- [github/azu](https://github.com/azu)
- [twitter/azu_re](https://twitter.com/azu_re)

## License

MIT © azu

## Thanks

[avajs/ava-codemods: Codemods for AVA](https://github.com/avajs/ava-codemods "avajs/ava-codemods: Codemods for AVA")
