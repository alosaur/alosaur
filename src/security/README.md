## Alosaur Security

Contains the security and authorization middlewares for Alosaur

### TODO

- [x] Identifications middlwares like session
  - [x] Sign session hash with [noble-secp256k1](https://github.com/paulmillr/noble-secp256k1)
- [x]  SecurityContext: `context.security.auth.signOutAsync`, `signInAsync`, `identity`
- [ ] Authentication schemas
  - [x] Cookies
  - [ ] JWT
- [ ] External auth strategies
  - [ ] OAuth handler base
      - [ ] Google
      - [ ] Facebook
      - [ ] Twitter
      - [ ] ...
- [x] Authorization decorators and hooks
- [x] Authorization decorators: roles
- [x] Authorization decorators: policy
- [ ] docs & examples
