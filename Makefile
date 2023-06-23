build:
	docker build . -t devlikeapro/whatsapp-http-api

build-plus:
	docker build . -t devlikeapro/whatsapp-http-api-plus

stop:
	docker stop whatsapp-http-api

clean: stop
	sudo rm -rf .sessions

push:
	docker push devlikeapro/whatsapp-http-api

update-swagger:
	wget http://localhost:3000/-json -O ./docs/site/static/swagger/openapi.json

update-dependencies:
	. ${NVM_DIR}/nvm.sh && nvm exec yarn upgrade whatsapp-web.js@https://github.com/pedroslopez/whatsapp-web.js
	. ${NVM_DIR}/nvm.sh && nvm exec yarn upgrade venom-bot

start-proxy:
	docker run --rm -d --name squid-container -e TZ=UTC -p 3128:3128 ubuntu/squid:5.2-22.04_beta
