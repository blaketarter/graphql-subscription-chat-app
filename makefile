setup-all:
	make setup-client
	make setup-server

setup-client:
	cd client && npm ci

setup-server:
	cd server && npm ci

start-client:
	cd client && npm run start

start-server:
	cd server && npm run start