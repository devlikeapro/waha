build:
	docker build . -t devlikeapro/whatsapp-http-api

build-chrome:
	docker build . -t devlikeapro/whatsapp-http-api:chrome --build-arg USE_BROWSER=chrome

build-noweb:
	docker build . -t devlikeapro/whatsapp-http-api:noweb --build-arg USE_BROWSER=none

build-all: build build-chrome build-noweb

build-plus:
	docker build . -t devlikeapro/whatsapp-http-api-plus

stop:
	docker stop whatsapp-http-api

clean: stop
	sudo rm -rf .sessions

push:
	docker push devlikeapro/whatsapp-http-api

for-swagger:
	WHATSAPP_SWAGGER_CONFIG_ADVANCED=true npm run start

update-swagger:
	wget http://localhost:3000/-json -O ./docs/site/static/swagger/openapi.json

update-dependencies:
	. ${NVM_DIR}/nvm.sh && nvm exec yarn up whatsapp-web.js@https://github.com/pedroslopez/whatsapp-web.js
	. ${NVM_DIR}/nvm.sh && nvm exec yarn up @adiwajshing/baileys@github:WhiskeySockets/Baileys
	. ${NVM_DIR}/nvm.sh && nvm exec yarn up venom-bot

start-proxy:
	docker run --rm -d --name squid-container -e TZ=UTC -p 3128:3128 ubuntu/squid:5.2-22.04_beta
