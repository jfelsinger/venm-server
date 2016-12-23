# Server and Methods

## Server `require('iq-lib-server')`

- `Server.instance(config, ssl)`

- `Server.routes.register((app, ...) => ...)`


- `Server.mw.register([name], (req, res, next) => ...)`
- `Server.mw.use(mwName, mwName2, ...)` / `.get()`
