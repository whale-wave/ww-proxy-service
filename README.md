# Whale Wave Proxy Service

## Api

| path                                    | desc                             |
| --------------------------------------- | -------------------------------- |
| /api/proxy/get                          | Get proxy map Object<alias, url> |
| /api/proxy/get?alias={alias}            | Obtain url through alias         |
| /api/proxy/add?alias={alias}&url=${url} | Add proxy map record             |
| /api/proxy/set?alias={alias}&url=${url} | Modify proxy map record          |
| /api/proxy/delete?alias={alias}         | Delect proxy map record          |
| /api/proxy/to/{alias}{proxyUrl}         | Proxy url to target              |