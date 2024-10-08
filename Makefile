build:
	docker build . -t devlikeapro/waha

build-chrome:
	docker build . -t devlikeapro/waha-plus:chrome --build-arg USE_BROWSER=chrome

build-noweb:
	docker build . -t devlikeapro/waha:noweb --build-arg USE_BROWSER=none

build-all: build build-chrome build-noweb

build-plus:
	docker build . -t devlikeapro/waha-plus

build-ssh:
	# check IMAGE provided
	@[ "${IMAGE}" ]  || ( echo "Add APP: make build-ssh image=devlikeapro/waha"; exit 1 );
	eval $(ssh-agent) && \
	ssh-add ~/.ssh/id_rsa && \
	docker buildx build --ssh default=${SSH_AUTH_SOCK} . -t ${IMAGE} --build-arg USE_BROWSER=none

stop:
	docker stop waha

clean: stop
	sudo rm -rf .sessions

push:
	docker push devlikeapro/waha

for-swagger:
	WHATSAPP_SWAGGER_CONFIG_ADVANCED=true . ${NVM_DIR}/nvm.sh && nvm exec yarn start

up-noweb:
	. ${NVM_DIR}/nvm.sh && nvm exec yarn up @adiwajshing/baileys@github:devlikeapro/Baileys#fork-master-channels-678

up-webjs:
	. ${NVM_DIR}/nvm.sh && nvm exec yarn up whatsapp-web.js@github:devlikeapro/whatsapp-web.js#fork-main-channels

start-proxy:
	docker run --rm -d --name squid-container -e TZ=UTC -p 3128:3128 ubuntu/squid:5.2-22.04_beta
