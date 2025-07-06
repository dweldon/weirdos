# Weirdos

A chat application for the Weirdos of Redding to communicate.

## Environment Variables

The following should be added to your `.env`:

- `PORT`: _port_
- `NODE_ENV`: _production_ or _development_ **(required)**

## Certificates

Generate the certificates for the development server:

```sh
$ cd ./src/certificates && ./generate.sh && cd -
```

## Commands

```sh
# Run the development server
$ bun dev

# Check the code
$ bun lint
$ bun type-check
$ bun format-check
```
