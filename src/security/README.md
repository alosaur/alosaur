## Alosaur Security

Contains the security and authorization middlewares for Alosaur

[More about Alosaur Session](https://github.com/alosaur/alosaur/tree/master/src/security/session)

[More about Alosaur Authorization &Authentication](https://github.com/alosaur/alosaur/tree/master/src/security/authorization)

### TODO

- [x] Identifications middlwares like session
  - [x] Sign session hash with [noble-secp256k1](https://github.com/paulmillr/noble-secp256k1)
- [x] SecurityContext: `context.security.auth.signOutAsync`, `signInAsync`, `identity`
- [x] Authentication schemas
  - [x] Cookies
  - [x] JWT
- [x] External auth strategies. [Docs](https://github.com/alosaur/alosaur/tree/master/src/security/oauth)
  - [x] OAuth handler base
    - [x] Google
    - [ ] Facebook
    - [ ] Twitter
- [x] Authorization decorators and hooks
- [x] Authorization decorators: roles
- [x] Authorization decorators: policy
- [ ] docs & examples
