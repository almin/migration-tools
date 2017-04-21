# migration-tools

Migration scripts for [Almin](https://github.com/almin/almin "Almin").

## Install

Install with [npm](https://www.npmjs.com/):

    npm install @almin/migration-tools

## Usage

### Migrate 0.11 to 0.12

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
