# auth-server

A NodeJS based Auth Server

### Steps for run this app in 🔐`HTTPS` mode

This is now required as part of [this commit](https://github.com/GouthamShiv/auth-server/commit/0b272c8d38214f0cf596cf078e016b61bcf3eae1) because I've added `helmet` 🪖 <br> A dependency which enforces additional security

- > Create a directory named `cert` under `src` <br> navigate to this `cert` directory

- > Create `key.pem` file <br> `openssl genrsa -out key.pem`

- > Create `csr.pem` file <br> `openssl req -new -key key.pem -out csr.pem`

- > Create `cert.pem` file <small>actual certificate file</small> <br> `openssl x509 -req -days 365 -in csr.pem -signkey key.pem -out cert.pem`

**NOTE:** openssl comes pre-installed on MAC and easy to get it on any linux distros.

So, for windows buddies hit [this link](https://stackoverflow.com/questions/50625283/how-to-install-openssl-in-windows-10), which takes you to a stack-overflow answer, which might help setting up openssl and probably get your certificates generated with the same commands as above _<small>(don't forget to create and navigate to the `cert` directory within `src`)<small>_

## License

[MIT](https://gouthamshiv.github.io/mit-license)
