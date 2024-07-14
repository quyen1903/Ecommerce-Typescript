first please import node_modules
init expressjs and ts as usual
run app with this command

ts-node .\server.ts

please make sure you have postman and mongodb in you local machine
and we also need mongodb compass to test, for sure
i also upload .env file to run project.

JWT is nothing to do with authentication
JWT take responsibility for authorization

when user successfully login, server create asymmetric public/privatekey
server use privatekey to sign token, then server store publickey in db,
finally server send that token to user. 
When user need to authorize, server take user's token, then server verify
that token with publickey which is stored in database.
We store publickey in database, and we just drop privatekey.